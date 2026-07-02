import fetch from "node-fetch";
import { ConfidentialClientApplication } from "@azure/msal-node";

export default async function (req, res) {
  try {
    const msalConfig = {
      auth: {
        clientId: process.env.PBI_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.PBI_TENANT_ID}`,
        clientSecret: process.env.PBI_CLIENT_SECRET
      }
    };

    const cca = new ConfidentialClientApplication(msalConfig);

    const authResult = await cca.acquireTokenByClientCredential({
      scopes: ["https://analysis.windows.net/powerbi/api/.default"]
    });

    const accessToken = authResult.accessToken;

    const workspaceId = process.env.PBI_WORKSPACE_ID;
    const reportId = process.env.PBI_REPORT_ID;

    const embedReq = await fetch(
      `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}/GenerateToken`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ accessLevel: "View" })
      }
    );

    const embedData = await embedReq.json();

    return res.status(200).json({
      embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${workspaceId}`,
      reportId,
      embedToken: embedData.token
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to generate embed token" });
  }
}
