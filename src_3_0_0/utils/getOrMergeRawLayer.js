import {mergeConfigLayerByIds} from "./mergeConfigLayerByIds";
import {getLayerWhere} from "@masterportal/masterportalapi/src/rawLayerList";
/**
 * Returns the raw layer with the id of the layer configuration.
 * If id contains an array of ids, the rawlayer is merged.
 * Grouped layers are...
 * @param {Object} layerConf configuartion of layer like in the config.json
 * @returns {Object} the raw layer
 */
export default function getOrMergeRawLayer (layerConf) {
    let rawLayer = null;

    if (layerConf) {
        if (Array.isArray(layerConf.id)) {
            rawLayer = mergeConfigLayerByIds(layerConf.id);
        }
        else if (layerConf.children) {
            // todo group layer
        }
        else {
            rawLayer = getLayerWhere({id: layerConf.id});
        }
    }
    return rawLayer;
}
