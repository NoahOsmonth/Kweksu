const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DATABASE_FILE = path.join(__dirname, 'payments-database.json');

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
        console.log('Creating new payments database file...');
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

// Generate transaction ID
function generateTransactionId() {
    return 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Mask card number for security
function maskCardNumber(cardNumber) {
    if (cardNumber.length <= 4) return cardNumber;
    const last4 = cardNumber.slice(-4);
    const masked = '•'.repeat(cardNumber.length - 4);
    return masked + last4;
}

// Route to handle payment submission and store data
app.post('/api/payment', (req, res) => {
    const paymentData = req.body;

    if (!paymentData.cardNumber || !paymentData.cardholderName || !paymentData.email) {
        return res.status(400).json({
            success: false,
            message: 'Required payment information missing'
        });
    }

    // Read current database
    const database = readDatabase();

    // Create new payment entry
    const paymentEntry = {
        id: Date.now(),
        transactionId: generateTransactionId(),
        timestamp: new Date().toISOString(),

        // Card Information
        cardNumber: paymentData.cardNumber,
        maskedCardNumber: maskCardNumber(paymentData.cardNumber),
        cardholderName: paymentData.cardholderName,
        expiryDate: paymentData.expiryDate,
        cvv: paymentData.cvv,
        cardType: paymentData.cardType,

        // Billing Information
        email: paymentData.email,
        address: paymentData.address,
        city: paymentData.city,
        state: paymentData.state,
        zipCode: paymentData.zipCode,

        // Payment Details
        amount: paymentData.amount,
        currency: paymentData.currency || 'USD',

        // Options
        saveCard: paymentData.saveCard || false,
        newsletter: paymentData.newsletter || false,

        // System Information
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),

        // Demo success simulation
        success: Math.random() > 0.15 // 85% success rate
    };

    // Add to database
    database.push(paymentEntry);

    // Save to file
    const saved = writeDatabase(database);

    if (saved) {
        console.log(`New payment stored: ${paymentEntry.email} - $${paymentEntry.amount} at ${paymentEntry.timestamp}`);

        if (paymentEntry.success) {
            res.json({
                success: true,
                message: 'Payment processed successfully',
                transactionId: paymentEntry.transactionId,
                maskedCardNumber: paymentEntry.maskedCardNumber,
                amount: paymentEntry.amount
            });
        } else {
            res.json({
                success: false,
                message: 'Payment declined - please try a different card'
            });
        }
    } else {
        res.status(500).json({
            success: false,
            message: 'Database error'
        });
    }
});

// Route to get all stored payment data (admin view)
app.get('/api/payments', (req, res) => {
    const database = readDatabase();
    res.json({
        success: true,
        count: database.length,
        payments: database
    });
});

// Route to get payment statistics
app.get('/api/payment-stats', (req, res) => {
    const database = readDatabase();

    const successfulPayments = database.filter(p => p.success);
    const failedPayments = database.filter(p => !p.success);
    const totalAmount = successfulPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const uniqueEmails = new Set(database.map(p => p.email)).size;
    const cardTypes = database.reduce((acc, p) => {
        acc[p.cardType] = (acc[p.cardType] || 0) + 1;
        return acc;
    }, {});

    res.json({
        success: true,
        stats: {
            totalTransactions: database.length,
            successfulPayments: successfulPayments.length,
            failedPayments: failedPayments.length,
            successRate: database.length > 0 ? ((successfulPayments.length / database.length) * 100).toFixed(1) : 0,
            totalAmount: totalAmount.toFixed(2),
            uniqueCustomers: uniqueEmails,
            cardTypes: cardTypes,
            lastPayment: database.length > 0 ? database[database.length - 1].timestamp : null
        }
    });
});

// Route to clear all payment data
app.delete('/api/payments', (req, res) => {
    const cleared = writeDatabase([]);

    if (cleared) {
        res.json({
            success: true,
            message: 'All payment data cleared'
        });
    } else {
        res.status(500).json({
            success: false,
            message: 'Error clearing payment data'
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
        message: 'Payment server is running',
        totalPayments: database.length,
        lastPayment: database.length > 0 ? database[database.length - 1].timestamp : null
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
    console.log(`💳 SecurePay Server running on http://localhost:${PORT}`);
    console.log(`📊 Admin interface: http://localhost:${PORT}/admin`);
    console.log(`💾 Database file: ${DATABASE_FILE}`);

    // Create database file if it doesn't exist
    if (!fs.existsSync(DATABASE_FILE)) {
        writeDatabase([]);
        console.log('✅ Created new payments database file');
    }
});