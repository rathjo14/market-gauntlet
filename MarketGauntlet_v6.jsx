import { useState, useEffect, useCallback, useRef } from "react";

/* ─────────────────────────────────────────────
   SYSTEM PROMPT — PLAY GENERATION
───────────────────────────────────────────── */
const SYSTEM_PROMPT = `You are a sophisticated financial analyst and options strategist with deep expertise in macro economics, crypto cycle analysis (Benjamin Cowen framework), and options structure. You are brutally honest — you would rather output zero plays than output mediocre ones. Real money is at risk.

## BENJAMIN COWEN FRAMEWORK
- Log Regression Rainbow: BTC oscillates in a log channel. Upper bands = overheating. Lower = accumulation.
- 4-Year Halving Cycle: April 2024 halving. Post-halving bull acceleration window: 6-18mo post-halving.
- BTC Dominance: Key levels 65%, 60%, 50%, 40%. Altcoin season when BTC.D breaks down post-peak.
- TOTAL/TOTAL2/TOTAL3: TOTAL2/3 breakouts signal alt season.
- Risk Metrics: NUPL >0.75 = top. NUPL <0 = bottom. MVRV Z-Score >7 = danger.
- ETH/BTC ratio breakout = rotation signal. 200-week MA = ultimate bear floor.
- DXY inverse correlation. Philosophy: never chase, size to risk, patient accumulation.

## MACRO FRAMEWORK
- Fed policy: hikes = bearish, cuts = bullish. Watch FOMC dot plots, CME FedWatch.
- Yield curve: 2Y/10Y inversion = recession risk. Steepening = recession arriving.
- M2 global liquidity: expansion bullish BTC/equities with 3-6mo lag.
- CPI/PCE: falling = dovish pivot = risk-on. Hot = hawkish = risk-off.
- DXY: strong = bearish crypto/commodities. VIX: <15 complacency, >25 fear/opportunity.
- Treasury yields: rising 10Y = headwind for long-duration tech.

## OPTIONS STRATEGY
- Buy when IV rank <30. Sell/spread when >70. 30-90 DTE sweet spot.
- Never >2-3% of portfolio in a single options play. Spreads in elevated IV.
- Match delta to conviction level. Avoid buying short-dated without imminent catalyst.

## ROBINHOOD TICKER UNIVERSE (FULL — NOT JUST ETFS)

### CRYPTO — ROBINHOOD CRYPTO TAB (DIRECT SPOT, NO OPTIONS)
Robinhood supports buying these crypto assets directly on its crypto tab. For a pure spot/directional crypto play, ALWAYS list the direct asset first if available — it is the cleanest, lowest-friction vehicle. No options, no ETF premium, no tracking error.
Direct on RH crypto tab: BTC, ETH, SOL, DOGE, SHIB, AVAX, LTC, BCH, XLM, ETC, LINK, UNI, AAVE, COMP, MATIC (POL), XTZ, XRP, ADA, DOT
Type for these = "crypto_spot" — user buys/sells directly at spot price on RH.

### CRYPTO — EQUITY/ETF PROXIES (HAVE OPTIONS)
Use these when: (a) the play is options-based and needs listed options, (b) you want levered/indirect exposure, or (c) the direct crypto isn't on RH.
- BTC options → IBIT (most liquid), MSTR (high-beta), COIN, BITO
- ETH options → ETHA, COIN
- Altcoin/general crypto → COIN, MARA, RIOT, CLSK, HUT, HOOD, MSTR
Type for these = "options" or "etf_spot"

### TICKER SELECTION RULE FOR CRYPTO PLAYS:
1. If the play is SPOT/DIRECTIONAL (just buying the asset): list the direct crypto (BTC, ETH, SOL etc.) as the primary ticker, type "crypto_spot". Then optionally list ETF proxies as secondaries.
2. If the play is OPTIONS-BASED: lead with the best ETF/equity that has options (IBIT, COIN, MSTR etc.), since you can't buy options on crypto directly on RH. Still note the direct crypto spot as context.
3. If the play is on a crypto asset NOT available on RH crypto tab (e.g. a specific DeFi token): lead with the best proxy.
Macro/Rates: TLT, IEF, TMF, TBT, GLD, IAU, SLV, UUP, USO, XLE
Gold miners: GOLD, NEM, AEM, WPM, PAAS, AG
Oil/Energy: CVX, XOM, OXY, COP, MRO, FANG, COP
Broad market: SPY, QQQ, IWM, DIA, UVXY, SVXY, VXX
AI/Semis: NVDA, AMD, AVGO, ARM, QCOM, MRVL, SMCI, ALAB, TSM, AMAT, LRCX, KLAC, MU
Big Tech: AAPL, MSFT, GOOGL, META, AMZN, NFLX
Software/SaaS: CRM, NOW, SNOW, PLTR, DDOG, CRWD, ZS, MDB, CFLT, PATH
Fintech: V, MA, PYPL, SQ, AFRM, HOOD
EV: TSLA, RIVN, LCID, ENPH, SEDG, FSLR
Biotech: LLY, NVO, MRNA, ABBV, VRTX, REGN, GILD, BIIB
Defense: LMT, RTX, NOC, GD
Consumer: HD, LOW, TJX, NKE, SBUX, MCD, CMG, RCL, CCL
Banks: JPM, BAC, WFC, GS, MS, C; KRE (regional ETF), WAL
REITs: AMT, EQIX, O, SPG
Industrials: CAT, DE, HON, UPS, FDX, GE

Pick the BEST vehicle for each specific thesis — not just the obvious ETF.

## MANDATORY SELF-REVIEW PER PLAY
1. Build the thesis
2. Steelman the opposite — argue against it as hard as possible
3. Score conviction honestly AFTER the steelman (1-10). Below 7 = REJECTED, do not include.
4. Sizing: conviction 9-10 = 2-3% portfolio. 7-8 = 1-2%. Never >3%.

Output fewer great plays. 3 strong > 6 mediocre.

## OUTPUT — VALID JSON ONLY. No markdown, no backticks, no preamble.
{
  "market_thesis": "Honest 2-3 sentence view including uncertainties",
  "macro_context": "Specific data points with numbers",
  "cowen_lens": "Specific BTC cycle position with current price",
  "cycle_phase": "early_bull|mid_bull|late_bull|top|early_bear|mid_bear|late_bear|accumulation",
  "risk_level": "low|moderate|elevated|high|extreme",
  "plays_reviewed": 8,
  "plays_rejected": 5,
  "plays": [
    {
      "id": 1,
      "ticker": "BTC",
      "name": "Bitcoin",
      "asset_type": "crypto|equity|etf|macro",
      "play_type": "call|put|call_spread|put_spread|long|short",
      "instrument": "options|spot|futures",
      "strike_guidance": "e.g. 'ATM call' or '$190/$210 call spread'",
      "expiration_guidance": "e.g. '45 DTE (June expiry)' or 'N/A'",
      "conviction": 8,
      "position_size_pct": "1.5% of portfolio",
      "direction": "bullish|bearish|neutral",
      "thesis": "2-3 sentences on why this trade makes sense NOW",
      "catalyst": "Specific upcoming event or data point",
      "bear_case": "Strongest honest argument AGAINST this trade",
      "invalidation": "Specific price level or event = exit immediately",
      "timeframe": "1-2 weeks|1 month|1 quarter",
      "framework": "Cowen|Macro|Technical|Fundamental|Multi",
      "robinhood_tickers": [
        {
          "symbol": "IBIT",
          "type": "crypto_spot|options|etf_spot",
          "liquidity": "high|medium|low",
          "note": "Why this is the best RH vehicle for this play"
        }
      ]
    }
  ],
  "key_levels": [
    {"asset": "BTC", "level": "85000", "type": "support|resistance|target", "significance": "200-week MA"}
  ],
  "headlines_used": ["headline 1", "headline 2"]
}`;

/* ─────────────────────────────────────────────
   REVIEW SYSTEM PROMPT — called on "open" plays at startup
───────────────────────────────────────────── */
const REVIEW_SYSTEM_PROMPT = `You are a brutally honest trade monitor. A user has an active trade open. You will search for current price and news, then give an honest update on whether the thesis is still intact.

Be direct. If the trade looks bad, say so. If the thesis has strengthened, say so. Do not sugarcoat.

Output ONLY valid JSON. No markdown, no backticks.

{
  "checked_at": "ISO timestamp",
  "current_price": "current price or level of the primary asset",
  "price_change": "e.g. '+4.2% since play was generated' or 'down 8% from entry zone'",
  "thesis_status": "intact|weakening|broken|strengthened",
  "signal": "hold|add|close|watch",
  "signal_reason": "1-2 sentences — the honest reason for the signal",
  "summary": "2-3 sentence update on what has happened with this trade since it was generated — specific prices, news, data",
  "updated_bear_case": "Has anything new emerged that makes the bear case stronger?",
  "key_level_to_watch": "The single most important price level right now"
}`;

