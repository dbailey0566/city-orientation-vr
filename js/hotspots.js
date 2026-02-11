/**
 * Hotspots Manager
 * Manages interactive hotspots in the City Orientation VR scene
 */

class HotspotsManager {
    constructor(scene) {
        this.scene = scene;
        this.hotspots = [];
    }

    addHotspot(position, label, callback) {
        const hotspot = {
            position: position,
            label: label,
            callback: callback
        };
        this.hotspots.push(hotspot);
        return hotspot;
    }

    removeHotspot(hotspot) {
        const index = this.hotspots.indexOf(hotspot);
        if (index > -1) {
            this.hotspots.splice(index, 1);
        }
    }

    getHotspots() {
        return this.hotspots;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HotspotsManager;
}