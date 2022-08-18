/**
 * Registers on events of the map and view to keep the attributes up to date.
 */
export default {
    /**
     * Sets the map to the store. As a side-effect, map-related functions are registered
     * to fire changes when required. Each time a new map is registered, all old listeners
     * are discarded and new ones are registered.
     * @param {Object} param store context
     * @param {Object} param.dispatch the dispatch
     * @param {module:ol/Map} map map object
     * @returns {void}
     */
    async setMapAttributes ({dispatch}, {map}) {
        dispatch("registerListener", {type: "moveend", listener: "updateAttributes", listenerType: "dispatch"});

        // update state once initially to get initial settings
        dispatch("updateAttributes", {map: map});
    },

    /**
     * Updates map attributes.
     * @param {Object} param store context
     * @param {Object} param.commit the commit
     * @param {Object} param.getters the getters
     * @param {MapBrowserEvent} evt - Moveend event
     * @returns {Function} update function for state parts to update onmoveend
     */
    updateAttributes ({commit, getters}, evt) {
        let map;

        if (evt) {
            map = evt.map;
        }
        else {
            ({map} = getters);
        }

        const mapView = map.getView();

        commit("setBoundingBox", mapView.calculateExtent(map.getSize()));
    }

};
