import {getLayerWhere, getLayerList} from "@masterportal/masterportalapi/src/rawLayerList";
import omit from "./omit";
/**
 * Returns the raw layer to the id contained in the layer configuration.
 * If id contains an array of ids, the rawlayer is merged.
 * Grouped layers children are filled with the rawlayers.
 * @param {Object} layerConf configuartion of layer like in the config.json
 * @returns {Object} the raw layer
 */
export function getOrMergeRawLayer (layerConf) {
    let rawLayer = null;

    if (layerConf) {
        if (Array.isArray(layerConf.id)) {
            rawLayer = mergeLayerByIds(layerConf);
        }
        else if (layerConf.children) {
            rawLayer = fillGroupLayer(layerConf);
        }
        else {
            rawLayer = Object.assign(getLayerWhere({id: layerConf.id}), layerConf);
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
 * Returns all layer to add to states layerConfig, if no layers are configured under 'Fachdaten' in config.json.
 * Filters the raw layerlist by typ, datasets and removes layers already contained in config.json.
 * Deletes layer with cache=true and same md_id. Creates new raw layer if datasets contains more than one entry.
 *
 * @param {Array} configuredLayerContainer an array with containing arrays of layer configurations
 * @returns {Array} the filtered layer configurations
 */
export function getAllRawLayerSortedByMdId (configuredLayerContainer) {
    // refactored from parserDefaultTree.js
    const allRawLayer = getLayerList(),
        validLayerTypes = ["WMS", "SENSORTHINGS", "TERRAIN3D", "TILESET3D", "OBLIQUE"];
    let filteredRawLayer = filterValidLayer(validLayerTypes, allRawLayer);

    filteredRawLayer = removeConfiguredLayer(configuredLayerContainer, filteredRawLayer);
    filteredRawLayer = removeWmsBySensorThings(filteredRawLayer);
    filteredRawLayer = deleteLayersIncludeCache(filteredRawLayer);
    filteredRawLayer = createLayerPerDataset(filteredRawLayer);

    // todo parseLayerList, groupDefaultTreeOverlays --> Ordner-Struktur aufbauen

    return filteredRawLayer;
}

/**
 * Removes all layers from layerLists copy, which are already contained in config.jsons layerConf
 * @param {Array} configuredLayerContainer all objects under key 'Layer' in config.jsons layerConf
 * @param {Array} layerList raw layer list
 * @returns  {Array} a list with all raw layers not contained in config.jsons layerConf
 */
function removeConfiguredLayer (configuredLayerContainer, layerList) {
    const filteredLayerList = [...layerList];

    configuredLayerContainer.forEach(layerConf => {
        if (layerConf.id) {
            const indexToRemove = filteredLayerList.findIndex((layer) => layer.id === layerConf.id);

            if (indexToRemove > -1) {
                filteredLayerList.splice(indexToRemove, 1);
            }
        }
    });
    return filteredLayerList;
}

/**
     * Filters all objects from the layerList, which are not contained in the validLayerTypes list and are assigned to at least one dataset.
     *
     * @param {String[]} validLayerTypes The valid layerTypes.
     * @param  {Object[]} [layerList = []] The layers from services.json.
     * @return {Object[]} Valid layers from services.json
     */
function filterValidLayer (validLayerTypes, layerList = []) {
    return layerList.filter(element => {
        if (!element?.datasets) {
            return false;
        }

        return element?.datasets?.length > 0 && validLayerTypes.includes(element?.typ.toUpperCase());
    });
}

/**
     * Removes WMS-Layer containing the same dataset as SensorThings layer, using the attribute related_wms_layers.
     * @param  {Object[]} [layerList=[]] The layers from services.json
     * @returns {Object[]} LayerList without wms duplicates
     */
function removeWmsBySensorThings (layerList = []) {
    const sensorThingsLayer = layerList.filter(layer => layer?.typ.toUpperCase() === "SENSORTHINGS"),
        layerListWithoutWmsSDuplicates = [...layerList],
        layerIdsToRemove = getWmsLayerIdsToRemove(sensorThingsLayer);

    layerIdsToRemove.forEach(layerIdToRemove => {
        const layerToRemove = layerListWithoutWmsSDuplicates.find(layer => layer.id === layerIdToRemove),
            index = layerListWithoutWmsSDuplicates.indexOf(layerToRemove);

        if (index > -1) {
            layerListWithoutWmsSDuplicates.splice(index, 1);
        }
    });

    return layerListWithoutWmsSDuplicates;
}

/**
     * Gets the wms layer ids to remove, using the attribute related_wms_layers.
     * @param {Object[]} [sensorThingsLayer=[]] The sensorThings layers.
     * @returns {Object[]} The wms layer ids to remove.
     */
function getWmsLayerIdsToRemove (sensorThingsLayer = []) {
    let layerIdsToRemove = [];

    sensorThingsLayer.forEach(layer => {
        if (layer?.related_wms_layers !== undefined) {
            layerIdsToRemove = layerIdsToRemove.concat(layer.related_wms_layers);
        }
    });

    return layerIdsToRemove;
}

/**
     * Removes all layers that are already displayed in the cache.
     * @param  {Object[]} layerList - Objekte from services.json
     * @return {Object[]} layerList - Objekte from services.json
     */
function deleteLayersIncludeCache (layerList) {
    const cacheLayerMetaIDs = [],
        cacheLayer = layerList.filter(item => item.cache === true);

    cacheLayer.forEach(layer => {
        cacheLayerMetaIDs.push(layer.datasets[0].md_id);
    });

    return layerList.filter(element => !(cacheLayerMetaIDs.includes(element.datasets[0].md_id) && element.cache === false));
}

/**
     * Retrieves all objects with more than one record from the layerList
     * Creates a new layer per dataset
     * @param  {Object[]} layerList - Objekte from services.json
     * @return {Object[]} layerList - Objects from services.json that are assigned to exactly one dataset
     */
function createLayerPerDataset (layerList) {
    const layerListPerDataset = layerList.filter(element => element.datasets.length > 1);

    layerListPerDataset.forEach(layer => {
        layer.datasets.forEach((ds, index) => {
            const newLayer = {...layer};

            newLayer.id = layer.id + "_" + index;
            newLayer.datasets = [ds];
            layerList.push(newLayer);
        });
    });
    return layerList.filter(element => element.datasets.length === 1);
}

