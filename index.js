document.addEventListener("DOMContentLoaded", async () => {
  const loader = document.getElementById("loader");
  const reportContainer = document.getElementById("reportContainer");
  const mainContent = document.getElementById("mainContent");

  // Show main content + loader
  mainContent.style.display = "flex";
  loader.style.display = "flex";
  reportContainer.style.display = "block";

  // Fetch embed configuration
  let config;
  try {
    const response = await fetch("/api/get-embed-config");
    config = await response.json();
  } catch (err) {
    console.error("Failed to fetch embed config:", err);
    loader.innerText = "Failed to load report.";
    return;
  }

  // Use the correct namespace from Developer Playground
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

  // Embed using the correct namespace
  const report = window['powerbi-client'].embed(reportContainer, embedConfig);

  // Hide loader when report is loaded
  report.on("loaded", () => {
    loader.style.display = "none";
  });

  // Optional error logging
  report.on("error", (event) => {
    console.error("Power BI Embed Error:", event.detail);
  });
});
