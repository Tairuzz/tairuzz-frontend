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

  useEffect(() => {
    // Read the correct key (aligned with Login.jsx and ProtectedRoute)
    const clientId = localStorage.getItem("tairuzz_client_id");

    if (!clientId) {
      console.error("App.jsx: No clientId found — user is not logged in");
      return;
    }

    fetchClientConfig(clientId)
      .then((cfg) => {
        setClientConfig(cfg);
        setActivePage(cfg.defaultPage || null);
      })
      .catch((err) => {
        console.error("Failed to fetch client config:", err);
        setClientConfig({}); // Prevent crash
      });
  }, []);

  useEffect(() => {
    fetchEmbedConfig()
      .then(setEmbedConfig)
      .catch((err) => {
        console.error("Failed to fetch embed config:", err);
        setEmbedConfig({}); // Prevent crash
      });
  }, []);

  if (!clientConfig || !embedConfig) {
    return <div>Loading…</div>;
  }

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
