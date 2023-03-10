import {buildTreeStructure} from "./js/buildTreeStructure";
import getNestedValues from "../shared/js/utils/getNestedValues";
import replaceInNestedValues from "../shared/js/utils/replaceInNestedValues";
import {getAndMergeAllRawLayers, getAndMergeRawLayer} from "./js/getAndMergeRawLayer";
import {sortObjects} from "../shared/js/utils/sortObjects";
import {treeOrder, treeBackgroundsKey, treeSubjectsKey} from "../shared/js/utils/constants";
import layerCollection from "../core/layers/js/layerCollection";

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
    addLayerToLayerConfig ({dispatch, getters, state}, {layerConfig, parentKey}) {
        const layerContainer = getters.allLayerConfigs.filter(config => Object.prototype.hasOwnProperty.call(config, "zIndex") && typeof config.zIndex === "number"),
            matchingLayer = layerContainer.find(layer =>layer.id === layerConfig.id),
            configsByParentKey = getters.allLayerConfigsByParentKey(parentKey).filter(config => Object.prototype.hasOwnProperty.call(config, "zIndex") && typeof config.zIndex === "number"),
            maxZIndex = Math.max(...configsByParentKey.map(layerConf => layerConf.zIndex));

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
     * Replaces the layer with the id of the layer toReplace in state's layerConfig.
     * Calls 'visibilityChanged' at layer.
     * @param {Object} state store state
     * @param {Object} getters the getters
     * @param {Object} [payload={}] the payload
     * @param {Object[]} [payload.layerConfigs=[]] Array of configs of layers to replace, and the id to match in state.layerConfigs
     * @param {Object} payload.layerConfigs.layer layerConfig
     * @param {String} payload.layerConfigs.id the id to match in state.layerConfigs
     * @param {Boolean} [payload.trigger=true] if true then getters are triggered
     * @returns {void}
     */
    replaceByIdInLayerConfig ({state, getters}, {layerConfigs = [], trigger = true} = {}) {
        layerConfigs.forEach(config => {
            const replacement = config.layer,
                id = config.id,
                lastVisibility = typeof getters.layerConfigById === "function" ? getters.layerConfigById(id)?.visibility : null,
                assigned = replaceInNestedValues(state.layerConfig, "elements", replacement, {key: "id", value: id});

            if (assigned.length > 1) {
                console.warn(`Replaced ${assigned.length} layers in state.layerConfig with id: ${id}. Layer was found ${assigned.length} times. You have to correct your config!`);
            }

            // necessary to trigger the getters
            if (trigger) {
                state.layerConfig = {...state.layerConfig};
            }

            if (typeof replacement.visibility === "boolean" && typeof lastVisibility === "boolean" && lastVisibility !== replacement.visibility) {
                layerCollection.getLayerById(id)?.visibilityChanged(replacement.visibility);
            }
        });
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
     * Updates the zIndexes of all layerConfigs shown in tree, starts with 0.
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.getters the getters
     * @returns {void}
     */
    updateAllZIndexes ({getters}) {
        let startZIndex = 0;

        treeOrder.forEach(parentKey => {
            const configsByParentKey = getters.allLayerConfigsByParentKey(parentKey).filter(config => Object.prototype.hasOwnProperty.call(config, "zIndex") && typeof config.zIndex === "number");

            sortObjects(configsByParentKey, "zIndex");
            configsByParentKey.forEach(layerConf => {
                layerConf.zIndex = startZIndex++;
            });
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
        let layerContainer = [];
        const orderedLayerConfigKeys = Object.keys(state.layerConfig).sort((a, b) => treeOrder.indexOf(a) - treeOrder.indexOf(b));

        dispatch("addBackgroundLayerAttribute");

        orderedLayerConfigKeys.forEach(layerConfigKey => {
            state.layerConfig[layerConfigKey]?.elements?.reverse();
        });

        layerContainer = getNestedValues(state.layerConfig, "elements", true).flat(Infinity);
        if (state.portalConfig?.tree?.type === "auto") {
            dispatch("processTreeTypeAuto", layerContainer);
        }
        dispatch("updateLayerConfigs", layerContainer);
    },

    /**
     * Adds the attribute backgroundLayer to layers configured as background layers.
     * @param {Object} param.state the state
     * @returns {void}
     */
    addBackgroundLayerAttribute ({getters}) {
        getters.allLayerConfigsByParentKey(treeBackgroundsKey).map(attributes => {
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

        commit("setLayerConfigByParentKey", {layerConfigs: layersStructured, parentKey: treeSubjectsKey});
    },

    /**
     * Updates the layer configs with raw layer attributes.
     * @param {Object} param.commit the commit
     * @param {Object} param.state the state
     * @param {Object[]} layerContainer The layer configs.
     * @returns {void}
     */
    updateLayerConfigs ({dispatch, state}, layerContainer) {
        layerContainer.forEach(layerConf => {
            const rawLayer = getAndMergeRawLayer(layerConf, !state.portalConfig?.tree?.addLayerButton);

            if (rawLayer) {
                dispatch("replaceByIdInLayerConfig", {layerConfigs: [{layer: rawLayer, id: layerConf.id}]});
            }
        });
    }
};
