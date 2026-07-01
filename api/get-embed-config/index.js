const fetch = require("node-fetch");
const qs = require("qs");

module.exports = async function (context, req) {
  const tenantId = "41f63eb4-f8aa-485a-86d6-c3762e4e8db5";
  const clientId = "cb099af1-7789-4110-8797-937c8b0fb9e5";
  const clientSecret = process.env.AZURE_APP_SECRET;

  const workspaceId = "3155d8d0-9725-40c1-b9f4-0ebdd5e9706c";
  const reportId = "c1dd388a-a664-43ff-ad25-6b0c6adabe81";

  try {
    // 1. Authenticate
   const tokenResponse = await fetch(
  `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
  {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: qs.stringify({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "https://analysis.windows.net/powerbi/api/.default"
    })
  }
);

context.log("TOKEN STATUS:", tokenResponse.status);
const tokenJson = await tokenResponse.json();
context.log("TOKEN JSON:", tokenJson);

if (!tokenJson.access_token) {
  throw new Error(`Authentication failed — ${tokenJson.error}: ${tokenJson.error_description}`);
}

    const access_token = tokenJson.access_token;

    // 2. Get report metadata
    const reportResponse = await fetch(
      `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`,
      {
        headers: { Authorization: `Bearer ${access_token}` }
      }
    );

    const reportJson = await reportResponse.json();
    context.log("REPORT RESPONSE:", reportJson);

    if (!reportJson.embedUrl) {
      throw new Error("Report metadata failed — no embedUrl");
    }

    const embedUrl = reportJson.embedUrl;
    const datasetId = reportJson.datasetId;

    // 3. Generate embed token
    const tokenGenResponse = await fetch(
      `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}/GenerateToken`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          accessLevel: "View",
          identities: []
        })
      }
    );

    const tokenGenJson = await tokenGenResponse.json();
    context.log("TOKEN GEN RESPONSE:", tokenGenJson);

    if (!tokenGenJson.token) {
      throw new Error("Token generation failed — no token");
    }

    context.res = {
      status: 200,
      body: {
        embedUrl,
        reportId,
        datasetId,
        embedToken: tokenGenJson.token
      }
    };
  } catch (err) {
    context.log("FINAL ERROR:", err.message);
    context.res = {
      status: 500,
      body: err.message
    };
  }
};
