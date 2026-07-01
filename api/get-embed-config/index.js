import * as powerbi from "powerbi-client";

async function loadReport() {
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
  const reportContainer = document.getElementById("reportContainer");
  powerbi.embed(reportContainer, embedConfig);
}

// 4. Load report on page load
loadReport();