/* ─────────────────────────────────────────────
   ROBUST JSON PARSER
───────────────────────────────────────────── */
function robustParseJSON(raw) {
  let text = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const start = text.indexOf("{");
  if (start === -1) throw new Error("No JSON object found in response");
  text = text.slice(start);

  let depth = 0, end = -1, inString = false, escape = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (escape) { escape = false; continue; }
    if (ch === "\\" && inString) { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (!inString) {
      if (ch === "{" || ch === "[") depth++;
      else if (ch === "}" || ch === "]") {
        depth--;
        if (depth === 0) { end = i; break; }
      }
    }
  }

  if (end === -1) {
    depth = 0; inString = false; escape = false;
    let brackets = [];
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
    text = text.replace(/,\s*$/, "");
    text += brackets.reverse().join("");
  } else {
    text = text.slice(0, end + 1);
  }

  text = text.replace(/,(\s*[}\]])/g, "$1");
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  try { return JSON.parse(text); } catch (_) {}
  try {
    const sanitized = text.replace(/"(?:[^"\\]|\\.)*"/gs, m =>
      m.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t")
    );
    return JSON.parse(sanitized);
  } catch (e) {
    throw new Error(`Parse failed: ${e.message} — try generating again.`);
  }
}

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const STORAGE_KEY = "market_gauntlet_v6";

const CYCLE_COLORS = {
  early_bull:"#22c55e", mid_bull:"#86efac", late_bull:"#fbbf24",
  top:"#f97316", early_bear:"#f87171", mid_bear:"#ef4444",
  late_bear:"#dc2626", accumulation:"#60a5fa",
};
const RISK_COLORS = { low:"#22c55e", moderate:"#86efac", elevated:"#fbbf24", high:"#f97316", extreme:"#ef4444" };

// "" = not yet decided (default blank), "open" = in the trade
const STATUS_META = {
  "":       { label:"—",         color:"#475569", selectLabel:"Not set" },
  open:     { label:"● IN TRADE",color:"#fbbf24", selectLabel:"● In Trade" },
  hit:      { label:"✓ HIT",     color:"#00ff88", selectLabel:"✓ Hit"    },
  miss:     { label:"✗ MISS",    color:"#ff3355", selectLabel:"✗ Miss"   },
  expired:  { label:"EXPIRED",   color:"#64748b", selectLabel:"Expired"  },
};

const SIGNAL_META = {
  hold:  { label:"HOLD",  color:"#fbbf24", icon:"◈" },
  add:   { label:"ADD",   color:"#00ff88", icon:"▲" },
  close: { label:"CLOSE", color:"#ff3355", icon:"✕" },
  watch: { label:"WATCH", color:"#60a5fa", icon:"◎" },
};

const THESIS_STATUS_COLOR = {
  intact:"#00ff88", strengthened:"#22c55e", weakening:"#f97316", broken:"#ff3355",
};

const LIQ_COLOR  = { high:"#00ff88", medium:"#fbbf24", low:"#ff3355" };
const CONV_COLOR = (c) => c>=9?"#00ff88":c>=7?"#86efac":c>=5?"#fbbf24":"#ff3355";
const PLAY_ICONS = { call:"▲", put:"▼", call_spread:"△", put_spread:"▽", long:"→", short:"←" };
const DIR_COLOR  = (d) => d==="bullish"?"#00ff88":d==="bearish"?"#ff3355":"#fbbf24";

const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})
       + " " + d.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
};

const LOADING_MSGS = [
  "Scanning macro landscape...", "Fetching live headlines...",
  "Running Cowen cycle analysis...", "Building play candidates...",
  "Steelmanning each thesis...", "Rejecting weak setups...",
  "Mapping Robinhood tickers...", "Finalizing plays...",
];


