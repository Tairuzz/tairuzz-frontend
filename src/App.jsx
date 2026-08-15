import { useEffect, useState } from "react";
import { fetchClientConfig } from "./api/clientConfig";

export default function App() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    async function load() {
      const cfg = await fetchClientConfig("clubA");
      setConfig(cfg);
    }
    load();
  }, []);

  if (!config) return <div>Loading…</div>;
const [embedConfig, setEmbedConfig] = useState(null);

useEffect(() => {
  fetchEmbedConfig().then(setEmbedConfig).catch(console.error);
}, []);

  return (
    <div>
      <h1>{config.clientName}</h1>
      <img src={config.clientLogo} alt={config.clientName} />
    </div>
  );
}
