import { useEffect, useState } from "react";
import { fetchClientConfig } from "./api/clientConfig";
import { fetchEmbedConfig } from "./api/embedConfig";
import Header from "./components/Header";
import AppNav, { NAV_SECTIONS } from "./components/AppNav";
import PowerBIEmbed from "./components/PowerBIEmbed";
import KpiExplorer from "./pages/KpiExplorer";

export default function App() {
  const [clientConfig, setClientConfig] = useState(null);
  const [embedConfig, setEmbedConfig] = useState(null);
  const [activePage, setActivePage] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [view, setView] = useState("embedded"); // "embedded" | "native"

  // LOAD CLIENT CONFIG
  useEffect(() => {
    const clientId = localStorage.getItem("tairuzz_client_id");
    if (!clientId) {
      console.error("App.jsx: No clientId found - user is not logged in");
      return;
    }
    fetchClientConfig(clientId)
      .then((cfg) => {
        const config = cfg.config || {};
        setClientConfig(config);

        // Highlight the client's default page in the menu if it is listed there.
        const wanted = (config.defaultPage || "").trim().toLowerCase();
        const start = NAV_SECTIONS.flatMap((s) => s.items).find(
          (i) => i.type === "embedded" && i.pageName.toLowerCase() === wanted
        );
        if (start) {
          setActiveId(start.id);
          setActivePage(start.pageName);
        } else {
          setActivePage(config.defaultPage || null);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch client config:", err);
        setClientConfig({});
      });
  }, []);

  // LOAD EMBED CONFIG
  useEffect(() => {
    fetchEmbedConfig()
      .then(setEmbedConfig)
      .catch((err) => {
        console.error("Failed to fetch embed config:", err);
        setEmbedConfig({});
      });
  }, []);

  function handleNavigate(item) {
    setActiveId(item.id);
    setView(item.type);
    if (item.type === "embedded") setActivePage(item.pageName);
  }

  if (!clientConfig || !embedConfig) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: "flex", height: "100%", width: "100%" }}>
      <AppNav
        tabs={clientConfig.tabs}
        activeId={activeId}
        onNavigate={handleNavigate}
        sidebarColor={clientConfig.sidebarColor}
        sidebarTextColor={clientConfig.sidebarTextColor}
        activeTabBackground={clientConfig.activeTabBackground}
        activeTabTextColor={clientConfig.activeTabTextColor}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header
          clientName={clientConfig.clientName}
          clientLogo={clientConfig.clientLogo}
          accentColor={clientConfig.accentColor}
        />
        {/* The report stays mounted while a native page shows, so switching back is instant. */}
        <div style={{ flex: 1, display: view === "embedded" ? "flex" : "none", flexDirection: "column" }}>
          <PowerBIEmbed embedConfig={embedConfig} activePage={activePage} />
        </div>
        {view === "native" && activeId === "kpi-explorer" && (
          <div style={{ flex: 1, minHeight: 0, overflow: "auto", background: "#fff", color: "#111" }}>
            <KpiExplorer />
          </div>
        )}
      </div>
    </div>
  );
}
