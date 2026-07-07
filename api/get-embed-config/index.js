module.exports = async function (context, req) {

  const auth = req.headers["x-tairuzz-auth"];

  if (auth !== "true") {
    context.res = {
      status: 401,
      body: { error: "Unauthorized" }
    };
    return;
  }
const msal = require("@azure/msal-node");
const fetch = require("node-fetch");

module.exports = async function (context, req) {
  try {
    // MSAL config
    const msalConfig = {
      auth: {
        clientId: process.env.POWERBI_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.POWERBI_TENANT_ID}`,
        clientSecret: process.env.POWERBI_CLIENT_SECRET
      }
    };

    const cca = new msal.ConfidentialClientApplication(msalConfig);

    // Acquire Azure AD token for Power BI REST API
    const tokenResponse = await cca.acquireTokenByClientCredential({
      scopes: ["https://analysis.windows.net/powerbi/api/.default"]
    });

    const accessToken = tokenResponse.accessToken;

    // Generate embed token via REST API
    const workspaceId = process.env.POWERBI_WORKSPACE_ID;
    const reportId = process.env.POWERBI_REPORT_ID;

    const embedTokenResponse = await fetch(
      `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}/GenerateToken`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          accessLevel: "view"
        })
      }
    );

    const embedTokenJson = await embedTokenResponse.json();

    context.res = {
      status: 200,
      body: {
        embedUrl: process.env.POWERBI_EMBED_URL,
        reportId: reportId,
        embedToken: embedTokenJson.token
      }
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: { error: err.message }
    };
  }
};
