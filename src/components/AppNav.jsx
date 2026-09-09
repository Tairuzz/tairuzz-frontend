import { useState } from "react";

// -----------------------------------------------------------------------
// GROUPED APP NAVIGATION
// Replaces a flat list of report-page names with sections a creator
// actually thinks in: League, Matches, Players, Advanced.
//
// Each item has a `type`:
//   "native"   — a real React page you've migrated (no Power BI dependency)
//   "embedded" — still routes into the existing SideNav/PowerBIEmbed flow
//
// This lets you migrate pages one at a time without changing navigation —
// a visitor never sees which pages are which.
//
// Usage:
//   <AppNav
//     sections={sections}
//     activeItem={activeItem}
//     onNavigate={(item) => setActiveItem(item)}
//     accentColor={clientConfig.accentColor}
//   />
// -----------------------------------------------------------------------

const DEFAULT_SECTIONS = [
  {
    label: "League",
    items: [
      { id: "league-table", label: "League table", type: "embedded" },
      { id: "title-race", label: "Title race", type: "embedded" },
    ]
  },
  {
    label: "Matches",
    items: [
      { id: "match-story", label: "Match story (xG)", type: "native" },
      { id: "fixtures", label: "Fixtures and results", type: "embedded" },
    ]
  },
  {
    label: "Players",
    items: [
      { id: "kpi-explorer", label: "KPI explorer", type: "native" },
      { id: "profile", label: "Player profile", type: "embedded" },
    ]
  },
  {
    label: "Advanced",
    items: [
      { id: "attack-threat", label: "Attack threat", type: "embedded" },
      { id: "compare", label: "Compare players", type: "embedded" },
      { id: "goal-categories", label: "Goal categories", type: "embedded" },
    ]
  }
];

export default function AppNav({
  sections = DEFAULT_SECTIONS,
  activeItem,
  onNavigate,
  sidebarColor = "#3a3a3a",
  sidebarTextColor = "#e0e0e0"
}) {
  const [openSection, setOpenSection] = useState(sections[0]?.label);

  return (
    <div style={{
      width: "200px",
      height: "100%",
      background: sidebarColor,
      color: sidebarTextColor,
      overflowY: "auto",
      padding: "8px 0"
    }}>
      {sections.map((section) => {
        const isOpen = openSection === section.label;
        return (
          <div key={section.label}>
            <button
              onClick={() => setOpenSection(isOpen ? null : section.label)}
              style={{
                width: "100%", textAlign: "left", background: "none", border: "none",
                color: sidebarTextColor, opacity: 0.7, fontSize: "11px", fontWeight: 500,
                letterSpacing: "0.5px", padding: "14px 16px 6px", cursor: "pointer"
              }}
            >
              {section.label}
            </button>
            {isOpen && section.items.map((item) => {
              const active = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item)}
                  style={{
                    width: "100%", textAlign: "left", padding: "9px 16px 9px 20px",
                    background: active ? "rgba(0,0,0,0.25)" : "none",
                    border: "none",
                    borderLeft: active ? "3px solid #fff" : "3px solid transparent",
                    color: sidebarTextColor, fontSize: "13px", cursor: "pointer"
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
