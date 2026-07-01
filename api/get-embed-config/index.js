import * as powerbi from "powerbi-client";

async function loadReport() {
  // Show loader while fetching
  const loader = document.getElementById("loader");
  const reportContainer = document.getElementById("reportContainer");

  // 1. Call your backend
  const response = await fetch("/api/get-embed-config");
  const config = await response.json();

  const embedUrl = config.embedUrl;
  const reportId = config.reportId;
  const embedToken = config.embedToken;

  // 2. Prepare Power BI embed config
  const models = powerbi.models;

  const embedConfig = {
    type: "report",
    id: reportId,
    embedUrl: embedUrl,
    accessToken: embedToken,
    tokenType: models.TokenType.Embed,
    settings: {
      panes: {
        filters: { visible: false },
        pageNavigation: { visible: true }
      }
    }
  };

  // 3. Embed into your container
  const report = powerbi.embed(reportContainer, embedConfig);

  // Hide loader, show report
  loader.style.display = "none";
  reportContainer.style.display = "block";

  // -----------------------------
  // PAGE NAVIGATION BUTTONS
  // -----------------------------
  document.getElementById("nextPage").onclick = async () => {
    const pages = await report.getPages();
    const active = pages.find(p => p.isActive);
    const index = pages.indexOf(active);

    if (index < pages.length - 1) {
      pages[index + 1].setActive();
    }
  };

  document.getElementById("prevPage").onclick = async () => {
    const pages = await report.getPages();
    const active = pages.find(p => p.isActive);
    const index = pages.indexOf(active);

    if (index > 0) {
      pages[index - 1].setActive();
    }
  };

  // -----------------------------
  // FULL SCREEN BUTTON
  // -----------------------------
  document.getElementById("fullscreenBtn").onclick = () => {
    if (reportContainer.requestFullscreen) {
      reportContainer.requestFullscreen();
    }
  };
}

// 4. Load report on page load
loadReport();
