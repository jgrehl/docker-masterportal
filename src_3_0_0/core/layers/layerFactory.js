import store from "../../app-store";
import layerCollection from "./layerCollection";
import Layer2dRasterStaticImage from "./layer2dRasterStaticImage";
import Layer2dRasterWms from "./layer2dRasterWms";
import Layer2dRasterWmts from "./layer2dRasterWmts";
import Layer2dVectorGeojson from "./layer2dVectorGeojson";
import Layer2dVectorOaf from "./layer2dVectorOaf";
import Layer2dVectorSensorThings from "./layer2dVectorSensorThings";
import Layer2dVectorTile from "./layer2dVectorTile";
import Layer2dVectorVectorbase from "./layer2dVectorVectorbase";
import Layer2dVectorWfs from "./layer2dVectorWfs";

const possibleLayerTypes = {
    GEOJSON: Layer2dVectorGeojson,
    OAF: Layer2dVectorOaf,
    SENSORTHINGS: Layer2dVectorSensorThings,
    STATICIMAGE: Layer2dRasterStaticImage,
    VECTORBASE: Layer2dVectorVectorbase,
    VECTORTILE: Layer2dVectorTile,
    WFS: Layer2dVectorWfs,
    WMS: Layer2dRasterWms,
    WMTS: Layer2dRasterWmts
};

/**
 * Starts the creation of the layer in the layer factory
 * and register watcher.
 * @param {Object} visibleLayerConfigs The layer configurations.
 * @returns {void}
 */
export default function initializeLayerFactory (visibleLayerConfigs) {
    processLayerConfig(visibleLayerConfigs);
    registerLayerConfig();
}

/**
 * Register to the layers in layerConfig.
 * @returns {void}
 */
function registerLayerConfig () {
    store.watch((state, getters) => getters.allLayerConfigs, layerConfig => {
        processLayerConfig(layerConfig);
    });
}

/**
 * Processes the layerConfig.
 * All existing layers will be updated.
 * Of the non-existing layers, only the visible ones are created and pushed into the LayerCollection.
 * @param {Object[]} layerConfig The layer configurations.
 * @returns {void}
 */
export function processLayerConfig (layerConfig) {
    layerConfig.forEach(layerConf => {
        let layer = layerCollection.getLayerById(layerConf.id);

        if (layer !== undefined) {
            updateLayerAttributes(layer, layerConf);
        }
        else if (layerConf.visibility === true && possibleLayerTypes[layerConf?.typ?.toUpperCase()] !== undefined) {
            layer = createLayer(layerConf);
            updateLayerConfig(layer);
            layerCollection.addLayer(layer);
            store.dispatch("Maps/addLayer", layer.getLayer());
        }
    });
}

/**
 * Creates layer instances.
 * @param {Object} layerConf The layer configuration.
 * @returns {Layer} The layer instance.
 */
export function createLayer (layerConf) {
    const typ = layerConf?.typ?.toUpperCase(),
        layer = new possibleLayerTypes[typ](layerConf);

    return layer;
}

/**
 * Update the layer attributes of the already extistering layer.
 * @param {Layer} layer Layer of the layer collection.
 * @param {Object} layerConf The layer config.
 * @returns {void}
 */
export function updateLayerAttributes (layer, layerConf) {
    Object.assign(layer.attributes, layerConf);
    layer.updateLayerValues(layer.attributes);
}

/**
 * Update the layer config in app-store.
 * @param {Layer} layer Layer of the layer collection.
 * @returns {void}
 */
function updateLayerConfig (layer) {
    store.commit("replaceByIdInLayerConfig", {
        layerConfigs: [{
            id: layer.get("id"),
            layer: layer.attributes
        }],
        trigger: false
    });
}

