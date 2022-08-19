import {getLayerWhere, getLayerList} from "@masterportal/masterportalapi/src/rawLayerList";
import omit from "../../utils/omit";
/**
 * Returns the extended raw layer to the id contained in the layer configuration.
 * If id contains an array of ids, the rawlayer is merged.
 * Grouped layers children are filled with the rawlayers.
 * @param {Object} layerConf configuration of layer like in the config.json
 * @returns {Object} the extended and merged raw layer
 */
export function getAndMergeRawLayer (layerConf) {
    return mergeRawLayer(layerConf, getLayerWhere({id: layerConf?.id}));
}

/**
 * Returns the extended raw layer to the id contained in the layer configuration.
 * If id contains an array of ids, the rawlayer is merged.
 * Grouped layers children are filled with the rawlayers.
 * @param {Object} layerConf configuration of layer like in the config.json
 * @param {Object} rawLayer raw layer from services.json
 * @returns {Object} the extended and merged raw layer
 */
function mergeRawLayer (layerConf, rawLayer) {
    let mergedLayer;

    if (layerConf) {
        if (Array.isArray(layerConf.id)) {
            mergedLayer = mergeLayerByIds(layerConf);
        }
        else if (layerConf.children) {
            mergedLayer = fillGroupLayer(layerConf);
        }
        else if (rawLayer === undefined || rawLayer === null) {
            console.warn("Configured layer ", layerConf, " not found in services.json!");
        }
        else {
            mergedLayer = Object.assign(rawLayer, layerConf);
        }
    }
    return mergedLayer;
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
                return Object.assign(objFromRawList, childLayer);
            }
            return undefined;
        });

        rawLayer.children = rawLayer.children.filter(function (childLayer) {
            return childLayer !== undefined;
        });

        if (rawLayer.children.length > 0) {
            rawLayer = Object.assign(rawLayer, {typ: "GROUP"});
        }
        return rawLayer;
    }
    return undefined;
}

/**
 * Merges layer configuration with ids property of type array.
 * @param {Object} layerConf configuartion of layer like in the config.json with ids in an array
 * @returns {Object} the merged raw layer
 */
function mergeLayerByIds (layerConf) {
    // refactored from parser.js, mergeexistingLayers and parserCustomTree.js, parseTree
    const ids = layerConf.id,
        existingLayers = [],
        maxScales = [],
        minScales = [],
        layerlist = getLayerList();
    let mergedLayer = {};

    ids?.forEach(id => {
        const layer = layerlist.find(aLayer => aLayer.id === id);

        if (layer) {
            existingLayers.push(layer);
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
    existingLayers.forEach(object => {
        maxScales.push(parseInt(object.maxScale, 10));
        minScales.push(parseInt(object.minScale, 10));
    });
    mergedLayer.maxScale = Math.max(...maxScales);
    mergedLayer.minScale = Math.min(...minScales);
    // sets all attributes from config at merged layer besides id-array
    mergedLayer = Object.assign(mergedLayer, omit(layerConf, ["id"], false));

    return mergedLayer;
}

/**
 * Returns all layer to add to states layerConfig 'Fachdaten' for treetype 'default'.
 * Filters the raw layerlist by typ and datasets.
 * Creates new raw layer if datasets contains more than one entry.
 * @param {Array} validLayerTypes layer types to be used with the tree.type "default". If not configured,  ["WMS", "SENSORTHINGS", "TERRAIN3D", "TILESET3D", "OBLIQUE"] are used
 * @returns {Array} the filtered layer configurations
 */
export function getAndMergeRawLayersFilteredByMdId (validLayerTypes) {
    // refactored from parserDefaultTree.js
    const layerList = getLayerList(),
        rawLayers = [],
        layerTypes = validLayerTypes ? validLayerTypes : ["WMS", "SENSORTHINGS", "TERRAIN3D", "TILESET3D", "OBLIQUE"];
    let relatedWMSLayerIds = [];

    for (let i = 0; i < layerList.length; i++) {
        const rawLayer = layerList[i];

        if (!layerTypes.includes(rawLayer.typ?.toUpperCase()) || !rawLayer.datasets || rawLayer.datasets.length === 0) {
            continue;
        }
        if (rawLayer.typ.toUpperCase() === "SENSORTHINGS" && rawLayer.related_wms_layers !== undefined) {
            relatedWMSLayerIds = relatedWMSLayerIds.concat(rawLayer.related_wms_layers);
        }
        if (rawLayer.datasets.length > 1) {
            rawLayer.datasets.forEach((ds, index) => {
                const newLayer = {...rawLayer};

                newLayer.id = rawLayer.id + "_" + index;
                newLayer.datasets = [ds];
                rawLayers.push(newLayer);
            });
        }
        else {
            rawLayers.push(rawLayer);
        }
    }
    removeFromLayerList(relatedWMSLayerIds, rawLayers);
    return rawLayers;
}

/**
 * Removes the layers with the given ids from rawLayers.
 * @param  {Object[]} [ids=[]] containing the ids of all layers to remove
 * @param  {Object[]} [layerList=[]] The layers from services.json
 * @returns {Object[]} LayerList without layers with the given ids
 */
function removeFromLayerList (ids = [], layerList = []) {
    ids.forEach(id => {
        const index = layerList.findIndex((layer) => layer.id === id);

        if (index > -1) {
            layerList.splice(index, 1);
        }
    });
}
