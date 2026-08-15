export default function Header({ clientName, clientLogo }) {
  return (
    <div
      style={{
        height: "44px",
        background: "#1f1f1f",
        color: "white",
        display: "flex",
        alignItems: "center",
        padding: "0 10px",
        flexShrink: 0
      }}
    >
      <img
        src={clientLogo}
        alt={clientName}
        style={{ height: "26px", marginRight: "8px" }}
      />
      <div style={{ fontSize: "14px", fontWeight: 500 }}>
        {clientName}
      </div>
    </div>
  );
}
