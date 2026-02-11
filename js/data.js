/**
 * Data Manager
 * Handles data loading and management for the City Orientation VR
 */

class DataManager {
    constructor() {
        this.data = {};
        this.modelPath = 'assets/city.glb';
    }

    async loadData() {
        try {
            // Load configuration and data
            this.data = {
                title: 'City Orientation VR',
                description: 'An interactive VR experience for city navigation',
                version: '1.0.0'
            };
            return this.data;
        } catch (error) {
            console.error('Error loading data:', error);
            return null;
        }
    }

    getModelPath() {
        return this.modelPath;
    }

    getData() {
        return this.data;
    }

    saveLog(logData) {
        // Future: Save logs to exports/
        console.log('Log saved:', logData);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataManager;
}