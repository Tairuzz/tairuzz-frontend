const xmlaController = require("../../controllers/xmlaController");

module.exports = async function (context, req) {
    context.log("📥 XMLA tables request received");

    try {
        await xmlaController.getTables(
            { body: req.body },   // mock Express req
            {
                json: (data) => context.res = { status: 200, body: data },
                status: (code) => ({
                    json: (data) => context.res = { status: code, body: data }
                })
            }
        );
    } catch (err) {
        context.log("❌ XMLA tables error: " + err.message);
        context.res = { status: 500, body: { error: err.message } };
    }
};
