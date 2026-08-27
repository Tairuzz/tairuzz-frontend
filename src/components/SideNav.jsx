export default function SideNav({
  tabs = {},
  activePage,
  onPageChange,
  sidebarColor,
  sidebarTextColor = "#e0e0e0",
  activeTabBackground = "#1f1f1f",
  activeTabTextColor = "#ffffff"
}) {
  const visibleTabs = Object.entries(tabs)
    .filter(([key, value]) => value !== false)
    .map(([key]) => key);

  return (
    <div
      style={{
        width: "110px",
        height: "100%",
        background: sidebarColor || "#3a3a3a",
        color: sidebarTextColor,
        borderRight: "1px solid #3a3a3a",
        padding: "6px 0",
        overflowY: "auto"
      }}
    >
      {visibleTabs.map((tab) => {
        const isActive = activePage === tab;
        return (
          <button
            key={tab}
            onClick={() => onPageChange(tab)}
            style={{
              width: "100%",
              padding: "10px 6px",
              background: isActive ? activeTabBackground : "none",
              border: "none",
              textAlign: "left",
              color: isActive ? activeTabTextColor : sidebarTextColor,
              borderLeft: isActive
                ? `3px solid ${activeTabBackground}`
                : "3px solid transparent",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
