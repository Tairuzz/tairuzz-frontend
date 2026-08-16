import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!data.success) {
        setError("Invalid email or password");
        return;
      }

      localStorage.setItem("tairuzz_auth", data.token);
      window.location.href = "/";
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        background: "#0f0f0f",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <div
        style={{
          background: "#1f1f1f",
          padding: "40px",
          borderRadius: "8px",
          width: "320px",
          textAlign: "center",
          boxShadow: "0 0 20px rgba(0,0,0,0.4)"
        }}
      >
        {/* Logo */}
        <div
          style={{
            height: "60px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#3aa6ff",
            fontWeight: "bold"
          }}
        >
          Club Logo Pending
        </div>


        {/* Title */}
        <h2 style={{ color: "white", marginBottom: "20px" }}>
          Tairuzz Analytics Login
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "12px",
              borderRadius: "4px",
              border: "1px solid #333",
              background: "#2a2a2a",
              color: "white"
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "12px",
              borderRadius: "4px",
              border: "1px solid #333",
              background: "#2a2a2a",
              color: "white"
            }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#3aa6ff",
              border: "none",
              borderRadius: "4px",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "10px"
            }}
          >
            Login
          </button>

          {error && (
            <div style={{ marginTop: "12px", color: "#ff4444" }}>{error}</div>
          )}
        </form>
      </div>
    </div>
  );
}
