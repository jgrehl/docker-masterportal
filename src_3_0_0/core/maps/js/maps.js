import api from "@masterportal/masterportalapi/src/maps/api";
import {getLayerList} from "@masterportal/masterportalapi/src/rawLayerList";
import {load3DScript} from "@masterportal/masterportalapi/src/lib/load3DScript";

import {setResolutions, setValues} from "./setValuesToMapView";
import store from "../../../app-store";

/**
 * Create the map in different modes and update the map attributes.
 * @param {Object} portalConfig The portalConfig.
 * @param {Object} configJs The config.js.
 * @returns {void}
 */
function initializeMaps (portalConfig, configJs) {
    create2DMap(portalConfig.mapView, configJs);
    store.dispatch("Maps/setMapAttributes");
    watchPortalConfig();
    load3DMap(configJs);
}

/**
 * Create the 2D map with mapview.
 * @param {Object} mapViewSettings The mapViewSettings of config.json file.
 * @param {Object} configJs The config.js.
 * @returns {void}
 */
function create2DMap (mapViewSettings, configJs) {
    const map2d = api.map.createMap({
        ...configJs,
        ...mapViewSettings,
        layerConf: getLayerList()
    }, "2D", {});

    mapCollection.addMap(map2d, "2D");
}

/**
 * Watches the portalConfig.mapViewSettings
 * Sets the changed attributes.
 * @returns {void}
 */
function watchPortalConfig () {
    store.watch((state, getters) => getters.mapViewSettings, mapViewSettings => {
        const view = mapCollection.getMapView("2D"),
            resolutions = mapViewSettings?.options?.map(entry => entry.resolution);

        setResolutions(view, resolutions);
        setValues(view, mapViewSettings);
    });
}

/**
 * Loads Cesium and the start creating the 3D map.
 * @param {Object} configJs The config.js.
 * @returns {void}
 */
function load3DMap (configJs) {
    load3DScript(store.getters.cesiumLibrary, () => {
        create3DMap(configJs);
        store.dispatch("Maps/registerCesiumListener");

        if (configJs.startingMap3D) {
            store.dispatch("Maps/activateMap3d", "3D");
        }
    });
}

/**
 * Create the 3D map.
 * @param {Object} configJs The settings of config.json file.
 * @returns {void}
 */
function create3DMap (configJs) {
    const map3d = api.map.createMap({
        cesiumParameter: configJs?.cesiumParameter,
        map2D: mapCollection.getMap("2D")
    }, "3D");

    mapCollection.addMap(map3d, "3D");
}

module.exports = {
    create3DMap,
    initializeMaps,
    load3DMap
};
