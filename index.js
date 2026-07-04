window.onload = () => {
  loadReport();
};

async function loadReport() {
  const loader = document.getElementById("loader");
  const reportContainer = document.getElementById("reportContainer");

  // Show main content
  document.getElementById("mainContent").style.display = "flex";

  loader.style.display = "flex";
  reportContainer.style.display = "block";

  // Fetch embed configuration
  const response = await fetch("/api/get-embed-config");
  const config = await response.json();

  const models = window.powerbi.models;

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

  const report = window.powerbi.embed(reportContainer, embedConfig);

  loader.style.display = "none";

  // Navigation buttons
  document.getElementById("nextPage").onclick = async () => {
    const pages = await report.getPages();
    const active = pages.find(p => p.isActive);
    const index = pages.indexOf(active);
    if (index < pages.length - 1) pages[index + 1].setActive();
  };

  document.getElementById("prevPage").onclick = async () => {
    const pages = await report.getPages();
    const active = pages.find(p => p.isActive);
    const index = pages.indexOf(active);
    if (index > 0) pages[index - 1].setActive();
  };

  document.getElementById("fullscreenBtn").onclick = () => {
    report.fullscreen();
  };
}
