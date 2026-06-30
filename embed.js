async function loadReport() {
  const response = await fetch("/api/get-embed-config");
  const config = await response.json();

  const models = window["powerbi-client"].models;

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

  const reportContainer = document.getElementById("reportContainer");
  powerbi.embed(reportContainer, embedConfig);
}

loadReport();
