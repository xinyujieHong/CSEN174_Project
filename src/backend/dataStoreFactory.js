/**
 * Data Store Factory
 * 
 * Creates and returns the appropriate data store instance based on configuration.
 */

import dotenv from 'dotenv';
import { MemoryDataStore } from './dataStore.memory.js';
import { MySQLDataStore } from './dataStore.mysql.js';

dotenv.config();

class DataStoreFactory {
    constructor() {
        this.instance = null;
    }

    /**
     * Get the singleton data store instance
     * @returns {MemoryDataStore|MySQLDataStore} The data store instance
     */
    getDataStore() {
        if (this.instance) {
            return this.instance;
        }

        const mode = process.env.STORAGE_MODE || 'memory';

        console.log(`Initializing DataStore in '${mode}' mode...`);

        if (mode === 'mysql') {
            this.instance = new MySQLDataStore();
        } else {
            this.instance = new MemoryDataStore();
        }

        return this.instance;
    }
}

// Export a singleton factory instance
const factory = new DataStoreFactory();
export default factory;
