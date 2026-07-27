const msal = require("@azure/msal-node");
const fetch = require("node-fetch");

// -------------------------------
// POWER BI CAPACITY WAKE/SLEEP LOGIC
// -------------------------------

// Webhook URLs from environment variables
const RESUME_URL = process.env.RESUME_WEBHOOK_URL;
const SUSPEND_URL = process.env.SUSPEND_WEBHOOK_URL;

// Inactivity timer (shared across function executions)
let inactivityTimer = null;

// Wake capacity immediately
function wakeCapacity(context) {
    if (!RESUME_URL) {
        context.log("⚠️ Resume webhook missing — cannot wake capacity");
        return;
    }

    context.log("🔵 Wake event triggered — calling Resume webhook");

    fetch(RESUME_URL, { method: "POST" })
        .then(() => context.log("✅ Resume webhook call succeeded"))
        .catch(err => context.log("❌ Resume webhook call failed: " + err.message));
}

// Sleep capacity after 3 minutes of inactivity
function resetSleepTimer(context) {
    if (!SUSPEND_URL) {
        context.log("⚠️ Suspend webhook missing — cannot schedule sleep");
        return;
    }

    if (inactivityTimer) {
        context.log("🔁 Resetting inactivity timer");
        clearTimeout(inactivityTimer);
    }

    inactivityTimer = setTimeout(() => {
        context.log("🟠 Sleep event triggered — calling Suspend webhook");

        fetch(SUSPEND_URL, { method: "POST" })
            .then(() => context.log("✅ Suspend webhook call succeeded"))
            .catch(err => context.log("❌ Suspend webhook call failed: " + err.message));
    }, 3 * 60 * 1000); // 3 minutes
}

// -------------------------------
// MAIN FUNCTION
// -------------------------------

module.exports = async function (context, req) {

    context.log("📥 Incoming embed config request");

    // SIMPLE AUTH CHECK
    const auth = req.headers["x-tairuzz-auth"];
    if (auth !== "true") {
        context.log("⛔ Unauthorized request blocked");
        context.res = {
            status: 401,
            body: { error: "Unauthorized" }
        };
        return;
    }

    // WAKE CAPACITY ON ANY REQUEST
    wakeCapacity(context);

    // RESET INACTIVITY TIMER
    resetSleepTimer(context);

    try {
        context.log("🔐 Acquiring Power BI access token");

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

        context.log("🔑 Power BI access token acquired successfully");

        // Generate embed token via REST API
        const workspaceId = process.env.POWERBI_WORKSPACE_ID;
        const reportId = process.env.POWERBI_REPORT_ID;

        context.log(`📡 Generating embed token for report ${reportId}`);

        const embedTokenResponse = await fetch(
            `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}/GenerateToken`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify({ accessLevel: "view" })
            }
        );

        const embedTokenJson = await embedTokenResponse.json();

        context.log("🎫 Embed token generated successfully");

        context.res = {
            status: 200,
            body: {
                embedUrl: process.env.POWERBI_EMBED_URL,
                reportId: reportId,
                embedToken: embedTokenJson.token
            }
        };

        context.log("📤 Embed config response sent");

    } catch (err) {
        context.log("❌ Error in embed config function: " + err.message);

        context.res = {
            status: 500,
            body: { error: err.message }
        };
    }
};
