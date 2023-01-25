import rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";
import store from "../../../app-store";
import layerCollection from "../../../core/layers/js/layerCollection";

/**
 * Creates a layer containing the given features and shows it in menu tree.
 * @param {Object} rootGetters rootGetters
 * @param {String} layerId contains the id of the layer, the features are got from
 * @param {Array} features contains the features to add to new layer
 * @param {Object} thfConfig content of config.json's property 'treeHighlightedFeatures'
 * @returns {void}
 */
async function createLayerAddToTree (rootGetters, layerId, features, thfConfig = {}) {
    if (layerId) {
        const layerNameKey = thfConfig.layerName ? thfConfig.layerName : "common:tree.selectedFeatures",
            originalLayer = getLayer(layerId);

        if (originalLayer) {
            const originalLayerName = originalLayer.get("name").replace(i18next.t(layerNameKey), "").trim(),
                layerName = i18next.t(layerNameKey) + " " + originalLayerName,
                id = layerId.indexOf(originalLayerName) === -1 ? layerId + "_" + originalLayerName : layerId,
                attributes = setAttributes(originalLayer, id, layerName, layerNameKey);
            let highlightLayer = layerCollection.getLayerById(id),
                layerSource = null;

            if (!highlightLayer) {
                highlightLayer = await addLayerModel(attributes, id);
            }
            else {
                store.dispatch("replaceByIdInLayerConfig", {
                    layerConfigs: [{
                        id: id,
                        layer: {
                            visibility: attributes.visibility,
                            showInLayerTree: attributes.showInLayerTree,
                            zIndex: highlightLayer.attributes?.zIndex ? highlightLayer.attributes.zIndex : rootGetters.determineZIndex(id)
                        }
                    }]}, {root: true});
                store.dispatch("updateAllZIndexes", null, {root: true});
            }

            setStyle(highlightLayer, attributes.styleId);
            layerSource = highlightLayer.getLayerSource();
            layerSource.getFeatures().forEach(feature => layerSource.removeFeature(feature));
            layerSource.addFeatures(features);
        }
        else {
            console.warn("Layer with id ", layerId, " not found, layer with features was not created!");
        }
    }
}

/**
 * Returns the layer with the given id.
 * @param {String} id of the layer
 * @returns {Object} the layer with the given id
 */
function getLayer (id) {
    let layer = layerCollection.getLayerById(id);

    if (!layer) {
        const rawLayer = rawLayerList.getLayerWhere({id: id});

        layer = addLayerModel(rawLayer, id);
    }
    return layer;
}

/**
 * Adds the layer-model to list of layers.
 * @param {Object} attributes  of the layer
 * @param {String} id of the layer
 * @returns {Object} the created layer
 */
async function addLayerModel (attributes, id) {
    await store.dispatch("addLayerToLayerConfig", {layerConfig: attributes, parentKey: "Fachdaten"}, {root: true});
    return layerCollection.getLayerById(id);
}

/**
 * Copies the attributesof the given layer and adapts them.
 * @param {Object} layer to copy attributes of
 * @param {String} id of the layer
 * @param {String} layerName name of the layer
 * @returns {Object} the adapted attributes
 */
function setAttributes (layer, id, layerName) {
    const attributes = {...layer.attributes};

    attributes.visibility = true;
    attributes.id = id;
    attributes.typ = "VectorBase";
    attributes.alwaysOnTop = true;
    attributes.name = layerName;
    attributes.showInLayerTree = true;
    return attributes;
}


/**
 * Sets the style at the layer.
 * @param {Object} layer to set the style at
 * @param {String} styleId styleId of the style-model
 * @returns {void}
 */
// eslint-disable-next-line
function setStyle (layer, styleId) {
    // @todo when styleModel has moved
    // @todo test implementation also needed
    // const styleModel = Radio.request("StyleList", "returnModelById", styleId);

    // if (styleModel !== undefined) {
    // layer.get("layer").setStyle((feature) => {
    //      return styleModel.createStyle(feature, false);
    //  });
    // }
}

export default {
    createLayerAddToTree
};
