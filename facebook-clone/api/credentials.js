// Global storage that persists across function calls
if (!global.credentials) {
    global.credentials = [];
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        // Return all credentials
        res.json({
            success: true,
            count: global.credentials.length,
            credentials: global.credentials
        });
    } else if (req.method === 'DELETE') {
        // Clear all credentials
        global.credentials = [];
        res.json({
            success: true,
            message: 'All credentials cleared'
        });
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}