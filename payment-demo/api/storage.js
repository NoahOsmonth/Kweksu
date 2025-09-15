// Shared storage utility for Vercel deployment
// This creates a simple in-memory storage that persists across function calls
// In production, you should use Vercel KV, Redis, or a database

let payments = [];

export const storage = {
    // Get all payments
    getPayments: () => {
        return payments;
    },

    // Add a new payment
    addPayment: (payment) => {
        payments.push(payment);
        return true;
    },

    // Clear all payments
    clearPayments: () => {
        payments = [];
        return true;
    },

    // Get payment count
    getCount: () => {
        return payments.length;
    },

    // Get last payment
    getLastPayment: () => {
        return payments.length > 0 ? payments[payments.length - 1] : null;
    },

    // Get successful payments
    getSuccessfulPayments: () => {
        return payments.filter(p => p.success);
    },

    // Get failed payments
    getFailedPayments: () => {
        return payments.filter(p => !p.success);
    }
};

export default storage;