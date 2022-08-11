import {getLayerWhere, getLayerList} from "@masterportal/masterportalapi/src/rawLayerList";
import omit from "./omit";
/**
 * Returns the raw layer to the id contained in the layer configuration.
 * If id contains an array of ids, the rawlayer is merged.
 * Grouped layers children are filled with the rawlayers.
 * @param {Object} layerConf configuartion of layer like in the config.json
 * @returns {Object} the raw layer
 */
export default function getOrMergeRawLayer (layerConf) {
    let rawLayer = null;

    if (layerConf) {
        if (Array.isArray(layerConf.id)) {
            rawLayer = mergeLayerByIds(layerConf.id);
        }
        else if (layerConf.children) {
            rawLayer = fillGroupLayer(layerConf);
        }
        else {
            rawLayer = getLayerWhere({id: layerConf.id});
        }
    }
    return rawLayer;
}

/**
 * Fill the grouped layer configuration.
 * @param {Object} layerConf configuartion of layer like in the config.json
 * @returns {Object} the grouped layers children are filled with the rawlayers.
 */
function fillGroupLayer (layerConf) {
    // refactored from parserCustomTree.js, parseTree
    let rawLayer = {...layerConf};

    if (rawLayer?.children && typeof rawLayer.id === "string") {
        rawLayer.children = rawLayer.children.map(childLayer => {
            let objFromRawList = null;

            if (childLayer.styles && childLayer.styles[0]) {
                objFromRawList = getLayerWhere({id: childLayer.id + childLayer.styles[0]});
            }
            if (objFromRawList === null || objFromRawList === undefined) {
                objFromRawList = getLayerWhere({id: childLayer.id});
            }
            if (objFromRawList !== null && objFromRawList !== undefined) {
                return Object.assign(objFromRawList, childLayer, {"isChildLayer": true});
            }
            console.error("A layer of the group \"" + rawLayer.name + "\" with id: " + childLayer.id + " was not created. Id not contained in services.json.");
            return undefined;
        });

        rawLayer.children = rawLayer.children.filter(function (childLayer) {
            return childLayer !== undefined;
        });

        if (rawLayer.children.length > 0) {
            rawLayer = Object.assign(rawLayer, {typ: "GROUP", isChildLayer: false});
        }
        return rawLayer;
    }
    return undefined;
}

/**
 * Merges layer configuration with ids property of type array.
 * @param {Array} ids of layers configurations to merge.
 * @returns {Object} the merged raw layer
 */
function mergeLayerByIds (ids = []) {
    // refactored from parser.js, mergeexistingLayers and parserCustomTree.js, parseTree
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
        return undefined;
    }
    mergedLayer = {...existingLayers[0]};
    mergedLayer.layers = existingLayers.map(value => value.layers).toString();
    existingLayers.forEach(object => maxScales.push(parseInt(object.maxScale, 10)));
    mergedLayer.maxScale = Math.max(...maxScales);
    existingLayers.forEach(object => minScales.push(parseInt(object.minScale, 10)));
    mergedLayer.minScale = Math.min(...minScales);
    mergedLayer = Object.assign(mergedLayer, omit(mergedLayer, ["id"], false), {"isChildLayer": false});

    return mergedLayer;
}

