import { useEffect, useState } from "react";
import { fetchClientConfig } from "./api/clientConfig";
import { fetchEmbedConfig } from "./api/embedConfig";

export default function App() {
  // -----------------------------
  // STATE
  // -----------------------------
  const [clientConfig, setClientConfig] = useState(null);
  const [embedConfig, setEmbedConfig] = useState(null);

  // -----------------------------
  // AUTH CHECK
  // -----------------------------
  useEffect(() => {
    if (!localStorage.getItem("tairuzz_auth")) {
      window.location.href = "/login.html";
    }
  }, []);

  // -----------------------------
  // LOAD CLIENT CONFIG
  // -----------------------------
  useEffect(() => {
    fetchClientConfig()
      .then(setClientConfig)
      .catch(err => console.error("Client config error:", err));
  }, []);

  // -----------------------------
  // LOAD EMBED CONFIG
  // -----------------------------
  useEffect(() => {
    fetchEmbedConfig()
      .then(setEmbedConfig)
      .catch(err => console.error("Embed config error:", err));
  }, []);

  // -----------------------------
  // LOADING STATE
  // -----------------------------
  if (!clientConfig || !embedConfig) {
    return <div>Loading…</div>;
  }

  // -----------------------------
  // TEMP UI (will be replaced)
  // -----------------------------
  return (
    <div>
      <h1>{clientConfig.clientName}</h1>
      <img
        src={clientConfig.clientLogo}
        alt={clientConfig.clientName}
        style={{ height: "60px" }}
      />

      <pre style={{ marginTop: "20px" }}>
        {JSON.stringify(embedConfig, null, 2)}
      </pre>
    </div>
  );
}
