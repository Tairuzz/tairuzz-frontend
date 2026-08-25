export default function SideNav({ tabs = {}, activePage, onPageChange, sidebarColor }) {
  const visibleTabs = Object.entries(tabs)
    .filter(([key, value]) => value !== false)
    .map(([key]) => key);
  return (
    <div
      style={{
        width: "150px",
        height: "100%",
        background: sidebarColor || "#3a3a3a",
        color: "#e0e0e0",
        borderRight: "1px solid #3a3a3a",
        padding: "6px 0",
        overflowY: "auto"
      }}
    >
      {visibleTabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onPageChange(tab)}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: activePage === tab ? "#1f1f1f" : "none",
            border: "none",
            textAlign: "left",
            color: activePage === tab ? "#ffffff" : "#e0e0e0",
            borderLeft:
              activePage === tab ? "3px solid #1f1f1f" : "3px solid transparent",
            cursor: "pointer",
            fontSize: "13px"
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
