import { storage } from './storage.js';

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

    const payments = storage.getPayments();
    const successfulPayments = storage.getSuccessfulPayments();
    const failedPayments = storage.getFailedPayments();
    const totalAmount = successfulPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    const averageAmount = successfulPayments.length > 0 ?
        (totalAmount / successfulPayments.length).toFixed(2) : 0;

    // Get card type distribution
    const cardTypes = {};
    payments.forEach(p => {
        if (p.cardType) {
            cardTypes[p.cardType] = (cardTypes[p.cardType] || 0) + 1;
        }
    });

    // Get recent activity (last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentPayments = payments.filter(p => new Date(p.timestamp) > oneDayAgo);

    res.json({
        success: true,
        statistics: {
            totalPayments: payments.length,
            successfulPayments: successfulPayments.length,
            failedPayments: failedPayments.length,
            successRate: payments.length > 0 ?
                ((successfulPayments.length / payments.length) * 100).toFixed(1) + '%' : '0%',
            totalAmount: totalAmount.toFixed(2),
            averageAmount: averageAmount,
            cardTypes: cardTypes,
            recentActivity: recentPayments.length,
            lastPayment: payments.length > 0 ? payments[payments.length - 1].timestamp : null
        }
    });
}