document.addEventListener("DOMContentLoaded", async () => {
  const loader = document.getElementById("loader");
  const embedContainer = document.getElementById("embedContainer");

  if (!loader || !embedContainer) {
    console.error("Required DOM elements missing");
    return;
  }

  loader.style.display = "flex";

  let config;
  try {
    const response = await fetch("/api/get-embed-config");
    config = await response.json();
  } catch (err) {
    console.error("Failed to fetch embed config:", err);
    loader.innerText = "Failed to load report.";
    return;
  }
const powerbiClient = window['powerbi-client'];

if (!powerbiClient || !powerbiClient.models) {
    console.error("Power BI client library not loaded");
    return;
}
  // CORRECT namespace for your environment
  const models = powerbiClient.models;

  const embedConfig = {
    type: "report",
    id: config.reportId,
    embedUrl: config.embedUrl,
    accessToken: config.embedToken,
    tokenType: models.TokenType.Embed,
    settings: {
      panes: {
        filters: { visible: false },
        pageNavigation: { visible: true }
      }
    }
  };

  // CORRECT embed call for your environment
  const report = window.powerbi.embed(embedContainer, embedConfig);

  report.on("loaded", () => {
    loader.style.display = "none";
  });

  report.on("error", (event) => {
    console.error("Power BI Embed Error:", event.detail);
  });
});
