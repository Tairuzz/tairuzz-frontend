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
        setError("Invalid login");
        return;
      }

      localStorage.setItem("tairuzz_auth", data.token);
      window.location.href = "/";
    } catch (err) {
      setError("Login failed");
    }
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin} style={{ maxWidth: "300px" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#1f1f1f",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Login
        </button>

        {error && (
          <div style={{ marginTop: "10px", color: "red" }}>{error}</div>
        )}
      </form>
    </div>
  );
}
