module.exports = async function (context, req) {
    context.log("📥 Intelligence request received");

    const auth = req.headers["x-tairuzz-auth"];
    if (auth !== "true") {
        context.log("⛔ Unauthorized intelligence request");
        context.res = { status: 401, body: { error: "Unauthorized" } };
        return;
    }

    const query = req.body.query;
    if (!query) {
        context.log("⚠️ No query provided");
        context.res = { status: 400, body: { error: "Query is required" } };
        return;
    }

    context.log("🔎 Running Football Intelligence Engine for query: " + query);

    try {
        // 🔥 Your existing Football Intelligence Engine logic goes here
        // Example:
        const intelligence = await runFootballIntelligenceEngine(query);

        context.log("✅ Intelligence generated successfully");

        context.res = {
            status: 200,
            body: {
                intelligence: intelligence,
                query: query
            }
        };

    } catch (err) {
        context.log("❌ Intelligence Engine error: " + err.message);

        context.res = {
            status: 500,
            body: { error: err.message }
        };
    }
};