/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function MarketGauntlet() {
  const [tab, setTab]           = useState("plays");
  const [sessions, setSessions] = useState([]);
  const [current, setCurrent]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [selectedPlay, setSelectedPlay]   = useState(null);
  const [loadingMsg, setLoadingMsg]       = useState("");
  const [dots, setDots]                   = useState("");
  const [storageReady, setStorageReady]   = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [reviewingPlays, setReviewingPlays] = useState(new Set()); // playIds being reviewed
  const [reviewNotices, setReviewNotices]   = useState([]);        // banner messages
  const reviewedOnLoad = useRef(false);
  const [showSettings, setShowSettings]     = useState(false);
  const [gistToken, setGistToken]           = useState("");
  const [gistId, setGistId]                 = useState("");
  const [gistStatus, setGistStatus]         = useState(null);
  const [gistLastSync, setGistLastSync]     = useState(null);

  /* ── Load storage ── */
  useEffect(() => {
    (async () => {
      try {
        const raw = await window.storage.get(STORAGE_KEY);
        if (raw?.value) {
          const parsed = JSON.parse(raw.value);
          const fixed = parsed.map(s => ({
            ...s,
            plays_rejected: Math.max(0, (s.plays_reviewed || 0) - (s.plays?.length || 0)),
          }));
          setSessions(fixed);
          if (fixed.length > 0) setCurrent(fixed[0]);
        }
      } catch (_) {}
      // Load Gist config
      try {
        const gc = await window.storage.get("mg_gist_config");
        if (gc?.value) {
          const cfg = JSON.parse(gc.value);
          if (cfg.token) setGistToken(cfg.token);
          if (cfg.gistId) setGistId(cfg.gistId);
        }
      } catch (_) {}
      setStorageReady(true);
    })();
  }, []);

  /* ── On load: pull Gist evaluations, then re-evaluate open plays live ── */
  useEffect(() => {
    if (!storageReady || reviewedOnLoad.current) return;
    reviewedOnLoad.current = true;

    (async () => {
      // 1. Pull any mid-day scans from GitHub Actions
      let liveSessions = sessions;
      if (gistToken && gistId) {
        const merged = await pullFromGist(sessions, gistToken, gistId);
        if (merged) {
          liveSessions = merged;
          setSessions(merged);
          setCurrent(c => {
            const updated = merged.find(s => s.id === c?.id);
            return updated || c;
          });
          await persist(merged);
        }
      }

      // 2. Re-evaluate all open plays live via Claude
      const openPlays = liveSessions.flatMap(s =>
        s.plays
          .filter(p => p.status === "open")
          .map(p => ({ ...p, session_id: s.id, session_date: s.generated_at }))
      );

      if (openPlays.length > 0) {
        setReviewNotices([`Re-evaluating ${openPlays.length} open trade${openPlays.length>1?"s":""}...`]);
        openPlays.forEach(play => reviewPlay(play, play.session_id));
      }
    })();
  }, [storageReady]);

  /* ── Loading animation ── */
  useEffect(() => {
    if (!loading) return;
    let i = 0;
    const mi = setInterval(() => { setLoadingMsg(LOADING_MSGS[i++%LOADING_MSGS.length]); }, 2200);
    const di = setInterval(() => { setDots(d => d.length>=3?"":d+"."); }, 400);
    return () => { clearInterval(mi); clearInterval(di); };
  }, [loading]);

  const persist = useCallback(async (updated) => {
    await window.storage.set(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  /* ── Save Gist config ── */
  const saveGistConfig = useCallback(async (token, id) => {
    await window.storage.set("mg_gist_config", JSON.stringify({ token, gistId: id }));
  }, []);

  /* ── Push open plays to Gist ── */
  const pushToGist = useCallback(async (updatedSessions, token, id) => {
    if (!token || !id) return;
    const openPlays = updatedSessions.flatMap(s =>
      s.plays.filter(p => p.status === "open").map(p => ({
        ...p, generated_at: s.generated_at, session_id: s.id,
      }))
    );
    try {
      // Read current gist first to preserve evaluations
      const getRes = await fetch(`https://api.github.com/gists/${id}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
      });
      const existing = getRes.ok ? await getRes.json() : null;
      const currentContent = existing?.files?.["market_gauntlet.json"]?.content;
      const current = currentContent ? JSON.parse(currentContent) : {};

      const body = JSON.stringify({
        files: {
          "market_gauntlet.json": {
            content: JSON.stringify({
              ...current,
              open_plays: openPlays,
              last_pushed: new Date().toISOString(),
            }, null, 2),
          },
        },
      });
      await fetch(`https://api.github.com/gists/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body,
      });
    } catch (e) {
      console.error("Gist push failed:", e.message);
    }
  }, []);

  /* ── Pull evaluations from Gist and merge ── */
  const pullFromGist = useCallback(async (currentSessions, token, id) => {
    if (!token || !id) return null;
    setGistStatus("syncing");
    try {
      const res = await fetch(`https://api.github.com/gists/${id}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
      });
      if (!res.ok) throw new Error(`Gist fetch failed: ${res.status}`);
      const data = await res.json();
      const content = data.files?.["market_gauntlet.json"]?.content;
      if (!content) { setGistStatus("ok"); return null; }
      const gistData = JSON.parse(content);
      const evaluations = gistData.evaluations || {};

      if (Object.keys(evaluations).length === 0) { setGistStatus("ok"); return null; }

      // Merge evaluations into sessions
      const merged = currentSessions.map(s => ({
        ...s,
        plays: s.plays.map(p => {
          const ext = evaluations[p.id];
          if (!ext) return p;
          // Only update if the external eval is newer
          const extTime = new Date(ext.checked_at || 0).getTime();
          const localTime = new Date(p.review?.checked_at || 0).getTime();
          if (extTime > localTime) {
            return { ...p, review: ext };
          }
          return p;
        }),
      }));

      setGistLastSync(gistData.last_evaluated || new Date().toISOString());
      setGistStatus("ok");
      return merged;
    } catch (e) {
      console.error("Gist pull failed:", e.message);
      setGistStatus("error");
      return null;
    }
  }, []);

  /* ── Review a single open play ── */
  const reviewPlay = useCallback(async (play, sessionId) => {
    setReviewingPlays(prev => new Set([...prev, play.id]));
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          system: REVIEW_SYSTEM_PROMPT,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{
            role: "user",
            content: `Today is ${new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}.

ACTIVE TRADE TO REVIEW:
Ticker: ${play.ticker} (${play.name})
Play type: ${play.play_type} — ${play.direction}
Strike: ${play.strike_guidance}
Expiry: ${play.expiration_guidance}
Timeframe: ${play.timeframe}
Original thesis: ${play.thesis}
Original catalyst: ${play.catalyst}
Bear case: ${play.bear_case}
Invalidation level: ${play.invalidation}
Play generated: ${fmtDate(play.session_date || play.generated_at)}
Robinhood vehicles: ${play.robinhood_tickers?.map(t=>t.symbol).join(", ")||play.ticker}

Search for:
1. Current price/level of ${play.ticker} (and/or ${play.robinhood_tickers?.map(t=>t.symbol).join(", ")||""})
2. Any news in the last 48h relevant to this specific trade
3. Has the thesis catalyst happened, started, or failed?
4. Is the invalidation level threatened or breached?

Give an honest update. Output ONLY valid JSON.`,
          }],
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error?.message);
      const text = result.content.filter(b=>b.type==="text").map(b=>b.text).join("");
      const review = robustParseJSON(text);
      review.checked_at = new Date().toISOString();

      // Store review on the play
      setSessions(prev => {
        const updated = prev.map(s => s.id !== sessionId ? s : {
          ...s,
          plays: s.plays.map(p => p.id !== play.id ? p : { ...p, review }),
        });
        persist(updated);
        setCurrent(c => c?.id === sessionId
          ? { ...c, plays: c.plays.map(p => p.id !== play.id ? p : { ...p, review }) }
          : c
        );
        return updated;
      });

      setReviewNotices(prev => {
        const sig = SIGNAL_META[review.signal];
        const msg = `${play.ticker}: ${sig?.label||review.signal} — ${review.signal_reason?.slice(0,60)}...`;
        return [...prev.filter(n=>!n.startsWith(play.ticker)), msg];
      });

    } catch (e) {
      console.error("Review failed for", play.ticker, e);
    } finally {
      setReviewingPlays(prev => { const n=new Set(prev); n.delete(play.id); return n; });
    }
  }, [persist]);

  /* ── Update play status ── */
  const updatePlayStatus = useCallback(async (sessionId, playId, status) => {
    setSessions(prev => {
      const updated = prev.map(s => s.id!==sessionId ? s : {
        ...s, plays: s.plays.map(p => p.id===playId ? {...p, status} : p),
      });
      persist(updated);
      setCurrent(c => c?.id===sessionId
        ? {...c, plays: c.plays.map(p => p.id===playId ? {...p, status} : p)}
        : c);
      return updated;
    });

    // If they just marked it "open", trigger a review + push to Gist
    if (status === "open") {
      const allSessions = sessions;
      const session = allSessions.find(s => s.id === sessionId);
      const play = session?.plays.find(p => p.id === playId);
      if (play) {
        setReviewNotices([`Re-evaluating ${play.ticker}...`]);
        reviewPlay({ ...play, session_id: sessionId, session_date: session.generated_at }, sessionId);
      }
    }
    // Push updated open plays list to Gist
    if (gistToken && gistId) {
      setSessions(latest => { pushToGist(latest, gistToken, gistId); return latest; });
    }
  }, [persist, sessions, reviewPlay, gistToken, gistId, pushToGist]);

  /* ── Delete session ── */
  const deleteSession = useCallback(async (sessionId) => {
    setSessions(prev => {
      const updated = prev.filter(s => s.id!==sessionId);
      persist(updated);
      setCurrent(c => c?.id===sessionId ? (updated.length>0?updated[0]:null) : c);
      return updated;
    });
    setConfirmDelete(null); setSelectedPlay(null);
  }, [persist]);

  /* ── Delete play ── */
  const deletePlay = useCallback(async (sessionId, playId) => {
    setSessions(prev => {
      const updated = prev.map(s => s.id!==sessionId ? s : {
        ...s, plays: s.plays.filter(p=>p.id!==playId),
      });
      persist(updated);
      setCurrent(c => c?.id===sessionId ? {...c, plays: c.plays.filter(p=>p.id!==playId)} : c);
      return updated;
    });
    setConfirmDelete(null);
    if (selectedPlay?.id===playId) setSelectedPlay(null);
  }, [persist, selectedPlay]);

  /* ── Generate new plays ── */
  const generatePlays = async () => {
    setLoading(true); setError(null); setSelectedPlay(null); setLoadingMsg(LOADING_MSGS[0]);
    try {
      const today = new Date().toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:8000, system:SYSTEM_PROMPT,
          tools:[{type:"web_search_20250305",name:"web_search"}],
          messages:[{role:"user",content:`Today is ${today}.

Search for:
1. Current BTC, ETH prices and 24h/7d performance
2. Major crypto news last 48 hours
3. SPY, QQQ, IWM, DXY performance — macro picture
4. Most recent Fed commentary, rate expectations
5. Latest CPI, PCE, jobs data if recent
6. Major equity movers — earnings, guidance, upgrades
7. Geopolitical/macro risk events last 48h
8. Current VIX and credit spread conditions

Run your full self-review: generate candidates, steelman each, reject anything below 7 conviction. Be honest about the count. Output ONLY valid JSON.`
          }],
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error?.message||"API error");
      const text = result.content.filter(b=>b.type==="text").map(b=>b.text).join("");
      const parsed = robustParseJSON(text);
      const sid = Date.now().toString();

      // Normalize fields the model sometimes returns as objects/arrays instead of scalars
      const safeNum  = (v) => typeof v === "number" ? v : Array.isArray(v) ? v.length : Number(v) || 0;
      const safeStr  = (v) => typeof v === "string" ? v : (v == null ? "" : String(v));
      const normalizePlay = (p) => ({
        ...p,
        ticker:             safeStr(p.ticker),
        name:               safeStr(p.name),
        asset_type:         safeStr(p.asset_type),
        play_type:          safeStr(p.play_type),
        instrument:         safeStr(p.instrument),
        strike_guidance:    safeStr(p.strike_guidance),
        expiration_guidance:safeStr(p.expiration_guidance),
        conviction:         safeNum(p.conviction ?? p.confidence),
        position_size_pct:  safeStr(p.position_size_pct),
        direction:          safeStr(p.direction),
        thesis:             safeStr(p.thesis),
        catalyst:           safeStr(p.catalyst),
        bear_case:          safeStr(p.bear_case),
        invalidation:       safeStr(p.invalidation),
        timeframe:          safeStr(p.timeframe),
        framework:          safeStr(p.framework),
        robinhood_tickers:  Array.isArray(p.robinhood_tickers)
          ? p.robinhood_tickers.map(t => ({
              symbol:   safeStr(t.symbol),
              type:     safeStr(t.type),
              liquidity:safeStr(t.liquidity),
              note:     safeStr(t.note),
            }))
          : [],
      });

      const session = {
        ...parsed,
        id:              sid,
        generated_at:    new Date().toISOString(),
        market_thesis:   safeStr(parsed.market_thesis),
        macro_context:   safeStr(parsed.macro_context),
        cowen_lens:      safeStr(parsed.cowen_lens),
        cycle_phase:     safeStr(parsed.cycle_phase),
        risk_level:      safeStr(parsed.risk_level),
        plays_reviewed:  safeNum(parsed.plays_reviewed),
        plays_rejected:  Math.max(0, safeNum(parsed.plays_reviewed) - (parsed.plays||[]).length),
        key_levels:      Array.isArray(parsed.key_levels)
          ? parsed.key_levels.map(l => ({
              asset:       safeStr(l.asset),
              level:       safeStr(l.level),
              type:        safeStr(l.type),
              significance:safeStr(l.significance),
            }))
          : [],
        headlines_used:  Array.isArray(parsed.headlines_used)
          ? parsed.headlines_used.map(safeStr)
          : [],
        plays: (parsed.plays||[]).map(p => ({
          ...normalizePlay(p),
          id: `${sid}_${p.id}`,
          status: "",
        })),
      };
      setSessions(prev => { const u=[session,...prev]; persist(u); return u; });
      setCurrent(session); setTab("plays");
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const allPlays = sessions.flatMap(s =>
    s.plays.map(p=>({...p, session_date:s.generated_at, session_id:s.id,
      cycle_phase:s.cycle_phase, risk_level:s.risk_level}))
  );

  /* ─── SUB-COMPONENTS ─── */

  const ConvictionMeter = ({ value, size="normal" }) => {
    const pips = size==="small"?5:10;
    const filled = size==="small"?Math.round((value/10)*5):value;
    return (
      <div style={{display:"flex",gap:2,alignItems:"center"}}>
        {Array.from({length:pips}).map((_,i)=>(
          <div key={i} style={{width:size==="small"?6:7,height:size==="small"?10:13,borderRadius:1,
            background:i<filled?CONV_COLOR(value):"rgba(255,255,255,.05)"}}/>
        ))}
        {size!=="small" && (
          <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:CONV_COLOR(value),marginLeft:5,fontWeight:700}}>
            {value}/10
          </span>
        )}
      </div>
    );
  };

  const RHTickerBadges = ({ tickers }) => {
    if (!tickers?.length) return null;
    const cryptoSpot  = tickers.filter(t => t.type === "crypto_spot");
    const otherTickers = tickers.filter(t => t.type !== "crypto_spot");

    const TickerCard = ({ t }) => {
      const isCryptoSpot = t.type === "crypto_spot";
      const accentColor  = isCryptoSpot ? "#f7931a" : (LIQ_COLOR[t.liquidity] || "#444");
      const typeLabel    = isCryptoSpot ? "CRYPTO TAB" : t.type?.toUpperCase().replace(/_/g," ");
      return (
        <div style={{background:"rgba(0,0,0,.5)",borderLeft:`3px solid ${accentColor}`,border:`1px solid rgba(255,255,255,.06)`,borderLeft:`3px solid ${accentColor}`,padding:"8px 12px",flex:"1 1 140px",maxWidth:220}}>
          <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:4,flexWrap:"wrap"}}>
            <span style={{fontFamily:"'Bebas Neue',cursive",fontSize:20,letterSpacing:2,color:"#f0f4f8"}}>{t.symbol}</span>
            {isCryptoSpot
              ? <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:"#f7931a",textTransform:"uppercase",letterSpacing:1,background:"rgba(247,147,26,.1)",padding:"1px 5px",borderRadius:2}}>CRYPTO TAB</span>
              : <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:LIQ_COLOR[t.liquidity],textTransform:"uppercase"}}>{t.liquidity}</span>
            }
            {!isCryptoSpot && <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:"rgba(200,214,229,.3)",textTransform:"uppercase"}}>{t.type?.toUpperCase().replace(/_/g," ")}</span>}
          </div>
          <div style={{fontSize:11,color:"#64748b",lineHeight:1.4}}>{t.note}</div>
        </div>
      );
    };

    return (
      <div style={{marginTop:14}}>
        {cryptoSpot.length > 0 && (
          <>
            <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:"rgba(247,147,26,.6)",letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>
              ₿ ROBINHOOD CRYPTO TAB — BUY DIRECT
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom: otherTickers.length ? 12 : 0}}>
              {cryptoSpot.map((t,i)=><TickerCard key={i} t={t}/>)}
            </div>
          </>
        )}
        {otherTickers.length > 0 && (
          <>
            <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:"rgba(0,255,136,.5)",letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>
              {cryptoSpot.length > 0 ? "↳ OPTIONS / EQUITY PROXIES" : "🟢 ROBINHOOD VEHICLES"}
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {otherTickers.map((t,i)=><TickerCard key={i} t={t}/>)}
            </div>
          </>
        )}
      </div>
    );
  };

  /* ── REVIEW PANEL shown inside detail for open plays ── */
  const ReviewPanel = ({ play, sessionId }) => {
    const isReviewing = reviewingPlays.has(play.id);
    const rev = play.review;

    if (isReviewing) {
      return (
        <div style={{marginTop:14,border:"1px solid rgba(251,191,36,.2)",background:"rgba(251,191,36,.04)",padding:"14px 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:14,height:14,border:"2px solid rgba(251,191,36,.3)",borderTopColor:"#fbbf24",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
            <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:"#fbbf24",letterSpacing:2}}>REVIEWING TRADE...</span>
          </div>
        </div>
      );
    }

    if (!rev) {
      return (
        <div style={{marginTop:14,border:"1px solid rgba(255,255,255,.06)",padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:"rgba(200,214,229,.35)",letterSpacing:1}}>NO REVIEW YET</span>
          <button onClick={()=>reviewPlay({...play,session_date:play.session_date||play.generated_at},sessionId)}
            style={{background:"transparent",border:"1px solid rgba(0,255,136,.3)",color:"rgba(0,255,136,.7)",fontFamily:"'Share Tech Mono',monospace",fontSize:10,letterSpacing:2,padding:"5px 14px",cursor:"pointer"}}>
            REVIEW NOW
          </button>
        </div>
      );
    }

    const sig = SIGNAL_META[rev.signal] || SIGNAL_META.watch;
    const tsColor = THESIS_STATUS_COLOR[rev.thesis_status] || "#fbbf24";

    return (
      <div style={{marginTop:14,border:`1px solid ${sig.color}30`,background:`${sig.color}06`}}>
        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderBottom:`1px solid ${sig.color}20`,flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
            <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,letterSpacing:3,color:sig.color}}>
              {sig.icon} {sig.label}
            </div>
            <div style={{display:"flex",flexDirection:"column"}}>
              <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:"rgba(200,214,229,.4)",letterSpacing:2,textTransform:"uppercase",marginBottom:2}}>Thesis</span>
              <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:tsColor,textTransform:"uppercase",letterSpacing:1}}>
                {rev.thesis_status}
              </span>
            </div>
            {rev.current_price && (
              <div style={{display:"flex",flexDirection:"column"}}>
                <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:"rgba(200,214,229,.4)",letterSpacing:2,textTransform:"uppercase",marginBottom:2}}>Price</span>
                <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:12,color:"#e2e8f0",fontWeight:700}}>{rev.current_price}</span>
              </div>
            )}
            {rev.price_change && (
              <div style={{display:"flex",flexDirection:"column"}}>
                <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:"rgba(200,214,229,.4)",letterSpacing:2,textTransform:"uppercase",marginBottom:2}}>Move</span>
                <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:11,color:rev.price_change.startsWith("+")||rev.price_change.startsWith("up")?"#00ff88":"#ff3355"}}>
                  {rev.price_change}
                </span>
              </div>
            )}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:"rgba(200,214,229,.25)",letterSpacing:1}}>
              UPDATED {fmtDate(rev.checked_at)}
            </span>
            <button onClick={()=>reviewPlay({...play,session_date:play.session_date||play.generated_at},sessionId)}
              style={{background:"transparent",border:`1px solid ${sig.color}40`,color:`${sig.color}80`,fontFamily:"'Share Tech Mono',monospace",fontSize:9,letterSpacing:2,padding:"4px 10px",cursor:"pointer",textTransform:"uppercase"}}>
              ↺ REFRESH
            </button>
          </div>
        </div>
        {/* Signal reason */}
        <div style={{padding:"10px 14px",fontSize:13,color:"#e2e8f0",lineHeight:1.6,fontWeight:500,borderBottom:`1px solid rgba(255,255,255,.04)`}}>
          {rev.signal_reason}
        </div>
        {/* Summary */}
        <div style={{padding:"10px 14px",fontSize:13,color:"#94a3b8",lineHeight:1.65,borderBottom:`1px solid rgba(255,255,255,.04)`}}>
          {rev.summary}
        </div>
        {/* Updated bear case */}
        {rev.updated_bear_case && (
          <div style={{padding:"10px 14px",background:"rgba(255,51,85,.04)",borderBottom:`1px solid rgba(255,255,255,.04)`}}>
            <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:"rgba(255,51,85,.6)",letterSpacing:2,textTransform:"uppercase",marginBottom:5}}>Updated Bear Case</div>
            <div style={{fontSize:12,color:"rgba(200,214,229,.6)",lineHeight:1.5}}>{rev.updated_bear_case}</div>
          </div>
        )}
        {/* Key level */}
        {rev.key_level_to_watch && (
          <div style={{padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:"rgba(200,214,229,.4)",letterSpacing:2,textTransform:"uppercase"}}>Key Level To Watch</span>
            <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:13,color:"#fbbf24",fontWeight:700}}>{rev.key_level_to_watch}</span>
          </div>
        )}
      </div>
    );
  };

  /* ── Settings Modal ── */
  const SettingsModal = () => {
    if (!showSettings) return null;
    const [localToken, setLocalToken] = React.useState(gistToken);
    const [localId, setLocalId]       = React.useState(gistId);
    const [saving, setSaving]         = React.useState(false);
    const [testMsg, setTestMsg]       = React.useState("");

    const handleSave = async () => {
      setSaving(true);
      setGistToken(localToken);
      setGistId(localId);
      await saveGistConfig(localToken, localId);
      // Test connection
      try {
        const res = await fetch(`https://api.github.com/gists/${localId}`, {
          headers: { Authorization: `Bearer ${localToken}`, Accept: "application/vnd.github+json" },
        });
        if (res.ok) {
          setTestMsg("✓ Connected successfully");
          // Push current open plays
          await pushToGist(sessions, localToken, localId);
        } else {
          setTestMsg(`✗ Connection failed: ${res.status} — check token and Gist ID`);
        }
      } catch (e) {
        setTestMsg(`✗ Error: ${e.message}`);
      }
      setSaving(false);
    };

    const inp = { background:"rgba(0,0,0,.4)", border:"1px solid rgba(255,255,255,.15)", color:"#e2e8f0",
      fontFamily:"'Share Tech Mono',monospace", fontSize:12, padding:"8px 12px", width:"100%",
      borderRadius:2, outline:"none", marginTop:6 };

    return (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.88)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <div style={{background:"#0d1117",border:"1px solid rgba(0,255,136,.2)",padding:28,maxWidth:480,width:"100%"}}>
          <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,letterSpacing:3,color:"#00ff88",marginBottom:6}}>GITHUB GIST SYNC</div>
          <p style={{fontSize:12,color:"#64748b",lineHeight:1.6,marginBottom:20}}>
            Connect a GitHub Gist so GitHub Actions can push mid-day evaluations automatically at 12:30pm ET on weekdays.
            Your token is stored locally in this app only.
          </p>

          <div style={{marginBottom:14}}>
            <div className="mono" style={{fontSize:9,color:"rgba(0,255,136,.5)",letterSpacing:2,textTransform:"uppercase"}}>
              GITHUB PERSONAL ACCESS TOKEN
            </div>
            <div style={{fontSize:11,color:"#475569",marginTop:3,marginBottom:4}}>
              Create at github.com/settings/tokens — needs "gist" scope only
            </div>
            <input style={inp} type="password" value={localToken}
              onChange={e=>setLocalToken(e.target.value)} placeholder="ghp_xxxxxxxxxxxx"/>
          </div>

          <div style={{marginBottom:20}}>
            <div className="mono" style={{fontSize:9,color:"rgba(0,255,136,.5)",letterSpacing:2,textTransform:"uppercase"}}>
              GIST ID
            </div>
            <div style={{fontSize:11,color:"#475569",marginTop:3,marginBottom:4}}>
              Create an empty secret Gist at gist.github.com — paste the ID from the URL
            </div>
            <input style={inp} type="text" value={localId}
              onChange={e=>setLocalId(e.target.value)} placeholder="e.g. a1b2c3d4e5f6..."/>
          </div>

          {testMsg && (
            <div style={{padding:"8px 12px",marginBottom:16,background:testMsg.startsWith("✓")?"rgba(0,255,136,.08)":"rgba(255,51,85,.08)",
              border:`1px solid ${testMsg.startsWith("✓")?"rgba(0,255,136,.3)":"rgba(255,51,85,.3)"}`,
              color:testMsg.startsWith("✓")?"#00ff88":"#ff3355",fontFamily:"'Share Tech Mono',monospace",fontSize:11}}>
              {testMsg}
            </div>
          )}

          <div style={{background:"rgba(0,0,0,.3)",border:"1px solid rgba(255,255,255,.06)",padding:"12px 14px",marginBottom:20,fontSize:12,color:"#475569",lineHeight:1.7}}>
            <div className="mono" style={{fontSize:9,color:"rgba(200,214,229,.3)",letterSpacing:2,marginBottom:8}}>SETUP CHECKLIST</div>
            <div>1. Fork or create a GitHub repo with <code style={{color:"#94a3b8"}}>evaluate.js</code> and <code style={{color:"#94a3b8"}}>.github/workflows/midday-eval.yml</code></div>
            <div>2. Add repo secrets: <code style={{color:"#94a3b8"}}>ANTHROPIC_API_KEY</code>, <code style={{color:"#94a3b8"}}>GIST_TOKEN</code>, <code style={{color:"#94a3b8"}}>GIST_ID</code></div>
            <div>3. Create a secret Gist at gist.github.com (any content, file named <code style={{color:"#94a3b8"}}>market_gauntlet.json</code>)</div>
            <div>4. Paste the token and Gist ID here and save</div>
          </div>

          <div style={{display:"flex",gap:12}}>
            <button onClick={()=>setShowSettings(false)} style={{flex:1,background:"transparent",border:"1px solid rgba(255,255,255,.15)",color:"#c8d6e5",fontFamily:"'Bebas Neue',cursive",fontSize:15,letterSpacing:2,padding:"9px 0",cursor:"pointer"}}>CANCEL</button>
            <button onClick={handleSave} disabled={saving||!localToken||!localId}
              style={{flex:2,background:"rgba(0,255,136,.08)",border:"1px solid #00ff88",color:"#00ff88",fontFamily:"'Bebas Neue',cursive",fontSize:15,letterSpacing:2,padding:"9px 0",cursor:"pointer",opacity:(saving||!localToken||!localId)?0.4:1}}>
              {saving?"CONNECTING...":"SAVE & TEST"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ConfirmModal = () => {
    if (!confirmDelete) return null;
    return (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
        <div style={{background:"#0d1117",border:"1px solid rgba(255,51,85,.4)",padding:28,maxWidth:380,width:"100%"}}>
          <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,letterSpacing:3,color:"#ff3355",marginBottom:12}}>CONFIRM DELETE</div>
          <p style={{fontSize:14,color:"#94a3b8",lineHeight:1.6,marginBottom:24}}>
            {confirmDelete.type==="session" ? "Permanently delete this entire session?" : "Permanently delete this play?"} Cannot be undone.
          </p>
          <div style={{display:"flex",gap:12}}>
            <button onClick={()=>setConfirmDelete(null)} style={{flex:1,background:"transparent",border:"1px solid rgba(255,255,255,.15)",color:"#c8d6e5",fontFamily:"'Bebas Neue',cursive",fontSize:15,letterSpacing:2,padding:"9px 0",cursor:"pointer"}}>CANCEL</button>
            <button onClick={()=>confirmDelete.type==="session"?deleteSession(confirmDelete.sessionId):deletePlay(confirmDelete.sessionId,confirmDelete.playId)}
              style={{flex:1,background:"rgba(255,51,85,.1)",border:"1px solid #ff3355",color:"#ff3355",fontFamily:"'Bebas Neue',cursive",fontSize:15,letterSpacing:2,padding:"9px 0",cursor:"pointer"}}>DELETE</button>
          </div>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  const openPlayCount = allPlays.filter(p=>p.status==="open").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .dash{background:#06080d;min-height:100vh;color:#c8d6e5;font-family:'Rajdhani',sans-serif;padding:16px;}
        .dash::before{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,136,.012) 2px,rgba(0,255,136,.012) 4px);pointer-events:none;z-index:0;}
        .dash>*{position:relative;z-index:1;}
        .mono{font-family:'Share Tech Mono',monospace;}
        .hdr{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(0,255,136,.2);padding-bottom:12px;margin-bottom:16px;flex-wrap:wrap;gap:12px;}
        .logo{font-family:'Bebas Neue',cursive;font-size:28px;letter-spacing:4px;color:#00ff88;text-shadow:0 0 20px rgba(0,255,136,.4);line-height:1;}
        .logo-sub{font-family:'Share Tech Mono',monospace;font-size:10px;color:rgba(0,255,136,.5);letter-spacing:3px;margin-top:2px;}
        .gen-btn{background:transparent;border:1px solid #00ff88;color:#00ff88;font-family:'Bebas Neue',cursive;font-size:16px;letter-spacing:3px;padding:8px 24px;cursor:pointer;transition:all .2s;}
        .gen-btn:hover{box-shadow:0 0 20px rgba(0,255,136,.3);background:rgba(0,255,136,.06);}
        .gen-btn:disabled{opacity:.4;cursor:not-allowed;}
        .tabs{display:flex;margin-bottom:16px;border-bottom:1px solid rgba(0,255,136,.1);}
        .tab-btn{background:transparent;border:none;border-bottom:2px solid transparent;color:rgba(200,214,229,.4);font-family:'Bebas Neue',cursive;font-size:16px;letter-spacing:2px;padding:8px 20px;cursor:pointer;transition:all .15s;margin-bottom:-1px;}
        .tab-btn.active{color:#00ff88;border-bottom-color:#00ff88;}
        .panel{border:1px solid rgba(0,255,136,.15);background:rgba(0,255,136,.02);padding:16px;margin-bottom:16px;}
        .ptitle{font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:3px;color:rgba(0,255,136,.6);margin-bottom:12px;border-bottom:1px solid rgba(0,255,136,.1);padding-bottom:8px;text-transform:uppercase;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;}
        .grid-2{display:grid;grid-template-columns:1fr 300px;gap:16px;margin-bottom:16px;}
        @media(max-width:880px){.grid-2{grid-template-columns:1fr;}}
        table{width:100%;border-collapse:collapse;}
        th{font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:2px;color:rgba(0,255,136,.4);text-align:left;padding:6px 8px;border-bottom:1px solid rgba(0,255,136,.1);text-transform:uppercase;white-space:nowrap;}
        td{padding:9px 8px;border-bottom:1px solid rgba(255,255,255,.04);vertical-align:middle;}
        tr.row{cursor:pointer;}
        tr.row:hover td{background:rgba(0,255,136,.035);}
        tr.sel td{background:rgba(0,255,136,.06);}
        .tname{font-family:'Bebas Neue',cursive;font-size:18px;letter-spacing:1px;}
        .badge{display:inline-flex;align-items:center;gap:4px;font-family:'Share Tech Mono',monospace;font-size:10px;padding:2px 7px;border-radius:2px;text-transform:uppercase;letter-spacing:1px;white-space:nowrap;}
        .tag{display:inline-block;font-family:'Share Tech Mono',monospace;font-size:9px;padding:2px 6px;border-radius:2px;letter-spacing:1px;text-transform:uppercase;background:rgba(0,255,136,.08);color:rgba(0,255,136,.7);border:1px solid rgba(0,255,136,.2);}
        .del-btn{background:transparent;border:none;color:rgba(255,51,85,.35);cursor:pointer;font-size:13px;padding:4px 8px;transition:color .15s;border-radius:2px;}
        .del-btn:hover{color:#ff3355;background:rgba(255,51,85,.08);}
        .stat-sel{background:transparent;border:1px solid rgba(255,255,255,.15);color:#c8d6e5;font-family:'Share Tech Mono',monospace;font-size:10px;padding:3px 6px;cursor:pointer;border-radius:2px;outline:none;}
        .stat-sel option{background:#06080d;}
        .detail{background:rgba(0,0,0,.45);border:1px solid rgba(0,255,136,.18);padding:16px;margin-top:14px;}
        .dgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;margin:12px 0;}
        .dgrid label{display:block;font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:2px;color:rgba(0,255,136,.4);text-transform:uppercase;margin-bottom:4px;}
        .dgrid span{font-size:14px;font-weight:600;color:#e2e8f0;}
        .blk{padding:10px 14px;margin-top:10px;font-size:13px;color:#94a3b8;line-height:1.65;}
        .blk-head{font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;display:block;margin-bottom:5px;}
        .side{display:flex;flex-direction:column;gap:14px;}
        .cycle-box{text-align:center;padding:14px;border:1px solid rgba(255,255,255,.06);margin-bottom:10px;}
        .mrow{display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:13px;}
        .mlbl{font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:1px;color:rgba(200,214,229,.5);text-transform:uppercase;}
        .stats-bar{display:grid;grid-template-columns:repeat(auto-fill,minmax(105px,1fr));gap:8px;margin-bottom:14px;}
        .sbox{border:1px solid rgba(0,255,136,.12);background:rgba(0,0,0,.3);padding:12px;text-align:center;}
        .snum{font-family:'Bebas Neue',cursive;font-size:28px;letter-spacing:1px;}
        .slbl{font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:2px;color:rgba(200,214,229,.4);text-transform:uppercase;margin-top:2px;}
        .scard{border:1px solid rgba(0,255,136,.1);margin-bottom:10px;}
        .shdr{padding:12px 16px;background:rgba(0,0,0,.4);display:flex;justify-content:space-between;align-items:flex-start;gap:8px;flex-wrap:wrap;}
        .splays{padding:10px 16px;}
        .lgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px;}
        .lcard{background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.06);padding:10px 12px;display:flex;justify-content:space-between;align-items:center;}
        .hlist{list-style:none;}
        .hitem{padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:12px;color:#64748b;display:flex;align-items:flex-start;gap:8px;line-height:1.4;}
        .hitem::before{content:'//';color:rgba(0,255,136,.3);font-family:'Share Tech Mono',monospace;font-size:10px;flex-shrink:0;margin-top:1px;}
        .empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;gap:14px;color:rgba(200,214,229,.2);text-align:center;}
        .spin{width:50px;height:50px;border:2px solid rgba(0,255,136,.1);border-top-color:#00ff88;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto;}
        .spin-sm{width:14px;height:14px;border:2px solid rgba(251,191,36,.2);border-top-color:#fbbf24;border-radius:50%;animation:spin 1s linear infinite;display:inline-block;}
        @keyframes spin{to{transform:rotate(360deg);}}
        .err{background:rgba(255,51,85,.08);border:1px solid rgba(255,51,85,.3);color:#ff3355;padding:12px 16px;font-family:'Share Tech Mono',monospace;font-size:12px;margin-bottom:16px;}
        .notice-bar{background:rgba(251,191,36,.06);border:1px solid rgba(251,191,36,.2);padding:10px 16px;margin-bottom:14px;display:flex;flex-direction:column;gap:4px;}
        .footer{margin-top:16px;padding:10px 0;border-top:1px solid rgba(0,255,136,.08);display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px;}
        .verdict{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;margin-bottom:10px;border-radius:2px;flex-wrap:wrap;gap:8px;}
      `}</style>

      <ConfirmModal />
      <SettingsModal />

      <div className="dash">
        {/* HEADER */}
        <div className="hdr">
          <div>
            <div className="logo">MARKET GAUNTLET</div>
            <div className="logo-sub">MACRO // CRYPTO // OPTIONS // LIVE TRADE MONITOR</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
            {openPlayCount > 0 && (
              <span style={{fontFamily:"'Share Tech Mono',monospace",fontSize:10,color:"#fbbf24",letterSpacing:1,display:"flex",alignItems:"center",gap:6}}>
                <span className="spin-sm"/>
                {openPlayCount} OPEN TRADE{openPlayCount>1?"S":""} MONITORED
              </span>
            )}
            {/* Gist sync status */}
            {gistId && (
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:gistStatus==="ok"?"#00ff88":gistStatus==="syncing"?"#fbbf24":gistStatus==="error"?"#ff3355":"#475569"}}/>
                <span className="mono" style={{fontSize:9,color:"rgba(200,214,229,.3)",letterSpacing:1}}>
                  {gistStatus==="syncing"?"SYNCING":gistStatus==="ok"?`GIST SYNCED${gistLastSync?" "+fmtDate(gistLastSync):""}`:gistStatus==="error"?"SYNC ERR":"GIST"}
                </span>
              </div>
            )}
            {current && <span className="mono" style={{fontSize:10,color:"rgba(200,214,229,.3)"}}>LAST SCAN: {fmtDate(current.generated_at)}</span>}
            <button onClick={()=>setShowSettings(true)}
              style={{background:"transparent",border:"1px solid rgba(0,255,136,.25)",color:"rgba(0,255,136,.6)",fontFamily:"'Bebas Neue',cursive",fontSize:13,letterSpacing:2,padding:"6px 14px",cursor:"pointer"}}>
              ⚙ SYNC
            </button>
            <button className="gen-btn" onClick={generatePlays} disabled={loading||!storageReady}>
              {loading?"ANALYZING...":"⟳ GENERATE PLAYS"}
            </button>
          </div>
        </div>

        {error && <div className="err">⚠ {error}</div>}

        {/* REVIEW NOTICES */}
        {reviewNotices.length > 0 && (
          <div className="notice-bar">
            {reviewNotices.map((n,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{color:"#fbbf24",fontSize:12}}>◈</span>
                <span className="mono" style={{fontSize:11,color:"rgba(251,191,36,.8)",letterSpacing:1}}>{n}</span>
              </div>
            ))}
            <button onClick={()=>setReviewNotices([])} style={{alignSelf:"flex-end",background:"transparent",border:"none",color:"rgba(200,214,229,.3)",fontFamily:"'Share Tech Mono',monospace",fontSize:9,cursor:"pointer",letterSpacing:1,marginTop:4}}>
              DISMISS
            </button>
          </div>
        )}

        {/* TABS */}
        <div className="tabs">
          <button className={`tab-btn ${tab==="plays"?"active":""}`} onClick={()=>setTab("plays")}>CURRENT PLAYS</button>
          <button className={`tab-btn ${tab==="history"?"active":""}`} onClick={()=>setTab("history")}>
            PLAY LOG ({allPlays.length})
            {openPlayCount>0 && <span style={{marginLeft:6,background:"#fbbf24",color:"#06080d",fontFamily:"'Bebas Neue',cursive",fontSize:11,padding:"0 5px",borderRadius:2}}>{openPlayCount}</span>}
          </button>
        </div>

        {/* ══ PLAYS TAB ══ */}
        {tab==="plays" && (
          <>
            {loading && (
              <div style={{padding:"70px 20px",textAlign:"center"}}>
                <div className="spin"/>
                <div className="mono" style={{marginTop:22,fontSize:12,color:"rgba(0,255,136,.7)",letterSpacing:2}}>{loadingMsg}{dots}</div>
                <div style={{marginTop:10,fontSize:12,color:"rgba(200,214,229,.2)",maxWidth:340,margin:"10px auto 0"}}>Each play is steelmanned before approval</div>
              </div>
            )}

            {!loading && !current && (
              <div className="empty">
                <div style={{fontSize:48,opacity:.3}}>◈</div>
                <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,letterSpacing:3}}>AWAITING ANALYSIS</div>
                <div className="mono" style={{fontSize:10,letterSpacing:2,opacity:.6}}>GENERATE PLAYS TO BEGIN</div>
                <div style={{marginTop:8,fontSize:12,color:"rgba(200,214,229,.15)",maxWidth:420,lineHeight:1.7}}>
                  Mark a play "● In Trade" and it will be automatically reviewed every time you open the app.
                </div>
              </div>
            )}

            {!loading && current && (
              <>
                {/* REVIEW STATS */}
                {(current.plays_reviewed || current.plays_rejected) && (
                  <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
                    {[
                      ["REVIEWED", current.plays_reviewed || "—", "rgba(200,214,229,.4)"],
                      ["REJECTED", current.plays_rejected ?? "—", "#ff3355"],
                      ["PASSED",   current.plays?.length || 0, "#00ff88"],
                      ["PASS RATE",
                        current.plays_reviewed > 0
                          ? `${Math.round(((current.plays?.length||0) / current.plays_reviewed) * 100)}%`
                          : "—",
                        "rgba(200,214,229,.5)"],
                    ].map(([l,v,c])=>(
                      <div key={l} style={{background:"rgba(0,0,0,.4)",border:"1px solid rgba(255,255,255,.06)",padding:"10px 16px",flex:"1 1 100px"}}>
                        <div className="mono" style={{fontSize:9,letterSpacing:2,color:"rgba(200,214,229,.35)",textTransform:"uppercase",marginBottom:4}}>{l}</div>
                        <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,color:c,letterSpacing:1}}>{v}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid-2">
                  <div className="panel" style={{marginBottom:0}}>
                    <div className="ptitle">
                      <span>◆ Plays — {fmtDate(current.generated_at)}</span>
                      <button className="del-btn" style={{fontSize:11,padding:"3px 10px",border:"1px solid rgba(255,51,85,.2)",color:"rgba(255,51,85,.45)"}}
                        onClick={()=>setConfirmDelete({type:"session",sessionId:current.id})}>🗑 SESSION</button>
                    </div>

                    <table>
                      <thead>
                        <tr>
                          <th>Asset</th><th>Play</th><th>RH</th>
                          <th>Strike / Exp</th><th>Conv.</th><th>Status</th><th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {current.plays?.map(play => {
                          const statusKey = play.status || "";
                          const sm = STATUS_META[statusKey] || STATUS_META[""];
                          const isOpen = play.status === "open";
                          const rev = play.review;
                          const sig = rev ? SIGNAL_META[rev.signal] : null;
                          return (
                            <tr key={play.id} className={`row ${selectedPlay?.id===play.id?"sel":""}`}
                              onClick={()=>setSelectedPlay(s=>s?.id===play.id?null:play)}>
                              <td>
                                <div style={{display:"flex",alignItems:"center",gap:6}}>
                                  <div className="tname" style={{color:DIR_COLOR(play.direction)}}>{play.ticker}</div>
                                  {reviewingPlays.has(play.id) && <span className="spin-sm"/>}
                                  {isOpen && sig && !reviewingPlays.has(play.id) && (
                                    <span style={{fontFamily:"'Bebas Neue',cursive",fontSize:12,letterSpacing:1,color:sig.color,background:`${sig.color}15`,padding:"0 5px",borderRadius:2}}>
                                      {sig.icon}{sig.label}
                                    </span>
                                  )}
                                </div>
                                <div style={{fontSize:11,color:"rgba(200,214,229,.4)",marginTop:1}}>{play.name}</div>
                              </td>
                              <td>
                                <span className="badge" style={{background:`${DIR_COLOR(play.direction)}12`,color:DIR_COLOR(play.direction),border:`1px solid ${DIR_COLOR(play.direction)}35`}}>
                                  {PLAY_ICONS[play.play_type]||"◆"} {play.play_type?.replace(/_/g," ")}
                                </span>
                              </td>
                              <td>
                                <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                                  {play.robinhood_tickers?.slice(0,2).map((t,i)=>{
                                    const isCrypto = t.type === "crypto_spot";
                                    return (
                                      <span key={i} style={{fontFamily:"'Bebas Neue',cursive",fontSize:13,letterSpacing:1,
                                        color: isCrypto ? "#f7931a" : (LIQ_COLOR[t.liquidity]||"#c8d6e5"),
                                        background:"rgba(0,0,0,.5)",
                                        border: isCrypto ? "1px solid rgba(247,147,26,.2)" : "none",
                                        padding:"1px 5px",borderRadius:2}}>
                                        {t.symbol}{isCrypto ? " ₿" : ""}
                                      </span>
                                    );
                                  })}
                                </div>
                              </td>
                              <td>
                                <div className="mono" style={{fontSize:11,color:"#e2e8f0"}}>{play.strike_guidance}</div>
                                <div style={{fontSize:11,color:"rgba(200,214,229,.4)"}}>{play.expiration_guidance}</div>
                              </td>
                              <td><ConvictionMeter value={play.conviction||play.confidence||0}/></td>
                              <td onClick={e=>e.stopPropagation()}>
                                <select className="stat-sel" value={statusKey}
                                  onChange={e=>updatePlayStatus(current.id,play.id,e.target.value)}
                                  style={{color:sm.color,borderColor:sm.color}}>
                                  {Object.entries(STATUS_META).map(([k,v])=>(
                                    <option key={k} value={k}>{v.selectLabel}</option>
                                  ))}
                                </select>
                              </td>
                              <td onClick={e=>e.stopPropagation()}>
                                <button className="del-btn" onClick={()=>setConfirmDelete({type:"play",sessionId:current.id,playId:play.id})}>✕</button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* DETAIL */}
                    {selectedPlay && (() => {
                      const play = current.plays?.find(p=>p.id===selectedPlay.id) || selectedPlay;
                      return (
                        <div className="detail">
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                            <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,letterSpacing:2,color:DIR_COLOR(play.direction)}}>
                              {PLAY_ICONS[play.play_type]} {play.ticker} — {play.play_type?.toUpperCase().replace(/_/g," ")}
                            </div>
                            <span className="tag">{play.framework}</span>
                          </div>

                          {/* Conviction / sizing */}
                          <div className="verdict" style={{background:`${CONV_COLOR(play.conviction||0)}0d`,border:`1px solid ${CONV_COLOR(play.conviction||0)}25`}}>
                            <div>
                              <div className="mono" style={{fontSize:9,color:"rgba(200,214,229,.4)",letterSpacing:2,marginBottom:5}}>CONVICTION</div>
                              <ConvictionMeter value={play.conviction||play.confidence||0}/>
                            </div>
                            <div style={{textAlign:"right"}}>
                              <div className="mono" style={{fontSize:9,color:"rgba(200,214,229,.4)",letterSpacing:2,marginBottom:4}}>SUGGESTED SIZE</div>
                              <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:20,letterSpacing:2,color:"#fbbf24"}}>{play.position_size_pct||"—"}</div>
                            </div>
                          </div>

                          <div className="dgrid">
                            {[["Asset",play.asset_type],["Instrument",play.instrument],
                              ["Strike",play.strike_guidance],["Expiry",play.expiration_guidance],
                              ["Timeframe",play.timeframe],["Direction",play.direction?.toUpperCase()],
                            ].map(([l,v])=><div key={l}><label>{l}</label><span>{v}</span></div>)}
                          </div>

                          <div className="blk" style={{background:"rgba(0,0,0,.3)",borderLeft:"2px solid #00ff88"}}>
                            <span className="blk-head" style={{color:"#00ff88"}}>Thesis</span>{play.thesis}
                          </div>
                          <div className="blk" style={{background:"rgba(251,191,36,.04)",borderLeft:"2px solid #fbbf24"}}>
                            <span className="blk-head" style={{color:"#fbbf24"}}>Catalyst</span>{play.catalyst}
                          </div>
                          <div className="blk" style={{background:"rgba(255,51,85,.05)",border:"1px solid rgba(255,51,85,.18)"}}>
                            <span className="blk-head" style={{color:"#ff3355"}}>⚠ Bear Case</span>{play.bear_case}
                          </div>
                          <div className="blk" style={{background:"rgba(0,0,0,.3)",borderLeft:"2px solid rgba(255,51,85,.5)"}}>
                            <span className="blk-head" style={{color:"rgba(255,51,85,.6)"}}>Invalidation</span>{play.invalidation}
                          </div>

                          <RHTickerBadges tickers={play.robinhood_tickers}/>

                          {/* STATUS CONTROLS */}
                          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:14,alignItems:"center"}}>
                            <span className="mono" style={{fontSize:10,color:"rgba(200,214,229,.35)"}}>STATUS:</span>
                            {Object.entries(STATUS_META).map(([k,v])=>(
                              <button key={k} onClick={()=>{updatePlayStatus(current.id,play.id,k);setSelectedPlay(p=>({...p,status:k}));}}
                                style={{background:(play.status||"")===k?`${v.color}15`:"transparent",
                                  border:`1px solid ${(play.status||"")===k?v.color:"rgba(255,255,255,.1)"}`,
                                  color:(play.status||"")===k?v.color:"rgba(200,214,229,.4)",
                                  fontFamily:"'Share Tech Mono',monospace",fontSize:10,letterSpacing:1,
                                  padding:"5px 12px",cursor:"pointer",borderRadius:2}}>
                                {v.label}
                              </button>
                            ))}
                            <button className="del-btn" style={{marginLeft:"auto",fontSize:11,padding:"5px 12px",border:"1px solid rgba(255,51,85,.2)",color:"rgba(255,51,85,.45)"}}
                              onClick={()=>setConfirmDelete({type:"play",sessionId:current.id,playId:play.id})}>🗑 DELETE</button>
                          </div>

                          {/* LIVE REVIEW — only for open plays */}
                          {play.status==="open" && (
                            <>
                              <div style={{marginTop:16,fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:"rgba(0,255,136,.5)",letterSpacing:3,textTransform:"uppercase",borderTop:"1px solid rgba(0,255,136,.1)",paddingTop:14}}>
                                ◆ LIVE TRADE REVIEW
                              </div>
                              <ReviewPanel play={play} sessionId={current.id}/>
                            </>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* SIDEBAR */}
                  <div className="side">
                    <div className="panel" style={{marginBottom:0}}>
                      <div className="ptitle">◆ Market Pulse</div>
                      <div className="cycle-box">
                        <div className="mono" style={{fontSize:9,letterSpacing:3,color:"rgba(200,214,229,.4)",marginBottom:5,textTransform:"uppercase"}}>Cycle Phase</div>
                        <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:24,letterSpacing:2,color:CYCLE_COLORS[current.cycle_phase]||"#00ff88"}}>
                          {current.cycle_phase?.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())}
                        </div>
                      </div>
                      {[
                        ["Risk Level",current.risk_level?.toUpperCase(),RISK_COLORS[current.risk_level]],
                        ["Plays Passed",current.plays?.length||0,"#00ff88"],
                        ["Plays Rejected", current.plays_rejected ?? "—", "#ff3355"],
                        ["Open Trades",openPlayCount,"#fbbf24"],
                        ["Sessions",sessions.length,"rgba(200,214,229,.6)"],
                      ].map(([l,v,c])=>(
                        <div key={l} className="mrow">
                          <span className="mlbl">{l}</span>
                          <span className="mono" style={{fontWeight:700,fontSize:14,color:c}}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className="panel" style={{marginBottom:0}}>
                      <div className="ptitle">◆ Honest Thesis</div>
                      <p style={{fontSize:13,lineHeight:1.7,color:"#94a3b8"}}>{current.market_thesis}</p>
                      <div style={{marginTop:10}}>
                        <div className="mono" style={{fontSize:9,color:"rgba(200,214,229,.3)",letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Macro Data</div>
                        <p style={{fontSize:12,lineHeight:1.65,color:"#94a3b8"}}>{current.macro_context}</p>
                      </div>
                    </div>
                    <div className="panel" style={{marginBottom:0}}>
                      <div className="ptitle">◆ Cowen Lens</div>
                      <div style={{background:"rgba(0,0,0,.3)",borderLeft:"2px solid rgba(96,165,250,.6)",padding:"10px 12px",fontSize:12,lineHeight:1.6,color:"#7dd3fc",fontStyle:"italic"}}>
                        {current.cowen_lens}
                      </div>
                    </div>
                  </div>
                </div>

                {current.key_levels?.length>0 && (
                  <div className="panel">
                    <div className="ptitle">◆ Key Levels</div>
                    <div className="lgrid">
                      {current.key_levels.map((l,i)=>{
                        const c=l.type==="support"?"#00ff88":l.type==="resistance"?"#ff3355":"#fbbf24";
                        return (
                          <div key={i} className="lcard">
                            <div>
                              <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:18,color:c}}>{l.asset}</div>
                              <div style={{fontSize:11,color:"rgba(200,214,229,.4)",marginTop:2}}>{l.significance}</div>
                            </div>
                            <div style={{textAlign:"right"}}>
                              <div className="mono" style={{fontWeight:700,fontSize:14}}>{l.level}</div>
                              <div className="mono" style={{fontSize:9,color:c,textTransform:"uppercase",marginTop:2}}>{l.type}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {current.headlines_used?.length>0 && (
                  <div className="panel">
                    <div className="ptitle">◆ Headlines Ingested ({current.headlines_used.length})</div>
                    <ul className="hlist">
                      {current.headlines_used.map((h,i)=><li key={i} className="hitem">{h}</li>)}
                    </ul>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ══ HISTORY TAB ══ */}
        {tab==="history" && (
          <>
            {allPlays.length>0 && (()=>{
              const hits=allPlays.filter(p=>p.status==="hit").length;
              const misses=allPlays.filter(p=>p.status==="miss").length;
              const open=allPlays.filter(p=>p.status==="open").length;
              const closed=hits+misses;
              const wr=closed>0?Math.round((hits/closed)*100):null;
              return (
                <div className="stats-bar">
                  {[["Sessions",sessions.length,"#00ff88"],["Total Plays",allPlays.length,"#c8d6e5"],
                    ["In Trade",open,"#fbbf24"],["✓ Hit",hits,"#00ff88"],["✗ Miss",misses,"#ff3355"],
                    ["Win Rate",wr!==null?`${wr}%`:"—",wr!==null?(wr>=50?"#00ff88":"#ff3355"):"#64748b"],
                  ].map(([l,v,c])=>(
                    <div key={l} className="sbox"><div className="snum" style={{color:c}}>{v}</div><div className="slbl">{l}</div></div>
                  ))}
                </div>
              );
            })()}

            {sessions.length===0 && (
              <div className="empty">
                <div style={{fontSize:48,opacity:.3}}>◎</div>
                <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:22,letterSpacing:3}}>NO HISTORY YET</div>
              </div>
            )}

            {sessions.map(session=>(
              <div key={session.id} className="scard">
                <div className="shdr">
                  <div style={{flex:1}}>
                    <div className="mono" style={{fontSize:11,color:"rgba(0,255,136,.7)",letterSpacing:1}}>{fmtDate(session.generated_at)}</div>
                    <div style={{marginTop:4,display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
                      <span style={{fontFamily:"'Bebas Neue',cursive",fontSize:14,letterSpacing:2,color:CYCLE_COLORS[session.cycle_phase]||"#00ff88"}}>
                        {session.cycle_phase?.replace(/_/g," ").toUpperCase()}
                      </span>
                      <span className="mono" style={{fontSize:10,color:RISK_COLORS[session.risk_level]}}>RISK: {session.risk_level?.toUpperCase()}</span>
                      <span className="mono" style={{fontSize:10,color:"rgba(200,214,229,.4)"}}>
                        {session.plays?.length} passed / {typeof session.plays_reviewed === "number" ? session.plays_reviewed : "?"} reviewed
                      </span>
                    </div>
                  </div>
                  <button className="del-btn" style={{fontSize:16}} onClick={()=>setConfirmDelete({type:"session",sessionId:session.id})}>🗑</button>
                </div>
                <div className="splays">
                  <div style={{display:"grid",gridTemplateColumns:"60px 110px 90px 1fr 70px 110px 36px",gap:8,padding:"5px 0",borderBottom:"1px solid rgba(0,255,136,.08)"}}>
                    {["Ticker","Play","RH","Thesis","Conv.","Status",""].map(h=>(
                      <div key={h} className="mono" style={{fontSize:9,letterSpacing:2,color:"rgba(0,255,136,.4)",textTransform:"uppercase"}}>{h}</div>
                    ))}
                  </div>
                  {session.plays?.map(play=>{
                    const statusKey = play.status||"";
                    const sm = STATUS_META[statusKey]||STATUS_META[""];
                    const rev = play.review;
                    const sig = rev ? SIGNAL_META[rev.signal] : null;
                    return (
                      <div key={play.id} style={{display:"grid",gridTemplateColumns:"60px 110px 90px 1fr 70px 110px 36px",gap:8,alignItems:"center",padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,.03)"}}>
                        <div>
                          <div style={{fontFamily:"'Bebas Neue',cursive",fontSize:15,color:DIR_COLOR(play.direction)}}>{play.ticker}</div>
                          {play.status==="open" && sig && (
                            <div style={{fontFamily:"'Share Tech Mono',monospace",fontSize:9,color:sig.color,letterSpacing:1}}>{sig.icon}{sig.label}</div>
                          )}
                        </div>
                        <span className="badge" style={{background:`${DIR_COLOR(play.direction)}12`,color:DIR_COLOR(play.direction),border:`1px solid ${DIR_COLOR(play.direction)}30`,fontSize:9}}>
                          {PLAY_ICONS[play.play_type]||"◆"} {play.play_type?.replace(/_/g," ")}
                        </span>
                        <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                          {play.robinhood_tickers?.slice(0,2).map((t,i)=>(
                            <span key={i} style={{fontFamily:"'Bebas Neue',cursive",fontSize:12,color:LIQ_COLOR[t.liquidity]||"#c8d6e5",background:"rgba(0,0,0,.4)",padding:"0 4px",borderRadius:2}}>{t.symbol}</span>
                          ))}
                        </div>
                        <div style={{fontSize:11,color:"rgba(200,214,229,.45)",lineHeight:1.4,overflow:"hidden"}}>{play.thesis?.slice(0,60)}...</div>
                        <div><ConvictionMeter value={play.conviction||play.confidence||0} size="small"/></div>
                        <div>
                          <select className="stat-sel" value={statusKey}
                            onChange={e=>updatePlayStatus(session.id,play.id,e.target.value)}
                            style={{color:sm.color,borderColor:sm.color}}>
                            {Object.entries(STATUS_META).map(([k,v])=>(
                              <option key={k} value={k}>{v.selectLabel}</option>
                            ))}
                          </select>
                        </div>
                        <button className="del-btn" onClick={()=>setConfirmDelete({type:"play",sessionId:session.id,playId:play.id})}>✕</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}

        <div className="footer">
          <span className="mono" style={{fontSize:9,color:"rgba(200,214,229,.15)",letterSpacing:2}}>MARKET GAUNTLET v6.0 // CLAUDE + LIVE WEB SEARCH // PERSISTENT STORAGE</span>
          <span className="mono" style={{fontSize:9,color:"rgba(255,51,85,.35)",letterSpacing:1}}>⚠ NOT FINANCIAL ADVICE — RESEARCH ONLY</span>
        </div>
      </div>
    </>
  );
}
