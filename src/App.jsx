import { useEffect, useState } from "react";
import { fetchClientConfig } from "./api/clientConfig";
import { fetchEmbedConfig } from "./api/embedConfig";

import Header from "./components/Header";
import SideNav from "./components/SideNav";
import PowerBIEmbed from "./components/PowerBIEmbed";

export default function App() {
  const [clientConfig, setClientConfig] = useState(null);
  const [embedConfig, setEmbedConfig] = useState(null);
  const [activePage, setActivePage] = useState(null);

  // -----------------------------
  // LOAD CLIENT CONFIG
  // -----------------------------
  useEffect(() => {
    const clientId = localStorage.getItem("tairuzz_client_id");
    if (!clientId) {
      console.error("App.jsx: No clientId found — user is not logged in");
      return;
    }

    fetchClientConfig(clientId)
      .then((cfg) => {
        const config = cfg.config || {}; // backend nests actual config under "config"
        setClientConfig(config);
        setActivePage(config.defaultPage || null);
      })
      .catch((err) => {
        console.error("Failed to fetch client config:", err);
        setClientConfig({}); // Prevent crash
      });
  }, []);

  // -----------------------------
  // LOAD EMBED CONFIG
  // -----------------------------
  useEffect(() => {
    fetchEmbedConfig()
      .then(setEmbedConfig)
      .catch((err) => {
        console.error("Failed to fetch embed config:", err);
        setEmbedConfig({}); // Prevent crash
      });
  }, []);

  // -----------------------------
  // APPLY ACCENT COLOR SAFELY
  // -----------------------------
  useEffect(() => {
    if (clientConfig?.accentColor) {
      console.log("Accent color loaded:", clientConfig.accentColor);

      document.body.style.setProperty(
        "--accent-color",
        clientConfig.accentColor
      );
      console.log("CSS variable now:", getComputedStyle(document.documentElement).getPropertyValue("--accent-color"));

    }
  }, [clientConfig]);

  // -----------------------------
  // LOADING STATE
  // -----------------------------
  if (!clientConfig || !embedConfig) {
    return <div>Loading…</div>;
  }

  // -----------------------------
  // MAIN LAYOUT
  // -----------------------------
  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      <SideNav
        tabs={clientConfig.tabs}
        activePage={activePage}
        onPageChange={setActivePage}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header
          clientName={clientConfig.clientName}
          clientLogo={clientConfig.clientLogo}
        />

        <PowerBIEmbed embedConfig={embedConfig} activePage={activePage} />
      </div>
    </div>
  );
}
