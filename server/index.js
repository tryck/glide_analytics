require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Standardized DB Init
let pool;
async function initDb() {
    pool = await mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'glide_analytics',
        waitForConnections: true,
        connectionLimit: 10
    });
}
initDb().catch(err => console.error("Database Init Failed:", err));

// --- AUTH MIDDLEWARE ---
const checkAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader === 'Bearer session-master') {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized Operator' });
    }
};

// --- INFRASTRUCTURE API ---
app.use(['/api/clients', '/api/products', '/api/client-products', '/api/analysis'], checkAuth);
app.get('/api/client-products/:id/tables/:tableName', checkAuth);
app.get('/api/client-products/:id/logs', checkAuth);

// Clients
app.get('/api/clients', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM clients ORDER BY name');
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/clients', async (req, res) => {
    try {
        const [reslt] = await pool.execute('INSERT INTO clients (name) VALUES (?)', [req.body.name || null]);
        res.json({ id: reslt.insertId, ...req.body });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Servers
app.get('/api/servers', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM servers');
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Products
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM products');
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/products/:id', async (req, res) => {
    const { field_mapping, description } = req.body;
    try {
        await pool.execute(
            'UPDATE products SET field_mapping = ?, description = ? WHERE id = ?',
            [JSON.stringify(field_mapping || {}), description || '', req.params.id]
        );
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Client Product Bridges (System Bridges)
app.get('/api/client-products', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT cp.*, c.name as client_name, p.name as product_name 
            FROM client_product cp
            JOIN clients c ON cp.client_id = c.id
            JOIN products p ON cp.product_id = p.id
        `);
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/client-products', async (req, res) => {
    const { client_id, product_id, db_name, connection_string_name } = req.body;
    try {
        const [reslt] = await pool.execute(
            'INSERT INTO client_product (client_id, product_id, db_name, connection_string_name) VALUES (?, ?, ?, ?)',
            [client_id || null, product_id || null, db_name || null, connection_string_name || null]
        );
        res.json({ id: reslt.insertId, ...req.body });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/client-products/:id', async (req, res) => {
    try {
        await pool.execute('DELETE FROM client_product WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/client-products/:id', async (req, res) => {
    const { client_id, product_id, db_name, connection_string_name } = req.body;
    try {
        console.log("Updating Bridge ID:", req.params.id, "Body:", req.body);
        const values = [
            client_id || null, 
            product_id || null, 
            db_name || null, 
            connection_string_name || null, 
            req.params.id || null
        ];
        
        await pool.execute(
            'UPDATE client_product SET client_id = ?, product_id = ?, db_name = ?, connection_string_name = ? WHERE id = ?',
            values
        );
        res.json({ success: true });
    } catch (e) { 
        console.error("PUT /api/client-products/ Error:", e.message);
        res.status(500).json({ 
            error: e.message,
            tip: "Ensure all parameters are defined. Driver received: " + JSON.stringify(req.body)
        }); 
    }
});

app.get('/api/client-products/:id/logs', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT cp.*, p.field_mapping 
            FROM client_product cp
            JOIN products p ON cp.product_id = p.id
            WHERE cp.id = ?
        `, [req.params.id]);
        
        const bridge = rows[0];
        if (!bridge) return res.status(404).json({ error: 'Bridge not found' });

        const mapping = bridge.field_mapping || {};
        const TBL_LOGS = mapping.logs || 'audit_trail';

        let connConfig;
        if (bridge.connection_string_name && process.env[bridge.connection_string_name]) {
            connConfig = process.env[bridge.connection_string_name];
        } else {
            connConfig = {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: bridge.db_name,
                connectTimeout: 5000
            };
        }

        const conn = await mysql.createConnection(connConfig);
        const [logs] = await conn.execute(`SELECT * FROM ${TBL_LOGS} ORDER BY id DESC LIMIT 100`);
        await conn.end();
        res.json(logs);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/client-products/:id/tables/:tableName', async (req, res) => {
    try {
        const [rows] = await pool.execute(`SELECT cp.* FROM client_product cp WHERE id = ?`, [req.params.id]);
        const bridge = rows[0];
        if (!bridge) return res.status(404).json({ error: 'Bridge not found' });

        let connConfig;
        if (bridge.connection_string_name && process.env[bridge.connection_string_name]) {
            connConfig = process.env[bridge.connection_string_name];
        } else {
            connConfig = { host: process.env.DB_HOST, user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: bridge.db_name };
        }

        const conn = await mysql.createConnection(connConfig);
        const [data] = await conn.execute(`SELECT * FROM ${req.params.tableName} ORDER BY id DESC LIMIT 20`);
        await conn.end();
        res.json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// --- ANALYTICS ENGINE (Relational) ---

app.get('/api/analysis', async (req, res) => {
    try {
        const [bridges] = await pool.execute(`
            SELECT cp.*, c.name as client_name, p.name as product_name, p.field_mapping 
            FROM client_product cp
            JOIN clients c ON cp.client_id = c.id
            JOIN products p ON cp.product_id = p.id
        `);
        
        const results = await Promise.all(bridges.map(async (bridge) => {
            try {
                const mapping = bridge.field_mapping || {};
                const TBL_SETTINGS = mapping.settings || 'options';

                let connConfig;
                if (bridge.connection_string_name && process.env[bridge.connection_string_name]) {
                    connConfig = process.env[bridge.connection_string_name];
                } else {
                    connConfig = {
                        host: process.env.DB_HOST,
                        user: process.env.DB_USER,
                        password: process.env.DB_PASSWORD,
                        database: bridge.db_name,
                        connectTimeout: 5000
                    };
                }

                const conn = await mysql.createConnection(connConfig);
                
                const safeCount = async (tbl, where = null) => {
                    try { 
                        let query = `SELECT COUNT(*) as c FROM ${tbl}`;
                        if (where) query += ` WHERE ${where}`;
                        const [r] = await conn.execute(query); 
                        return r[0].c; 
                    } catch(e) { return null; }
                };

                const stats = {};
                const groups = mapping.tables || [];

                for (const g of groups) {
                    for (const m of g.metrics || []) {
                        stats[m.label] = (await safeCount(g.name, m.where)) ?? 0;
                    }
                }
                
                let lic = 'Active';
                try {
                    const [opt] = await conn.execute(`SELECT value FROM ${TBL_SETTINGS} WHERE name="system_locked" LIMIT 1`);
                    if (opt[0]?.value == 1) lic = 'Locked';
                } catch(e){}

                await conn.end();
                return {
                    ...bridge,
                    id: bridge.id,
                    name: `${bridge.client_name} - ${bridge.product_name}`,
                    status: 'Online',
                    stats: { ...stats, license: lic }
                };
            } catch (err) {
                return { 
                    ...bridge,
                    id: bridge.id,
                    name: `${bridge.client_name} - ${bridge.product_name}`,
                    status: 'Offline', 
                    error: err.message 
                };
            }
        }));

        res.json(results);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Login (Static)
app.post('/api/login', (req, res) => {
    if (req.body.username === process.env.ADMIN_USER && req.body.password === process.env.ADMIN_PASS) {
        res.json({ success: true, token: 'session-master' });
    } else { res.status(401).json({ success: false }); }
});

app.listen(port, () => console.log(`Infrastructure Control Center running on port ${port}`));
