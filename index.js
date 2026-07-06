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

  const models = window['powerbi-client'].models;

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

  const report = window['powerbi-client'].embed(embedContainer, embedConfig);

  report.on("loaded", () => {
    loader.style.display = "none";
  });

  report.on("error", (event) => {
    console.error("Power BI Embed Error:", event.detail);
  });
});
