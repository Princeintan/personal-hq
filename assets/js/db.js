/**
 * HQ Engine - IndexedDB Database Controller
 * Handles zero-latency, secure local data transactions.
 */

const DB_NAME = 'HQEngineDB';
const DB_VERSION = 1;
let dbInstance = null;

/**
 * Initializes and returns the local IndexedDB database instance
 */
function initDB() {
    return new Promise((resolve, reject) => {
        if (dbInstance) return resolve(dbInstance);

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        // Handles initial schema creation or version changes safely
        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            // 1. Financial Ledger Store
            if (!db.objectStoreNames.contains('ledger')) {
                const ledgerStore = db.createObjectStore('ledger', { keyPath: 'id', autoIncrement: true });
                ledgerStore.createIndex('by_date', 'date', { unique: false });
                ledgerStore.createIndex('by_type', 'type', { unique: false });
            }

            // 2. Client Leads & Billing Tracker
            if (!db.objectStoreNames.contains('leads')) {
                const leadsStore = db.createObjectStore('leads', { keyPath: 'id', autoIncrement: true });
                leadsStore.createIndex('by_status', 'status', { unique: false });
            }

            // 3. Productivity Tasks Tracker
            if (!db.objectStoreNames.contains('tasks')) {
                const tasksStore = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
                tasksStore.createIndex('by_progress', 'progress', { unique: false });
            }
        };

        request.onsuccess = (event) => {
            dbInstance = event.target.result;
            resolve(dbInstance);
        };

        request.onerror = (event) => {
            console.error('Database connection crash:', event.target.error);
            reject(event.target.error);
        };
    });
}

/**
 * Generic Helper to safely handle transaction states inside the stores
 */
async function getStore(storeName, mode = 'readonly') {
    const db = await initDB();
    const transaction = db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
}

/**
 * CORE DATA METHODS (CRUD API Interface)
 */
const DB = {
    // --- LEDGER METHODS ---
    async addTransaction(item) {
        // Expected item format: { type: 'income'|'expense', amount: 450, description: '...', date: '2026-05-24' }
        const store = await getStore('ledger', 'readwrite');
        return new Promise((res, rej) => {
            const req = store.add(item);
            req.onsuccess = () => res(req.result);
            req.onerror = () => rej(req.error);
        });
    },

    async getAllTransactions() {
        const store = await getStore('ledger', 'readonly');
        return new Promise((res, rej) => {
            const req = store.getAll();
            req.onsuccess = () => res(req.result);
            req.onerror = () => rej(req.error);
        });
    },

    async deleteTransaction(id) {
        const store = await getStore('ledger', 'readwrite');
        return new Promise((res, rej) => {
            const req = store.delete(id);
            req.onsuccess = () => res(true);
            req.onerror = () => rej(req.error);
        });
    },

    // --- LEADS METHODS ---
    async saveLead(lead) {
        // Expected format: { name: '...', value: 12000, status: 'negotiation'|'won'|'lost', contact: '...' }
        const store = await getStore('leads', 'readwrite');
        return new Promise((res, rej) => {
            const req = store.put(lead); // put acts as both insert and update
            req.onsuccess = () => res(req.result);
            req.onerror = () => rej(req.error);
        });
    },

    async getAllLeads() {
        const store = await getStore('leads', 'readonly');
        return new Promise((res, rej) => {
            const req = store.getAll();
            req.onsuccess = () => res(req.result);
            req.onerror = () => rej(req.error);
        });
    },

    // --- PRODUCTIVITY TASKS METHODS ---
    async saveTask(task) {
        // Expected format: { title: '...', progress: 'backlog'|'active'|'done', timestamp: Date.now() }
        const store = await getStore('tasks', 'readwrite');
        return new Promise((res, rej) => {
            const req = store.put(task);
            req.onsuccess = () => res(req.result);
            req.onerror = () => rej(req.error);
        });
    },

    async getAllTasks() {
        const store = await getStore('tasks', 'readonly');
        return new Promise((res, rej) => {
            const req = store.getAll();
            req.onsuccess = () => res(req.result);
            req.onerror = () => rej(req.error);
        });
    },

    async deleteTask(id) {
        const store = await getStore('tasks', 'readwrite');
        return new Promise((res, rej) => {
            const req = store.delete(id);
            req.onsuccess = () => res(true);
            req.onerror = () => rej(req.error);
        });
    }
};

// Expose globally so our frontend router can access methods
window.DB = DB;