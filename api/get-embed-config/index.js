const { PowerBiClient } = require("powerbi-api");
const msal = require("@azure/msal-node");

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

    const tokenResponse = await cca.acquireTokenByClientCredential({
      scopes: ["https://analysis.windows.net/powerbi/api/.default"]
    });

    const accessToken = tokenResponse.accessToken;

    const client = new PowerBiClient(accessToken);

    const embedResponse = await client.generateEmbedToken({
      reportId: process.env.POWERBI_REPORT_ID,
      datasetId: process.env.POWERBI_DATASET_ID
    });

    context.res = {
      status: 200,
      body: {
        embedUrl: process.env.POWERBI_EMBED_URL,
        reportId: process.env.POWERBI_REPORT_ID,
        embedToken: embedResponse.token
      }
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: { error: err.message }
    };
  }
};
