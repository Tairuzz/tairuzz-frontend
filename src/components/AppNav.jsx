import { useState } from "react";

// pageName must match the key in each client's Cosmos "tabs" map EXACTLY
// (same capitalisation), because visibility is looked up by that key.
// Native pages (built in this app, not Power BI) use tabKey instead.
export const NAV_SECTIONS = [
  {
    label: "League",
    items: [
      { id: "league-table", label: "League table", type: "embedded", pageName: "League Table" },
      { id: "title-race", label: "Title race", type: "embedded", pageName: "Title Race" },
      { id: "team-xg", label: "Team results by xG", type: "embedded", pageName: "Team Results by XG" },
      { id: "sos-club", label: "Season on season (club)", type: "embedded", pageName: "Season On Season Club" }
    ]
  },
  {
    label: "Matches",
    items: [
      { id: "match-xg", label: "Match story (xG)", type: "embedded", pageName: "Fixture Results by XG" },
      { id: "fixtures", label: "Fixtures and results", type: "embedded", pageName: "Fixtures And Result" },
      { id: "team-fixture", label: "Team fixture performance", type: "embedded", pageName: "Team Fixture Performance" }
    ]
  },
  {
    label: "Players",
    items: [
      { id: "kpi-explorer", label: "KPI explorer", type: "native", tabKey: "KPI Explorer" },
      { id: "profile", label: "Player profile", type: "embedded", pageName: "Profile" },
      { id: "perf-rank", label: "Performance rank", type: "embedded", pageName: "Performance Rank" },
      { id: "perf-metrics", label: "Performance metrics", type: "embedded", pageName: "Performance Metrics" },
      { id: "compare", label: "Compare players", type: "embedded", pageName: "Compare Performance Metrics" },
      { id: "sos-player", label: "Season on season (player)", type: "embedded", pageName: "Season On Season Player" }
    ]
  },
  {
    label: "Advanced",
    items: [
      { id: "goal-impact", label: "Goal impact", type: "embedded", pageName: "Goal Impact" },
      { id: "attack-threat", label: "Attack threat", type: "embedded", pageName: "Attack Threat" },
      { id: "kpis-plot", label: "KPIs plot", type: "embedded", pageName: "Kpis Plot" },
      { id: "goal-placement", label: "Goal placement", type: "embedded", pageName: "Goal Placement" },
      { id: "goal-categories", label: "Goal categories (logos)", type: "embedded", pageName: "Goal Categories" },
      { id: "goal-categories-2", label: "Goal categories (scatter)", type: "embedded", pageName: "Goal Categories2" },
      { id: "goal-analysis", label: "Goal analysis", type: "embedded", pageName: "Goal Analysis" },
      { id: "goal-flow", label: "Goal flow", type: "embedded", pageName: "Goal Flow" }
    ]
  }
];

export default function AppNav({
  sections = NAV_SECTIONS,
  tabs = {},
  activeId,
  onNavigate,
  sidebarColor,
  sidebarTextColor = "#e0e0e0",
  activeTabBackground = "#1f1f1f",
  activeTabTextColor = "#ffffff"
}) {
  const [collapsed, setCollapsed] = useState({ Advanced: true });

  // A page shows only if the client's tabs map sets it to true.
  const isVisible = (item) =>
    tabs[item.type === "native" ? item.tabKey : item.pageName] === true;

  // Any tab set to true in Cosmos that isn't listed above appears under "More",
  // so a new report page needs no code change to show up.
  const listedKeys = new Set(
    sections.flatMap((s) => s.items.map((i) => (i.type === "native" ? i.tabKey : i.pageName)))
  );
  const extraItems = Object.keys(tabs)
    .filter((k) => tabs[k] === true && !listedKeys.has(k))
    .map((k) => ({ id: `extra-${k}`, label: k, type: "embedded", pageName: k }));

  const visibleSections = [
    ...sections.map((s) => ({ ...s, items: s.items.filter(isVisible) })),
    { label: "More", items: extraItems }
  ].filter((s) => s.items.length > 0);

  return (
    <div
      style={{
        width: "110px",
        height: "100%",
        background: sidebarColor || "#3a3a3a",
        color: sidebarTextColor,
        overflowY: "auto",
        padding: "6px 0",
        flexShrink: 0
      }}
    >
      {visibleSections.map((section) => {
        // A section that contains the active page always stays open.
        const holdsActive = section.items.some((i) => i.id === activeId);
        const isCollapsed = !!collapsed[section.label] && !holdsActive;
        return (
          <div key={section.label}>
            <button
              onClick={() => setCollapsed({ ...collapsed, [section.label]: !isCollapsed })}
              style={{
                width: "100%", textAlign: "left", background: "none", border: "none",
                color: sidebarTextColor, opacity: 0.75, fontSize: "10px", fontWeight: 600,
                letterSpacing: "0.5px", textTransform: "uppercase",
                padding: "12px 6px 4px", cursor: "pointer"
              }}
            >
              {section.label} {isCollapsed ? "+" : "-"}
            </button>
            {!isCollapsed &&
              section.items.map((item) => {
                const active = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item)}
                    style={{
                      width: "100%", textAlign: "left", padding: "8px 6px",
                      background: active ? activeTabBackground : "none",
                      border: "none",
                      borderLeft: active ? `3px solid ${activeTabBackground}` : "3px solid transparent",
                      color: active ? activeTabTextColor : sidebarTextColor,
                      fontSize: "12px", cursor: "pointer"
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
          </div>
        );
      })}
    </div>
  );
}