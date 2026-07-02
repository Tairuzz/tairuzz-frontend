import * as powerbi from "powerbi-client";

window.onload = () => {
  loadReport();
};

async function loadReport() {
  const loader = document.getElementById("loader");
  const reportContainer = document.getElementById("reportContainer");

  loader.style.display = "flex";
  reportContainer.style.display = "block";

  // 🔥 CALL YOUR BACKEND TO GET FRESH TOKEN
  const response = await fetch("/api/get-embed-config");
  const config = await response.json();

  const models = powerbi.models;

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

  const report = powerbi.embed(reportContainer, embedConfig);

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
    if (reportContainer.requestFullscreen) reportContainer.requestFullscreen();
  };
}

