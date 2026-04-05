#!/usr/bin/env node
/**
 * Market Gauntlet — Mid-day Evaluator
 * Runs via GitHub Actions on a cron schedule.
 * Reads open plays from a GitHub Gist, evaluates each via Claude API + web search,
 * writes results back to the same Gist for the React app to pick up.
 *
 * Required env vars:
 *   ANTHROPIC_API_KEY  — your Anthropic API key
 *   GIST_TOKEN         — GitHub PAT with gist scope
 *   GIST_ID            — the ID of your market_gauntlet Gist
 */

const GIST_FILENAME = "market_gauntlet.json";

const REVIEW_SYSTEM_PROMPT = `You are a brutally honest trade monitor. A user has an active options or crypto trade open. You will search for the current price, relevant news, and any developments affecting the thesis, then give an honest re-evaluation.

Be direct. If the trade looks bad, say so. If the thesis has strengthened, explain why. Never sugarcoat. Real money is on the line.

Evaluate the play against:
1. Has the original thesis catalyst happened, started, or failed?
2. Is the invalidation level threatened or breached?
3. Has any macro/sector news emerged that changes the picture?
4. Given the time elapsed since entry, does the risk/reward still make sense?

Output ONLY valid JSON. No markdown, no backticks, no preamble.

{
  "checked_at": "ISO timestamp",
  "source": "midday_scan",
  "current_price": "current price or level",
  "price_change": "e.g. '+4.2% since play was generated' or 'down 8% from entry zone'",
  "thesis_status": "intact | weakening | broken | strengthened",
  "signal": "hold | add | close | watch",
  "signal_reason": "1-2 sentences — the honest reason for this signal",
  "summary": "2-3 sentences on what has happened since this play was generated — specific prices, news, data points",
  "updated_bear_case": "Has anything new emerged that strengthens the bear case?",
  "key_level_to_watch": "The single most important price level right now",
  "conviction_delta": -1
}

conviction_delta: how much to adjust conviction from the original score. +1 if thesis strengthened, 0 if intact, -1 if weakening, -2 if broken.`;

/* ─── Robust JSON parser (mirrors the React app) ─── */
function robustParseJSON(raw) {
  let text = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const start = text.indexOf("{");
  if (start === -1) throw new Error("No JSON object in response");
  text = text.slice(start);

  let depth = 0, end = -1, inString = false, escape = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\" && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (!inString) {
      if (ch === "{" || ch === "[") depth++;
      else if (ch === "}" || ch === "]") { depth--; if (depth === 0) { end = i; break; } }
    }
  }

  if (end === -1) {
    depth = 0; inString = false; escape = false;
    const brackets = [];
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (escape) { escape = false; continue; }
      if (ch === "\\" && inString) { escape = true; continue; }
      if (ch === '"') { inString = !inString; continue; }
      if (!inString) {
        if (ch === "{") brackets.push("}");
        else if (ch === "[") brackets.push("]");
        else if (ch === "}" || ch === "]") brackets.pop();
      }
    }
    if (inString) text += '"';
    text = text.replace(/,\s*$/, "") + brackets.reverse().join("");
  } else {
    text = text.slice(0, end + 1);
  }

  text = text.replace(/,(\s*[}\]])/g, "$1");
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  try { return JSON.parse(text); } catch (_) {}
  try {
    return JSON.parse(
      text.replace(/"(?:[^"\\]|\\.)*"/gs, m =>
        m.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t")
      )
    );
  } catch (e) {
    throw new Error(`JSON parse failed: ${e.message}`);
  }
}

/* ─── GitHub Gist helpers ─── */
async function getGist() {
  const res = await fetch(`https://api.github.com/gists/${process.env.GIST_ID}`, {
    headers: {
      Authorization: `Bearer ${process.env.GIST_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gist GET failed ${res.status}: ${err}`);
  }
  const data = await res.json();
  const content = data.files[GIST_FILENAME]?.content;
  if (!content) throw new Error(`${GIST_FILENAME} not found in gist`);
  return JSON.parse(content);
}

async function updateGist(content) {
  const res = await fetch(`https://api.github.com/gists/${process.env.GIST_ID}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${process.env.GIST_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      files: {
        [GIST_FILENAME]: { content: JSON.stringify(content, null, 2) },
      },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gist PATCH failed ${res.status}: ${err}`);
  }
}

