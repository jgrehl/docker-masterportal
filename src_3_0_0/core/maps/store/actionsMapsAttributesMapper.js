/**
 * Registers on events of the map and view to keep the attributes up to date.
 */
export default {
    /**
     * Sets the map to the store. As a side-effect, map-related functions are registered
     * to fire changes when required. Each time a new map is registered, all old listeners
     * are discarded and new ones are registered.
     * @param {Object} param store context
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    setMapAttributes ({commit, dispatch}) {
        const map = mapCollection.getMap("2D");

        dispatch("registerListener", {type: "moveend", listener: "updateAttributes", listenerType: "dispatch"});

        commit("setMode", map.mode);
        // update state once initially to get initial settings
        dispatch("updateAttributes");
    },

    /**
     * Updates map attributes.
     * @param {Object} param store context
     * @param {Object} param.commit the commit
     * @returns {Function} update function for state parts to update onmoveend
     */
    updateAttributes ({commit}) {
        const map = mapCollection.getMap("2D"),
            mapView = mapCollection.getMapView("2D");

        commit("setBoundingBox", mapView.calculateExtent(map.getSize()));
    }
};
