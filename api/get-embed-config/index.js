
import * as powerbi from "powerbi-client";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (response.status !== 200) {
    document.getElementById("loginError").innerText = data.error;
    return;
  }

  // Save JWT
  localStorage.setItem("token", data.token);

  // Hide login box
  document.getElementById("loginBox").style.display = "none";

  // Load report
  loadReport();
}

document.getElementById("loginBtn").onclick = login;


async function loadReport() {
  // Show loader while fetching
  const loader = document.getElementById("loader");
  const reportContainer = document.getElementById("reportContainer");

  // 1. Call your backend
  const response = await fetch("/api/get-embed-config", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });

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


// --------------------------------------
// AUTO‑LOGIN CHECK
// --------------------------------------
if (localStorage.getItem("token")) {
  document.getElementById("loginBox").style.display = "none";
  loadReport();
}
