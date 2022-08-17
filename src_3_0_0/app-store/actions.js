import axios from "axios";
import {initializeLayerList} from "@masterportal/masterportalapi/src/rawLayerList";
import getNestedValues from "../utils/getNestedValues";
import {getAllRawLayerSortedByMdId, getAndMergeRawLayer} from "../utils/getAndMergeRawLayer";

export default {
    /**
     * Commit the loaded config.js to the state.
     * @param {Object} configJs The config.js
     * @returns {void}
     */
    loadConfigJs ({commit}, configJs) {
        commit("setConfigJs", configJs);
    },

    /**
     * Load the config.json and commit it to the state.
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
     * Fills the states layerConf with filtered layers from services.json.
     * For more Information see 'getAllRawLayerSortedByMdId'.
     * @returns {void}
     */
    fillLayerConf ({commit, state}) {
        const layerContainer = getNestedValues(state.layerConfig, "Layer").flat(Infinity),
            rawLayers = getAllRawLayerSortedByMdId(layerContainer);

        commit("addToLayerConfig", {layerConfigs: {Fachdaten: rawLayers}, parentKey: "Themenconfig"});
    },

    /**
     * Extends all visible layers of config.json with the attributes of the layer in services.json.
     * Replaces the extended layer in state.layerConf.
     * @returns {void}
     */
    extendVisibleLayers ({dispatch}) {
        dispatch("extendLayers", true);
    },

    /**
     * Extends all layers of config.json with the attributes of the layer in services.json.
     * Replaces the extended layer in state.layerConf.
     * @param {Boolean} [onlyVisible=false] If true, only visible layers will be extended.
     * @returns {void}
     */
    extendLayers ({commit, state}, onlyVisible = false) {
        const layerContainer = getNestedValues(state.layerConfig, "Layer").flat(Infinity);

        if (state.portalConfig?.treeType === "default") {
            const rawLayers = getAndMergeRawLayersFilteredByMdId();

            commit("addToLayerConfig", {layerConfigs: {Layer: rawLayers}, parentKey: "Fachdaten"});
        }
        layerContainer.forEach(layerConf => {
            if (!onlyVisible || layerConf.visibility) {
                const rawLayer = getAndMergeRawLayer(layerConf);

                if (rawLayer) {
                    commit("replaceByIdInLayerConfig", [rawLayer]);
                }
                else {
                    console.warn("Configured visible layer with id ", layerConf.id, " was not found in ", state.configJs?.layerConf);
                }
            }
        });
    },

    /**
     * Load the rest-services.json and commit it to the state.
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
     * @returns {void}
     */
    loadServicesJson ({state, commit}) {
        initializeLayerList(state.configJs?.layerConf, () => {
            commit("setLoadedConfigs", "servicesJson");
        });
    }
};
