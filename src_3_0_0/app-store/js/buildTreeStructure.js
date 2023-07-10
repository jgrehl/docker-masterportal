import rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";
import getNestedValues from "../../shared/js/utils/getNestedValues";
import {sortObjects} from "../../shared/js/utils/sortObjects";
import {treeBaselayersKey} from "../../shared/js/utils/constants";


/**
 * Returns all layer from services.json to add to states layerConfig for treetype 'auto', besides background-layers.
 * The layers are sorted and grouped by metadata-name.
 * @param  {Object} layerConfig configuration of layer like in the config.json, to get background-layer from
 * @param  {String} category the category to get the tree for
 * @param  {Object} shownLayerConfs configuration of layer to show on first level of tree, configured in config.json
 * @returns {Object} tree structure as json object
 */
export function buildTreeStructure (layerConfig, category, shownLayerConfs = []) {
    // @todo refactored from parserDefaultTree.js
    const layerList = rawLayerList.getLayerList(),
        categoryKey = category?.key,
        groups = {},
        folder = {},
        layersByMdName = {};
    let bgLayers = [],
        bgLayerIds = [];

    if (!category) {
        return layerList;
    }
    if (layerConfig) {
        bgLayers = getNestedValues(layerConfig[treeBaselayersKey], "elements", true).flat(Infinity);
        bgLayerIds = getIdsOfLayers(bgLayers);
    }
    folder.elements = [];

    for (let i = 0; i < layerList.length; i++) {
        let rawLayer = layerList[i],
            subFolder;

        if (bgLayerIds.indexOf(rawLayer.id) > -1) {
            continue;
        }
        if (rawLayer.datasets[0] && rawLayer.datasets[0][categoryKey]) {
            shownLayerConfs.forEach(layerConf => {
                if (layerConf.id === rawLayer.id) {
                    rawLayer = Object.assign(rawLayer, layerConf);
                }
            });
            const mdName = rawLayer.datasets[0].md_name,
                groupName = getGroupName(rawLayer, categoryKey),
                isFirstLayer = isFirstLayerWithMdName(layersByMdName, rawLayer, mdName);

            if (!Object.keys(groups).find((key) => key === groupName)) {
                addGroup(folder, groups, groupName);
            }
            subFolder = folder.elements.find((obj) => obj.name === groupName);

            if (!Object.keys(groups[groupName]).find((key) => key === mdName)) {
                groups[groupName][mdName] = [];
                if (isFirstLayer) {
                    addSingleLayer(subFolder, rawLayer, mdName);
                }
                else {
                    addSubGroup(subFolder, groups, groupName, mdName);
                }
            }
            if (!isFirstLayer) {
                if (layersByMdName[mdName].length === 2) {
                    moveFirstLayerToFolder(subFolder, groups, layersByMdName, groupName, mdName);
                }
                groups[groupName][mdName].push(rawLayer);
                sortObjects(groups[groupName][mdName], "name");
            }
        }
    }

    return folder;
}

/**
 * Moves the first layer with given mdName to subfolder.
 * @param {Object} subFolder sub Folder
 * @param {Object} groups layers by groupname and netatdata-name
 * @param {Object} layersByMdName contains lists of layers grouped by matadata-name
 * @param {String} groupName name of the group (category) in layers first dataset
 * @param {String} mdName metadata-name of the layer
 * @returns {void}
 */
function moveFirstLayerToFolder (subFolder, groups, layersByMdName, groupName, mdName) {
    const firstLayer = layersByMdName[mdName][0],
        subToAdd = {};

    groups[groupName][mdName] = [];
    removeLayerById(subFolder.elements, firstLayer.id);
    subToAdd.elements = groups[groupName][mdName];
    subToAdd.name = mdName;
    subToAdd.type = "folder";
    subFolder.elements.push(subToAdd);
    sortObjects(subFolder.elements, "name");
    groups[groupName][mdName].push(firstLayer);
}

/**
 * Adds a single layer to sub folder and assigns the metadata-name to the name.
 * @param {Object} subFolder sub Folder
 * @param {Object} layer the raw layer
 * @param {String} mdName metadata-name of the layer
 * @returns {void}
 */
function addSingleLayer (subFolder, layer, mdName) {
    if (!Array.isArray(subFolder.elements)) {
        subFolder.elements = [];
    }
    subFolder.elements.push(Object.assign({}, layer, {name: mdName}));
    sortObjects(subFolder.elements, "name");
}

/**
 * Adds layers from groups to subfolder.
 * @param {Object} subFolder sub Folder
 * @param {Object} groups layers by groupname and netatdata-name
 * @param {String} groupName name of the group (category) in layers first dataset
 * @param {String} mdName metadata-name of the layer
 * @returns {void}
 */
function addSubGroup (subFolder, groups, groupName, mdName) {
    const subToAdd = {};

    subToAdd.elements = groups[groupName][mdName];
    subToAdd.name = mdName;
    subToAdd.type = "folder";
    subFolder.elements.push(subToAdd);
    sortObjects(subFolder.elements, "name");
}

/**
 * Adds group to folder.
 * @param {Object} folder the folder
 * @param {Object} groups layers by groupname and netatdata-name
 * @param {String} groupName name of the group (category) in layers first dataset
 * @returns {void}
 */
function addGroup (folder, groups, groupName) {
    const toAdd = {};

    toAdd.elements = [];
    toAdd.name = groupName;
    toAdd.type = "folder";
    folder.elements.push(toAdd);
    sortObjects(folder.elements, "name");
    groups[groupName] = {};
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
function getGroupName (layer, categoryKey) {
    if (Array.isArray(layer.datasets[0][categoryKey])) {
        return layer.datasets[0][categoryKey][0];
    }
    return layer.datasets[0][categoryKey];
}

/**
 * Returns true, if no other layer with the given metadata-name is contained in layersByMdName.
 * @param {Object} layersByMdName contains lists of layers grouped by matadata-name
 * @param {Object} layer the raw layer
 * @param {String} mdName metadata-name of the layer
 * @returns {Boolean} true, if no other layer with the given metadata-name is contained in layersByMdName
 */
function isFirstLayerWithMdName (layersByMdName, layer, mdName) {
    if (Object.keys(layersByMdName).find((key) => key === mdName)) {
        layersByMdName[mdName].push(layer);
        return false;
    }
    layersByMdName[mdName] = [layer];
    return true;
}

