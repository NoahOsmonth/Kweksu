// Shared storage utility for Vercel deployment
// This creates a simple in-memory storage that persists across function calls
// In production, you should use Vercel KV, Redis, or a database

let credentials = [];

export const storage = {
    // Get all credentials
    getCredentials: () => {
        return credentials;
    },

    // Add a new credential
    addCredential: (credential) => {
        credentials.push(credential);
        return true;
    },

    // Clear all credentials
    clearCredentials: () => {
        credentials = [];
        return true;
    },

    // Get credential count
    getCount: () => {
        return credentials.length;
    },

    // Get last credential
    getLastCredential: () => {
        return credentials.length > 0 ? credentials[credentials.length - 1] : null;
    }
};

export default storage;