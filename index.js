// Wait for DOM + Power BI client to be ready before embedding
document.addEventListener("DOMContentLoaded", () => {
  const waitForPowerBi = setInterval(() => {
    if (window.powerbi && window.powerbi.embed) {
      clearInterval(waitForPowerBi);
      loadReport();
    }
  }, 50);
});

async function loadReport() {
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

  // Power BI models
  const models = window.powerbi.models;

  // Build embed configuration
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

  // Embed the report
  const report = window.powerbi.embed(reportContainer, embedConfig);

  // Hide loader once report is loaded
  report.on("loaded", () => {
    loader.style.display = "none";
  });

  // Optional: Page navigation buttons
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");

  if (prevBtn && nextBtn) {
    prevBtn.onclick = async () => {
      const pages = await report.getPages();
      const active = pages.find(p => p.isActive);
      const index = pages.indexOf(active);
      if (index > 0) pages[index - 1].setActive();
    };

    nextBtn.onclick = async () => {
      const pages = await report.getPages();
      const active = pages.find(p => p.isActive);
      const index = pages.indexOf(active);
      if (index < pages.length - 1) pages[index + 1].setActive();
    };
  }
}
