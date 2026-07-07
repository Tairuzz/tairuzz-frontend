document.addEventListener("DOMContentLoaded", async () => {

  if (window.powerbiInitialized) return;
  window.powerbiInitialized = true;

  const loader = document.getElementById("loader");
  const embedContainer = document.getElementById("embedContainer");

  if (!loader || !embedContainer) {
    console.error("Required DOM elements missing");
    return;
  }

  loader.style.display = "block"; // FIXED

  let config;
  try {
    const response = await fetch("/api/get-embed-config", {
      headers: {
        "x-tairuzz-auth": localStorage.getItem("tairuzz_auth")
      }
    });
    config = await response.json();
  } catch (err) {
    console.error("Failed to fetch embed config:", err);
    loader.innerText = "Failed to load report.";
    return;
  }

  const powerbiClient = window["powerbi-client"];
  if (!powerbiClient || !powerbiClient.models) {
    console.error("Power BI client library not loaded");
    return;
  }

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
        pageNavigation: { visible: false }
      }
    }
  };

  const report = window.powerbi.embed(embedContainer, embedConfig);

  report.on("loaded", () => {
    loader.style.display = "none";

    report.getPages().then(pages => {
      const buttons = document.querySelectorAll("#sideNav button");

      buttons.forEach(btn => {
        btn.onclick = () => {
          const targetName = btn.getAttribute("data-page");
          const targetPage = pages.find(p => p.displayName === targetName);

          if (targetPage) {
            targetPage.setActive();
            buttons.forEach(b => b.classList.remove("activePage"));
            btn.classList.add("activePage");
          } else {
            console.warn("Page not found:", targetName);
          }
        };
      });

      const activePage = pages.find(p => p.isActive);
      if (activePage) {
        const activeBtn = [...buttons].find(
          b => b.getAttribute("data-page") === activePage.displayName
        );
        if (activeBtn) activeBtn.classList.add("activePage");
      }
    });
  });

  report.on("error", (event) => {
    console.error("Power BI Embed Error:", event.detail);
  });
});
