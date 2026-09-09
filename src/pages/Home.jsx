import { useState } from "react";

// -----------------------------------------------------------------------
// PUBLIC HOMEPAGE — sits at "/", requires no login.
// This is the "front door" the independent review flagged as missing:
// one sentence, previews, pricing, a way in. Everything past this page
// (login, dashboard) stays exactly as already built.
//
// TODO before shipping:
//   - Swap the three preview cards below for real screenshots of your
//     actual report pages (League Table, Player Profile, Fixture xG).
//   - Wire the "Request access" form to a real endpoint — right now it
//     just opens the visitor's email client as a placeholder.
//   - Replace PRICING_TIERS copy with your actual tier names/prices
//     once decided.
// -----------------------------------------------------------------------

const ACCENT = "#2ED9A8";
const BG = "#0A0F14";
const BG_RAISED = "#111820";
const BORDER = "#1F2A33";
const TEXT_MUTED = "#8B96A0";

const PRICING_TIERS = [
  { name: "Creator", blurb: "Core league and player views" },
  { name: "Analyst", blurb: "Full KPI suite, xG, comparisons" },
  { name: "Elite", blurb: "Everything, plus ad-hoc requests" },
];

const PREVIEWS = [
  { label: "Match story", desc: "xG margin against goal margin — clinical, dominant, or smash-and-grab, in one look." },
  { label: "Player, in English", desc: "Not just a table. A written summary of where a player ranks and why." },
  { label: "League table", desc: "Live standings, form, and points picked up vs. dropped, updated daily." },
];

function RequestAccessForm() {
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: replace with a real POST to your backend once that endpoint exists.
    window.location.href = `mailto:hello@tairuzz.co.uk?subject=Access request&body=Email: ${email}`;
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      <input
        type="email"
        required
        placeholder="you@yourshow.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          flex: "1 1 240px",
          padding: "13px 16px",
          background: BG,
          border: `1px solid ${BORDER}`,
          borderRadius: "8px",
          color: "#fff",
          fontSize: "15px",
          outline: "none"
        }}
      />
      <button
        type="submit"
        style={{
          padding: "13px 24px",
          background: ACCENT,
          border: "none",
          borderRadius: "8px",
          color: "#062018",
          fontWeight: 500,
          fontSize: "15px",
          cursor: "pointer"
        }}
      >
        Request access
      </button>
    </form>
  );
}

export default function Home() {
  return (
    <div style={{ background: BG, color: "#fff", minHeight: "100vh", fontFamily: "-apple-system, Segoe UI, sans-serif" }}>

      {/* Top bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 24px", borderBottom: `1px solid ${BORDER}`
      }}>
        <div style={{ fontSize: "18px", fontWeight: 500, letterSpacing: "0.5px" }}>Tairuzz</div>
        <a href="/login" style={{ color: TEXT_MUTED, textDecoration: "none", fontSize: "14px" }}>
          Log in
        </a>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "72px 24px 48px", textAlign: "center" }}>
        <h1 style={{
          fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 500, lineHeight: 1.2, margin: "0 0 20px"
        }}>
          Premier League analytics, ready to publish.
        </h1>
        <p style={{ fontSize: "17px", color: TEXT_MUTED, lineHeight: 1.6, margin: "0 0 32px" }}>
          Built for podcasters and creators who want the numbers Opta charges clubs for —
          without the club-sized bill, and with the angle already worked out for you.
        </p>
        <div style={{ maxWidth: "440px", margin: "0 auto" }}>
          <RequestAccessForm />
        </div>
      </div>

      {/* Live insight strip — replace with a real current-gameweek figure */}
      <div style={{
        maxWidth: "720px", margin: "0 auto 56px", padding: "16px 20px",
        background: BG_RAISED, border: `1px solid ${BORDER}`, borderRadius: "10px",
        display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: TEXT_MUTED
      }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: ACCENT, flexShrink: 0 }} />
        This gameweek: Arsenal lead the smash-and-grab table, three wins with an xG deficit.
      </div>

      {/* Previews */}
      <div style={{
        maxWidth: "960px", margin: "0 auto 72px", padding: "0 24px",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px"
      }}>
        {PREVIEWS.map((p) => (
          <div key={p.label} style={{
            background: BG_RAISED, border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "24px"
          }}>
            <div style={{ fontSize: "13px", color: ACCENT, fontWeight: 500, marginBottom: "10px" }}>{p.label}</div>
            <div style={{ fontSize: "14px", color: TEXT_MUTED, lineHeight: 1.6 }}>{p.desc}</div>
          </div>
        ))}
      </div>

      {/* Pricing teaser */}
      <div style={{ maxWidth: "960px", margin: "0 auto 80px", padding: "0 24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 500, marginBottom: "24px", textAlign: "center" }}>
          Three tiers. No club-sized invoice.
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {PRICING_TIERS.map((t) => (
            <div key={t.name} style={{
              border: `1px solid ${BORDER}`, borderRadius: "12px", padding: "24px", textAlign: "center"
            }}>
              <div style={{ fontSize: "16px", fontWeight: 500, marginBottom: "8px" }}>{t.name}</div>
              <div style={{ fontSize: "13px", color: TEXT_MUTED }}>{t.blurb}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: `1px solid ${BORDER}`, padding: "24px", textAlign: "center",
        fontSize: "13px", color: TEXT_MUTED
      }}>
        <a href="/privacy" style={{ color: TEXT_MUTED, marginRight: "16px" }}>Privacy</a>
        <a href="/terms" style={{ color: TEXT_MUTED }}>Terms</a>
      </div>
    </div>
  );
}
