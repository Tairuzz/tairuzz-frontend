export default function LogoutButton() {
  function logout() {
    localStorage.removeItem("tairuzz_auth");
    window.location.href = "/login";
  }

  return (
    <button
      onClick={logout}
      style={{
        background: "none",
        border: "none",
        color: "#e0e0e0",
        cursor: "pointer",
        marginTop: "10px",
        padding: "10px"
      }}
    >
      Logout
    </button>
  );
}
