const runXmla = require("../services/runXmla");

// 1. List tables
exports.getTables = async (req, res) => {
    try {
        const { workspace, dataset } = req.body;
        const dax = `SELECT * FROM $SYSTEM.TMSCHEMA_TABLES`;

        const result = await runXmla(dax, workspace, dataset);
        res.json({ success: true, tables: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 2. List columns
exports.getColumns = async (req, res) => {
    try {
        const { workspace, dataset } = req.body;
        const dax = `SELECT * FROM $SYSTEM.TMSCHEMA_COLUMNS`;

        const result = await runXmla(dax, workspace, dataset);
        res.json({ success: true, columns: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 3. List partitions
exports.getPartitions = async (req, res) => {
    try {
        const { workspace, dataset } = req.body;
        const dax = `SELECT * FROM $SYSTEM.TMSCHEMA_PARTITIONS`;

        const result = await runXmla(dax, workspace, dataset);
        res.json({ success: true, partitions: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 4. Full model metadata
exports.getModelInfo = async (req, res) => {
    try {
        const { workspace, dataset } = req.body;
        const dax = `SELECT * FROM $SYSTEM.TMSCHEMA_MODEL`;

        const result = await runXmla(dax, workspace, dataset);
        res.json({ success: true, model: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 5. List measures
exports.getMeasures = async (req, res) => {
    try {
        const { workspace, dataset } = req.body;
        const dax = `SELECT * FROM $SYSTEM.TMSCHEMA_MEASURES`;

        const result = await runXmla(dax, workspace, dataset);
        res.json({ success: true, measures: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 6. List relationships
exports.getRelationships = async (req, res) => {
    try {
        const { workspace, dataset } = req.body;
        const dax = `SELECT * FROM $SYSTEM.TMSCHEMA_RELATIONSHIPS`;

        const result = await runXmla(dax, workspace, dataset);
        res.json({ success: true, relationships: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 7. Run DAX
exports.runDax = async (req, res) => {
    try {
        const { dax, workspace, dataset } = req.body;

        const result = await runXmla(dax, workspace, dataset);
        res.json({ success: true, result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 8. Refresh entire dataset
exports.refreshDataset = async (req, res) => {
    try {
        const { workspace, dataset } = req.body;

        const xmla = `
        {
            "refresh": {
                "objects": [
                    { "database": "${dataset}" }
                ],
                "type": "full"
            }
        }`;

        const result = await runXmla(xmla, workspace, dataset);
        res.json({ success: true, result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 9. Refresh a specific table
exports.refreshTable = async (req, res) => {
    try {
        const { workspace, dataset, table } = req.body;

        const xmla = `
        {
            "refresh": {
                "objects": [
                    { "database": "${dataset}", "table": "${table}" }
                ],
                "type": "full"
            }
        }`;

        const result = await runXmla(xmla, workspace, dataset);
        res.json({ success: true, result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 10. Refresh a specific partition
exports.refreshPartition = async (req, res) => {
    try {
        const { workspace, dataset, table, partition } = req.body;

        const xmla = `
        {
            "refresh": {
                "objects": [
                    { "database": "${dataset}", "table": "${table}", "partition": "${partition}" }
                ],
                "type": "full"
            }
        }`;

        const result = await runXmla(xmla, workspace, dataset);
        res.json({ success: true, result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// 11. Preview tables 
exports.previewTable = async (req, res) => {
    try {
        const { workspace, dataset, table } = req.body;

        if (!table) {
            return res.status(400).json({
                success: false,
                error: "Missing 'table' parameter"
            });
        }

        const dax = `EVALUATE TOPN(100, '${table}')`;

        const result = await runXmla(dax, workspace, dataset);

        res.json({ success: true, preview: result });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
