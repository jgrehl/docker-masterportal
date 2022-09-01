import api from "@masterportal/masterportalapi/src/maps/api";
import {getLayerList} from "@masterportal/masterportalapi/src/rawLayerList";

import store from "../../app-store";

/**
 * Create the map in different modes (2D).
 * @param {Object} portalConfig The portalConfig.
 * @param {Object} configJs The config.js.
 * @returns {void}
 */
export function createMaps (portalConfig, configJs) {
    create2DMap(portalConfig.mapView, configJs);
    create3DMap(configJs);
}

/**
 * Create the 2D map and mapview.
 * @param {Object} mapViewSettings The mapViewSettings of config.json file.
 * @param {Object} configJs The config.js.
 * @returns {void}
 */
function create2DMap (mapViewSettings, configJs) {
    const map2d = api.map.createMap(
        {
            ...configJs,
            ...mapViewSettings,
            layerConf: getLayerList()
        }, "2D", {});

    mapCollection.addMap(map2d, "2D");
    store.dispatch("Maps/setMapAttributes", {map: map2d});
}

/**
 * Create the 3D map.
 * @param {Object} configJs The settings of config.json file.
 * @returns {void}
 */
function create3DMap (configJs) {
    if (Cesium) {
        const map3d = api.map.createMap({
            cesiumParameter: configJs?.cesiumParameter,
            map2D: mapCollection.getMap("2D")
        }, "3D");

        mapCollection.addMap(map3d, "3D");

        if (configJs.startingMap3D) {
            map3d.setEnabled(true);
        }
    }
}
