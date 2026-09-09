export default function Header({ clientName, clientLogo, accentColor }) {
  function handleLogout() {
    localStorage.removeItem("tairuzz_auth");
    localStorage.removeItem("tairuzz_client_id");
    window.location.href = "/login";
  }

  return (
    <div
      style={{
        height: "44px",
        background: accentColor || "#1f1f1f",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 10px",
        flexShrink: 0
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={clientLogo}
          alt={clientName}
          style={{ height: "26px", marginRight: "8px" }}
        />
        <div style={{ fontSize: "14px", fontWeight: 500 }}>
          {clientName}
        </div>
      </div>
      <button
        onClick={handleLogout}
        style={{
          background: "rgba(255,255,255,0.15)",
          border: "none",
          borderRadius: "6px",
          color: "white",
          fontSize: "12px",
          padding: "6px 12px",
          cursor: "pointer"
        }}
      >
        Log out
      </button>
    </div>
  );
}
