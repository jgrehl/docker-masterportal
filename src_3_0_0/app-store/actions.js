import axios from "axios";
import {rawLayerList} from "@masterportal/masterportalapi/src";
import getNestedValues from "../shared/js/utils/getNestedValues";
import {getAndMergeAllRawLayers, getAndMergeRawLayer} from "./js/getAndMergeRawLayer";
import {buildTreeStructure} from "./js/buildTreeStructure";

export default {
    /**
     * Extends all layers of config.json with the attributes of the layer in services.json.
     * If portalConfig.tree contains parameter 'layerIDsToIgnore', 'metaIDsToIgnore', 'metaIDsToMerge' or 'layerIDsToStyle' the raw layerlist is filtered and merged.
     * Config entry portalConfig.tree.validLayerTypesAutoTree is respected.
     * If tree type is 'auto' , folder structure is build from layer's metadata contents for the active or first category configured in config.json unter 'tree'.
     * Replaces the extended layer in state.layerConf.
     * @param {Object} param.commit the commit
     * @param {Object} param.getters the getters
     * @param {Object} param.state the state
     * @returns {void}
     */
    extendLayers ({commit, getters, state}) {
        const layerContainer = getNestedValues(state.layerConfig, "Layer", "Ordner").flat(Infinity);

        if (state.portalConfig?.tree?.type === "auto") {
            let layersStructured = [];

            getAndMergeAllRawLayers(state.portalConfig?.tree);
            layersStructured = buildTreeStructure(state.layerConfig, getters.activeOrFirstCategory, layerContainer);

            commit("setLayerConfigByParentKey", {layerConfigs: layersStructured, parentKey: "Fachdaten"});
        }
        layerContainer.forEach(layerConf => {
            const rawLayer = getAndMergeRawLayer(layerConf, state.portalConfig?.tree?.type);

            if (rawLayer) {
                commit("replaceByIdInLayerConfig", {layerConfigs: [{layer: rawLayer, id: layerConf.id}]});
            }
        });
    },

    /**
     * Commit the loaded config.js to the state.
     * @param {Object} param.commit the commit
     * @param {Object} configJs The config.js
     * @returns {void}
     */
    loadConfigJs ({commit}, configJs) {
        commit("setConfigJs", configJs);
    },

    /**
     * Load the config.json and commit it to the state.
     * @param {Object} param.commit the commit
     * @param {Object} param.state the state
     * @returns {void}
     */
    loadConfigJson ({commit, state}) {
        const format = ".json";
        let targetPath = "config.json";

        if (state.configJs?.portalConf?.slice(-5) === format) {
            targetPath = state.configJs.portalConf;
        }

        axios.get(targetPath)
            .then(response => {
                commit("setPortalConfig", response.data?.Portalconfig);
                commit("setLayerConfig", response.data?.Themenconfig);
                commit("setLoadedConfigs", "configJson");
            })
            .catch(error => {
                console.error(`Error occured during loading config.json specified by config.js (${targetPath}).`, error);
            });
    },

    /**
     * Load the rest-services.json and commit it to the state.
     * @param {Object} param.commit the commit
     * @param {Object} param.state the state
     * @returns {void}
     */
    loadRestServicesJson ({commit, state}) {
        axios.get(state.configJs?.restConf)
            .then(response => {
                commit("setRestConfig", response.data);
                commit("setLoadedConfigs", "restServicesJson");
            })
            .catch(error => {
                console.error(`Error occured during loading rest-services.json specified by config.js (${state.configJs?.restConf}).`, error);
            });
    },

    /**
     * Load the services.json via masterportalapi.
     * @param {Object} param.state the state
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    loadServicesJson ({state, commit, dispatch}) {
        rawLayerList.initializeLayerList(state.configJs?.layerConf, (_, error) => {
            if (error) {
                dispatch("Alerting/addSingleAlert", {
                    category: "error",
                    content: i18next.t("common:app-store.loadServicesJsonFailed", {layerConf: state.configJs?.layerConf})
                }, {root: true});
            }
            else {
                commit("setLoadedConfigs", "servicesJson");
            }
        });
    },
    /**
     * Adds one layer to states layerConfig under the given parentKey.
     * @param {Object} state store state
     * @param {Object} payload the payload
     * @param {Object[]} payload.layerConfig layer to add to the layerConfigs
     * @param {String} payload.parentKey the key of the parent object
     * @returns {Boolean} true or false
     */
    addLayerToLayerConfig ({state}, {layerConfig, parentKey}) {
        const layerContainer = getNestedValues(state.layerConfig, "Layer", "Ordner").flat(Infinity),
            matchingLayer = layerContainer.find(layer =>layer.id === layerConfig.id);

        if (matchingLayer === undefined) {
            state.layerConfig[parentKey].Layer.push(layerConfig);
            return true;
        }
        return false;
    }
};
