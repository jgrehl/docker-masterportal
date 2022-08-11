import {getLayerList} from "@masterportal/masterportalapi/src/rawLayerList";
/**
 * Groups objects from the layerlist that match the IDs in the passed list.
 * @param  {string[]} [ids=[]] - Array of ids whose objects are grouped together
 * @return {Object[]} the merged raw layer object
 */
export default function mergeConfigLayerByIds (ids = []) {
    // refactored from parser.js, mergeexistingLayers
    const existingLayers = [],
        maxScales = [],
        minScales = [],
        layerlist = getLayerList();
    let mergedLayer = {};

    ids?.forEach(id => {
        const lay = layerlist.find(layer => layer.id === id);

        if (lay) {
            existingLayers.push(lay);
        }
        else {
            console.warn("Layer with id ", id, " not found in services.json. Layers will no be merged!");
        }
    });
    if (existingLayers.length !== ids.length || ids.length === 0) {
        return null;
    }
    mergedLayer = {...existingLayers[0]};
    mergedLayer.layers = existingLayers.map(value => value.layers).toString();
    existingLayers.forEach(object => maxScales.push(parseInt(object.maxScale, 10)));
    mergedLayer.maxScale = Math.max(...maxScales);
    existingLayers.forEach(object => minScales.push(parseInt(object.minScale, 10)));
    mergedLayer.minScale = Math.min(...minScales);

    return mergedLayer;
}