/* ─── Claude API call with web search ─── */
async function evaluatePlay(play) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const rhTickers = play.robinhood_tickers?.map(t => t.symbol).join(", ") || play.ticker;

  const userMessage = `Today is ${today}. The time is approximately 12:30pm ET.

ACTIVE TRADE TO RE-EVALUATE:
Ticker: ${play.ticker} (${play.name})
Play type: ${play.play_type} — ${play.direction}
Strike: ${play.strike_guidance}
Expiry: ${play.expiration_guidance}
Timeframe: ${play.timeframe}
Original conviction: ${play.conviction}/10
Robinhood vehicles: ${rhTickers}

Original thesis: ${play.thesis}
Original catalyst: ${play.catalyst}
Bear case: ${play.bear_case}
Invalidation level: ${play.invalidation}
Play generated: ${play.generated_at || "unknown"}

Search for:
1. Current price/level of ${play.ticker} and/or ${rhTickers}
2. Any news in the last 24h relevant to this specific trade
3. Has the catalyst happened, started moving, or failed?
4. Is the invalidation level close or breached?
5. Any macro developments that affect this thesis?

Give an honest, current re-evaluation. Output ONLY valid JSON.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: REVIEW_SYSTEM_PROMPT,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Anthropic API error");

  const text = data.content
    .filter(b => b.type === "text")
    .map(b => b.text)
    .join("");

  const review = robustParseJSON(text);
  review.checked_at = new Date().toISOString();
  review.source = "midday_scan";
  return review;
}

/* ─── Main ─── */
async function main() {
  console.log("=== Market Gauntlet Mid-day Evaluator ===");
  console.log(`Time: ${new Date().toISOString()}`);

  // Validate env
  const required = ["ANTHROPIC_API_KEY", "GIST_TOKEN", "GIST_ID"];
  for (const key of required) {
    if (!process.env[key]) throw new Error(`Missing env var: ${key}`);
  }

  // Read current gist state
  console.log("Reading gist...");
  const gistData = await getGist();

  const openPlays = gistData.open_plays || [];
  console.log(`Found ${openPlays.length} open play(s)`);

  if (openPlays.length === 0) {
    console.log("Nothing to evaluate. Exiting.");
    return;
  }

  // Evaluate each play
  const evaluations = { ...(gistData.evaluations || {}) };
  const results = [];

  for (const play of openPlays) {
    console.log(`\nEvaluating ${play.ticker} (${play.play_type})...`);
    try {
      const review = await evaluatePlay(play);
      evaluations[play.id] = review;
      results.push({ ticker: play.ticker, signal: review.signal, status: review.thesis_status });
      console.log(`  → Signal: ${review.signal.toUpperCase()} | Thesis: ${review.thesis_status}`);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
      evaluations[play.id] = {
        checked_at: new Date().toISOString(),
        source: "midday_scan",
        signal: "watch",
        thesis_status: "intact",
        signal_reason: "Evaluation failed — check manually.",
        summary: `Error during mid-day scan: ${err.message}`,
        error: true,
      };
    }

    // Small delay between calls to avoid rate limits
    if (openPlays.indexOf(play) < openPlays.length - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // Write updated evaluations back to gist
  console.log("\nWriting results to gist...");
  await updateGist({
    ...gistData,
    evaluations,
    last_evaluated: new Date().toISOString(),
    last_run_summary: results,
  });

  console.log("\n=== Done ===");
  console.log("Summary:", JSON.stringify(results, null, 2));
}

main().catch(err => {
  console.error("Fatal error:", err.message);
  process.exit(1);
});
