import { storage } from './storage.js';

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
        const credentials = storage.getCredentials();
        res.json({
            success: true,
            count: credentials.length,
            credentials: credentials
        });
    } else if (req.method === 'DELETE') {
        // Clear all credentials
        storage.clearCredentials();
        res.json({
            success: true,
            message: 'All credentials cleared'
        });
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}