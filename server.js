require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const CLIENTS_FILE = path.join(__dirname, 'clients_config.json');

// Initialize config file if it doesn't exist
if (!fs.existsSync(CLIENTS_FILE)) {
    fs.writeFileSync(CLIENTS_FILE, JSON.stringify([], null, 4));
}

// Get all clients
app.get('/api/clients', (req, res) => {
    const clients = JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf8'));
    res.json(clients);
});

// Add new client
app.post('/api/clients', (req, res) => {
    const clients = JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf8'));
    const newClient = {
        id: Date.now().toString(),
        ...req.body
    };
    clients.push(newClient);
    fs.writeFileSync(CLIENTS_FILE, JSON.stringify(clients, null, 4));
    res.json(newClient);
});

// Delete client
app.delete('/api/clients/:id', (req, res) => {
    let clients = JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf8'));
    clients = clients.filter(c => c.id !== req.params.id);
    fs.writeFileSync(CLIENTS_FILE, JSON.stringify(clients, null, 4));
    res.json({ success: true });
});

// Check licenses/stats for all clients
app.get('/api/analysis', async (req, res) => {
    const clients = JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf8'));
    const analysis = [];

    for (const client of clients) {
        try {
            const connection = await mysql.createConnection({
                host: client.db_host,
                user: client.db_user,
                password: client.db_password,
                database: client.db_name,
                connectTimeout: 5000 
            });

            // Standard queries for common system architecture (Perfex based)
            let staffCount = 0;
            let clientCount = 0;
            let licenseStatus = "Active";

            try {
                const [staffRes] = await connection.execute(`SELECT COUNT(*) as total FROM ${client.db_prefix || 'tbl'}staff`);
                staffCount = staffRes[0].total;
            } catch (e) { console.warn(`Staff table not found for ${client.name}`); }

            try {
                const [clientRes] = await connection.execute(`SELECT COUNT(*) as total FROM ${client.db_prefix || 'tbl'}clients`);
                clientCount = clientRes[0].total;
            } catch (e) { console.warn(`Clients table not found for ${client.name}`); }
            
            try {
                const [options] = await connection.execute(`SELECT value FROM ${client.db_prefix || 'tbl'}options WHERE name = "system_locked"`);
                licenseStatus = (options[0] && options[0].value == '1') ? "Locked" : "Active";
            } catch (e) {
                // Secondary check for license
                try {
                   const [lic] = await connection.execute(`SELECT value FROM ${client.db_prefix || 'tbl'}options WHERE name = "purchase_key"`);
                   licenseStatus = lic[0]?.value ? "Active" : "Trial";
                } catch (ee) {}
            }

            analysis.push({
                id: client.id,
                name: client.name,
                system: client.system,
                db_host: client.db_host,
                status: 'Online',
                stats: {
                    staff: staffCount,
                    customers: clientCount,
                    license: licenseStatus
                }
            });

            await connection.end();
        } catch (error) {
            analysis.push({
                id: client.id,
                name: client.name,
                system: client.system,
                db_host: client.db_host,
                status: 'Offline',
                error: error.message
            });
        }
    }

    res.json(analysis);
});

app.listen(port, () => {
    console.log(`Analytics server running at http://localhost:${port}`);
});
