import {getLayerList} from "@masterportal/masterportalapi/src/rawLayerList";
import getNestedValues from "../../utils/getNestedValues";

/**
 * Returns all layer from services.json to add to states layerConfig for treetype 'auto', besides background-layers.
 * The layers are sorted and grouped by metadata-name.
 * @param  {Object} layerConfig configuration of layer like in the config.json, to get background-layer from
 * @param  {String} category the category to get the tree for
 * @returns {Object} tree structure as json object
 */
export function buildTreeStructure (layerConfig, category) {
    // refactored from parserDefaultTree.js
    //
    // dort wird an allen Objekten, die keine id haben, eine id gesetzt: id: this.createUniqId(groupname)
    // brauchen wir das auch?
    const keyFolder = "Ordner",
        keyTitle = "Titel",
        keyLayer = "Layer",
        layerList = getLayerList(),
        bgLayers = getNestedValues(layerConfig?.Hintergrundkarten, keyLayer).flat(Infinity),
        categoryKey = category?.key,
        groups = {},
        folder = {},
        layersByMdName = {},
        bgLayerIds = getIdsOfLayers(bgLayers);

    if (!category) {
        return layerList;
    }
    folder[keyFolder] = [];

    for (let i = 0; i < layerList.length; i++) {
        const rawLayer = layerList[i],
            subToAdd = {};
        let subFolder;

        if (bgLayerIds.indexOf(rawLayer.id) > -1) {
            continue;
        }
        if (rawLayer.datasets[0] && rawLayer.datasets[0][categoryKey]) {
            const mdName = rawLayer.datasets[0].md_name,
                groupName = getCategoryName(rawLayer, categoryKey),
                isFirstLayer = checkIsFirstLayer(layersByMdName, rawLayer);

            if (!Object.keys(groups).find((key) => key === groupName)) {
                const toAdd = {};

                toAdd[keyFolder] = [];
                toAdd[keyTitle] = groupName;
                folder[keyFolder].push(toAdd);
                folder[keyFolder] = sortByKey(folder[keyFolder], keyTitle);
                groups[groupName] = {};
            }
            subFolder = folder[keyFolder].find((obj) => obj[keyTitle] === groupName);

            if (!Object.keys(groups[groupName]).find((key) => key === mdName)) {
                groups[groupName][mdName] = [];
                if (isFirstLayer) {
                    appendArray(subFolder, keyLayer);
                    // subFolder[keyLayer].push({id:rawLayer.id, name:mdName});
                    subFolder[keyLayer].push(Object.assign({}, rawLayer, {name: mdName}));
                    subFolder[keyLayer] = sortByKey(subFolder[keyLayer], "name");
                }
                else {
                    subToAdd[keyLayer] = groups[groupName][mdName];
                    subToAdd[keyTitle] = mdName;
                    subFolder[keyFolder].push(subToAdd);
                    subFolder[keyFolder] = sortByKey(subFolder[keyFolder], keyTitle);
                }
            }
            if (!isFirstLayer) {
                if (layersByMdName[mdName].length === 2) {
                    groups[groupName][mdName] = [];
                    removeLayerById(subFolder[keyLayer], layersByMdName[mdName][0].id);
                    subToAdd[keyLayer] = groups[groupName][mdName];
                    subToAdd[keyTitle] = mdName;
                    subFolder[keyFolder].push(subToAdd);
                    subFolder[keyFolder] = sortByKey(subFolder[keyFolder], keyTitle);

                    // groups[groupName][mdName].push({id: layersByMdName[mdName][0].id, name:layersByMdName[mdName][0].name});
                    groups[groupName][mdName].push(layersByMdName[mdName][0]);
                }
                // groups[groupName][mdName].push({id:rawLayer.id, name:rawLayer.name});
                groups[groupName][mdName].push(rawLayer);
                groups[groupName][mdName] = sortByKey(groups[groupName][mdName], "name");
            }
        }
    }

    return folder;
}

/**
 * An empty list is appended at key, if not exists.
 * @param {Object} object an object
 * @param {String} key an empty list is appended at key, if not exists
 * @returns {void}
 */
function appendArray (object, key) {
    if (!Array.isArray(object[key])) {
        object[key] = [];
    }
}
/**
 * Removes the object with the given id from list.
 * @param {Array} list to delete an entry from
 * @param {String} idToDelete id of object to delete
 * @returns {void}
 */
function removeLayerById (list, idToDelete) {
    const toRemoveIndex = list.findIndex((layer) => layer.id === idToDelete);

    if (toRemoveIndex > -1) {
        list.splice(toRemoveIndex, 1);
    }
}
/**
 * Sorts a list by values gotten by key.
 * @param {Array} list to sort
 * @param {String} key to get the value vrom to sort by
 * @returns {Array} the sorted list
 */
function sortByKey (list, key) {
    return list.sort((a, b) => {
        const valueA = a[key].toUpperCase(),
            valueB = b[key].toUpperCase();

        if (valueA < valueB) {
            return -1;
        }
        if (valueA > valueB) {
            return 1;
        }
        return 0;
    });
}

/**
 * Returns the ids of the layers in an array.
 * @param {Array} layers list of layers
 * @returns {Array} the ids of the layers
 */
function getIdsOfLayers (layers) {
    let ids = [];

    layers.forEach(layer => {
        if (Array.isArray(layer.id)) {
            ids = ids.concat(layer.id);
        }
        else {
            ids.push(layer.id);
        }
    });
    return ids;
}

/**
 * Returns the name of the category for the given categoryKey in layers first dataset.
 * @param {Object} layer the layer, must have attribute datasets with one entry with key 'md_name'
 * @param {String} categoryKey key of the category to read the name of
 * @returns {String} the name of the category for the given categoryKey
 */
function getCategoryName (layer, categoryKey) {
    if (Array.isArray(layer.datasets[0][categoryKey])) {
        return layer.datasets[0][categoryKey][0];
    }

    return layer.datasets[0][categoryKey];

}

/**
 * Returns true, if no other layer with the given metadata-name is contained in layersByMdName.
 * @param {Object} layersByMdName contains lists of layers grouped by matadata-name
 * @param {Object} layer the layer, must have attribute datasets with one entry with key 'md_name'
 * @returns {Boolean} true, if no other layer with the given metadata-name is contained in layersByMdName
 */
function checkIsFirstLayer (layersByMdName, layer) {
    const mdName = layer.datasets[0].md_name;

    if (Object.keys(layersByMdName).find((key) => key === mdName)) {
        layersByMdName[mdName].push(layer);
        return false;
    }

    layersByMdName[mdName] = [layer];
    return true;

}

