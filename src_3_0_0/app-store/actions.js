import axios from "axios";
import {initializeLayerList} from "@masterportal/masterportalapi/src/rawLayerList";
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
     * @returns {void}
     */
    extendLayers ({commit, getters, state}) {
        const layerContainer = getNestedValues(state.layerConfig, "Layer", "Ordner").flat(Infinity);

        if (state.portalConfig?.tree?.type === "auto") {
            let layersStructured = [];

            getAndMergeAllRawLayers(state.portalConfig?.tree);
            layersStructured = buildTreeStructure(state.layerConfig, getters.activeOrFirstCategory);

            commit("addToLayerConfig", {layerConfigs: layersStructured, parentKey: "Fachdaten"});
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
        const layerContainer = flattenArray(getNestedValues(state.layerConfig, "Layer")),
            rawLayers = getAllRawLayerSortedByMdId(layerContainer);

        commit("addToLayerConfig", {toAdd: {Fachdaten: rawLayers}, parentKey: "Themenconfig"});
    },

    /**
     * Extends all visible layers of config.json with the attributes of the layer in services.json.
     * Replaces the extended layer in state.layerConf.
     * @param {Array} layerConfig an array of configured layers like in the config.json
     * @returns {void}
     */
    extendVisibleLayers ({commit, state}) {
        const layerContainer = flattenArray(getNestedValues(state.layerConfig, "Layer"));

        layerContainer.forEach(layerConf => {
            if (layerConf.visibility) {
                const rawLayer = getOrMergeRawLayer(layerConf);

                if (rawLayer) {
                    commit("replaceByIdInLayerConfig", [Object.assign(rawLayer, layerConf)]);
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
        initializeLayerList(state.configJs?.layerConf, (_, error) => {
            if (error) {
                // Implementieren, wenn Alert da ist:
                // Radio.trigger("Alert", "alert", {
                //     text: "<strong>Die Datei '" + layerConfUrl + "' konnte nicht geladen werden!</strong>",
                //     kategorie: "alert-warning"
                // });
            }
            else {
                commit("setLoadedConfigs", "servicesJson");
            }
        });
    }
};
