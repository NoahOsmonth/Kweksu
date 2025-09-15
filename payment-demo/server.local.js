// Local-only Express server for development. Not used on Vercel.
// Run with: npm run dev

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATABASE_FILE = path.join(__dirname, 'payments-database.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

function readDatabase() {
    try {
        const data = fs.readFileSync(DATABASE_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function writeDatabase(data) {
    try {
        fs.writeFileSync(DATABASE_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        return false;
    }
}

app.get('/api/status', (req, res) => {
    const db = readDatabase();
    res.json({ success: true, totalPayments: db.length });
});

app.listen(PORT, () => {
    console.log(`Local payment server running at http://localhost:${PORT}`);
});
