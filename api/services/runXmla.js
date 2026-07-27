const { spawn } = require("child_process");
const path = require("path");
const getAccessToken = require("./getAccessToken");

async function runXmla(daxQuery, workspaceUrl, datasetName) {
    const token = await getAccessToken();

    return new Promise((resolve, reject) => {
        const exePath = path.join(
            __dirname,
            "..",
            "xmla-runner",
            "bin",
            "Debug",
            "net48",
            "XmlaRunner.exe"
        );

        const args = [
        daxQuery,
        workspaceUrl,
        datasetName,
        token
        ];

        const child = spawn(exePath, args);

        let output = "";
        let errorOutput = "";

        child.stdout.on("data", data => {
            output += data.toString();
        });

        child.stderr.on("data", data => {
            errorOutput += data.toString();
        });

        child.on("close", code => {
            if (code === 0) {
                resolve(output);
            } else {
                reject(new Error(errorOutput || `XMLA Runner exited with code ${code}`));
            }
        });
    });
}
/*
// Test block
if (require.main === module) {
    const dax = "EVALUATE ROW(\"Test\", 1)";
    const workspace = "powerbi://api.powerbi.com/v1.0/myorg/Football Intelligence Engine";
    const dataset = "Football Project";

    runXmla(dax, workspace, dataset)
        .then(result => console.log("XMLA Result:\n", result))
        .catch(err => console.error("XMLA Error:\n", err));
}
*/
module.exports = runXmla;
