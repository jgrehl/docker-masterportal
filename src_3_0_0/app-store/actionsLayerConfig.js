import {buildTreeStructure} from "./js/buildTreeStructure";
import getNestedValues from "../shared/js/utils/getNestedValues";
import {getAndMergeAllRawLayers, getAndMergeRawLayer} from "./js/getAndMergeRawLayer";
import {sortObjects} from "../shared/js/utils/sortObjects";

const orderThemenconfig = ["Hintergrundkarten", "Fachdaten"];

export default {
    /**
     * Adds one layer to states layerConfig under the given parentKey.
     * @param {Object} dispatch store dispatch
     * @param {Object} state store state
     * @param {Object} payload the payload
     * @param {Object[]} payload.layerConfig layer to add to the layerConfigs
     * @param {String} payload.parentKey the key of the parent object
     * @returns {Boolean} true or false
     */
    addLayerToLayerConfig ({dispatch, state}, {layerConfig, parentKey}) {
        const layerContainer = getNestedValues(state.layerConfig, "elements", true).flat(Infinity),
            matchingLayer = layerContainer.find(layer =>layer.id === layerConfig.id),
            maxZIndex = Math.max(...getNestedValues(state.layerConfig[parentKey], "elements", true).flat(Infinity).map(layerConf => layerConf.zIndex));

        dispatch("updateLayerConfigZIndex", {layerContainer, maxZIndex});

        if (matchingLayer === undefined) {
            layerConfig.zIndex = maxZIndex + 1;
            state.layerConfig[parentKey].elements.push(layerConfig);
            dispatch("addBackgroundLayerAttribute");

            return true;
        }

        return false;
    },

    /**
     * Updates the zindex of the layer configs by increasing the zindex of the layer configs
     * that have a zindex greater than the max zindex by 1.
     * @param {Object} context store context
     * @param {Object} payload the payload
     * @param {Object} payload.layerContainer The layer container of layer configs.
     * @param {Object} payload.maxZIndex The max zIndex of the layer configs.
     * @returns {void}
     */
    updateLayerConfigZIndex (context, {layerContainer, maxZIndex}) {
        sortObjects(layerContainer, "zIndex");

        layerContainer.forEach(layerConf => {
            if (layerConf.zIndex > maxZIndex) {
                layerConf.zIndex = layerConf.zIndex + 1;
            }
        });
    },

    /**
     * Extends all layers of config.json with the attributes of the layer in services.json.
     * If portalConfig.tree contains parameter 'layerIDsToIgnore', 'metaIDsToIgnore', 'metaIDsToMerge' or 'layerIDsToStyle' the raw layerlist is filtered and merged.
     * Config entry portalConfig.tree.validLayerTypesAutoTree is respected.
     * If tree type is 'auto' , folder structure is build from layer's metadata contents for the active or first category configured in config.json unter 'tree'.
     * Replaces the extended layer in state.layerConf.
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.state the state
     * @returns {void}
     */
    extendLayers ({dispatch, state}) {
        const orderedLayerConfigKeys = Object.keys(state.layerConfig).sort((a, b) => orderThemenconfig.indexOf(a) - orderThemenconfig.indexOf(b));

        dispatch("addBackgroundLayerAttribute");

        orderedLayerConfigKeys.forEach(layerConfigKey => {
            state.layerConfig[layerConfigKey]?.elements?.reverse();

            const layerContainer = getNestedValues(state.layerConfig[layerConfigKey], "elements", true).flat(Infinity);

            if (state.portalConfig?.tree?.type === "auto") {
                dispatch("processTreeTypeAuto", layerContainer);
            }

            dispatch("updateLayerConfigs", layerContainer);
        });
    },

    /**
     * Adds the attribute backgroundLayer to layers of Hintergrundkarten.
     * @param {Object} param.state the state
     * @returns {void}
     */
    addBackgroundLayerAttribute ({state}) {
        state.layerConfig?.Hintergrundkarten?.elements?.map(attributes => {
            return Object.assign(attributes, {backgroundLayer: true});
        });
    },

    /**
     * Processes the tree structure with raw layers of the tree type auto.
     * @param {Object} param.commit the commit
     * @param {Object} param.getters the getters
     * @param {Object} param.state the state
     * @param {Object[]} layerContainer The layer configs.
     * @returns {void}
     */
    processTreeTypeAuto ({commit, getters, state}, layerContainer) {
        let layersStructured = [];

        getAndMergeAllRawLayers(state.portalConfig?.tree);
        layersStructured = buildTreeStructure(state.layerConfig, getters.activeOrFirstCategory, layerContainer);

        commit("setLayerConfigByParentKey", {layerConfigs: layersStructured, parentKey: "Fachdaten"});
    },

    /**
     * Updates the layer configs with raw layer attributes.
     * @param {Object} param.commit the commit
     * @param {Object} param.state the state
     * @param {Object[]} layerContainer The layer configs.
     * @returns {void}
     */
    updateLayerConfigs ({commit, state}, layerContainer) {
        layerContainer.forEach(layerConf => {
            const rawLayer = getAndMergeRawLayer(layerConf, state.portalConfig?.tree?.type);

            if (rawLayer) {
                commit("replaceByIdInLayerConfig", {layerConfigs: [{layer: rawLayer, id: layerConf.id}]});
            }
        });
    }
};
