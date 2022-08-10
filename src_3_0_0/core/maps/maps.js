import api from "@masterportal/masterportalapi/src/maps/api";
import {getLayerList} from "@masterportal/masterportalapi/src/rawLayerList";

/**
 * Create the 2D map and mapview.
 * @param {Object} mapViewSettings The mapViewSettings of config.json file.
 * @param {Object} configJs The config.js.
 * @returns {void}
 */
function create2DMap (mapViewSettings, configJs) {
    const map = api.map.createMap(
        {
            ...configJs,
            ...mapViewSettings,
            layerConf: getLayerList()
        }, "2D", {});

    mapCollection.addMap(map, "2D");
}

/**
 * Create the map in different modes (2D).
 * @param {Object} portalConfig The portalConfig.
 * @param {Object} configJs The config.js.
 * @returns {void}
 */
export function createMaps (portalConfig, configJs) {
    create2DMap(portalConfig.mapView, configJs);
}
