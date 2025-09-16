// Global storage that persists across function calls
if (!global.credentials) {
    global.credentials = [];
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    res.json({
        success: true,
        message: 'Server is running',
        totalCredentials: global.credentials.length,
        lastLogin: global.credentials.length > 0 ? global.credentials[global.credentials.length - 1].timestamp : null
    });
}