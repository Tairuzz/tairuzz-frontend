const xmlaController = require("../../controllers/xmlaController");

module.exports = async function (context, req) {
    context.log("📥 XMLA run-dax request received");

    try {
        // Convert Express-style controller to Azure Function style
        const result = await xmlaController.runDax(
            { body: req.body },   // mock Express req
            {                     // mock Express res
                json: (data) => context.res = { status: 200, body: data },
                status: (code) => ({
                    json: (data) => context.res = { status: code, body: data }
                })
            }
        );
    } catch (err) {
        context.log("❌ XMLA run-dax error: " + err.message);
        context.res = { status: 500, body: { error: err.message } };
    }
};
