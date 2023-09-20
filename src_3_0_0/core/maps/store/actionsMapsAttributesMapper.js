import findWhereJs from "../../../utils/findWhereJs";

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
     * @returns {void}
     */
    setMapAttributes ({dispatch}) {
        dispatch("registerMapListener");
        dispatch("setInitialAttributes");
        dispatch("updateAttributesByMoveend");
        dispatch("updateAttributesByChangeResolution");
    },

    /**
     * Register map and view listener.
     * @param {Object} param store context
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    registerMapListener ({dispatch}) {
        const mapView = mapCollection.getMapView("2D");

        dispatch("registerListener", {
            type: "moveend",
            listener: "updateAttributesByMoveend",
            listenerType: "dispatch"
        });

        mapView.on("change:resolution", () => {
            dispatch("updateAttributesByChangeResolution");
        });
    },

    /**
     * Sets initial map and view attributes.
     * @param {Object} param store context
     * @param {Object} param.commit the commit
     * @returns {void}
     */
    setInitialAttributes ({commit}) {
        const map = mapCollection.getMap("2D"),
            mapView = mapCollection.getMapView("2D");

        commit("setInitialCenter", mapView.getCenter());
        commit("setInitialRotation", mapView.getRotation());
        commit("setInitialZoom", mapView.getZoom());
        commit("setMode", map.mode);
    },

    /**
     * Updates map attributes by moveend.
     * @param {Object} param store context
     * @param {Object} param.commit the commit
     * @returns {Function} update function for state parts to update onmoveend
     */
    updateAttributesByMoveend ({commit}) {
        const map = mapCollection.getMap("2D"),
            mapView = mapCollection.getMapView("2D");

        commit("setBoundingBox", mapView.calculateExtent(map.getSize()));
        commit("setCenter", mapView.getCenter());
    },

    /**
     * Updates map attributes by change resolution.
     * @param {Object} param store context
     * @param {Object} param.commit the commit
     * @returns {void}
     */
    updateAttributesByChangeResolution ({commit}) {
        const mapView = mapCollection.getMapView("2D"),
            options = findWhereJs(mapView.get("options"), {
                resolution: mapView.getConstrainedResolution(mapView.getResolution())
            });

        commit("setMaxZoom", mapView.getMaxZoom());
        commit("setMinZoom", mapView.getMinZoom());
        commit("setResolution", mapView.getResolution());
        commit("setScale", options.scale);
        commit("setZoom", mapView.getZoom());
    }
};
