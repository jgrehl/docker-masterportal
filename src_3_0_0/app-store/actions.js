import axios from "axios";
import {rawLayerList} from "@masterportal/masterportalapi/src";
import styleList from "@masterportal/masterportalapi/src/vectorStyle/styleList";

import actionsLayerConfig from "./actionsLayerConfig";
import {fetchFirstModuleConfig} from "../shared/js/utils/fetchFirstModuleConfig";
import {portalConfigKey, treeTopicConfigKey} from "../shared/js/utils/constants";
import {updateProxyUrl} from "./js/getProxyUrl";
import {upperFirst} from "../shared/js/utils/changeCase";

export default {
    ...actionsLayerConfig,

    /**
     * Check/adapt for proxy configs and commit the loaded config.js to the state.
     * @param {Object} param.commit the commit
     * @param {Object} configJs The config.js
     * @returns {void}
     */
    loadConfigJs ({commit}, configJs) {
        const proxyHost = configJs.proxyHost ? configJs.proxyHost : "";

        updateProxyUrl(configJs, proxyHost);
        commit("setConfigJs", configJs);
    },

    /**
     * Load the config.json, check/adapt for proxy configs, check/add alert config and commit it to the state.
     * @param {Object} param.commit the commit
     * @param {Object} param.state the state
     * @returns {void}
     */
    loadConfigJson ({commit, state, dispatch}) {
        const format = ".json";
        let targetPath = "config.json";

        if (state.configJs?.portalConf?.slice(-5) === format) {
            targetPath = state.configJs.portalConf;
        }

        axios.get(targetPath)
            .then(response => {
                updateProxyUrl(response.data);
                if (response.data?.Portalconfig.alerts) {
                    dispatch("addAlertsFromConfigJson", response.data.Portalconfig.alerts);
                }
                commit("setPortalConfig", response.data ? response.data[portalConfigKey] : null);
                commit("setLayerConfig", response.data ? response.data[treeTopicConfigKey] : null);
                commit("setLoadedConfigs", "configJson");
            })
            .catch(error => {
                console.error(`Error occured during loading config.json specified by config.js (${targetPath}).`, error);
            });
    },

    /**
     * Load the rest-services.json, check/adapt for proxy configs and commit it to the state.
     * @param {Object} param.commit the commit
     * @param {Object} param.state the state
     * @returns {void}
     */
    loadRestServicesJson ({commit, state}) {
        axios.get(state.configJs?.restConf)
            .then(response => {
                updateProxyUrl(response.data);
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
     * Sets the config-params of a module into state.
     * @param {Object} context the context Vue instance
     * @param {Object} payload The payload.
     * @param {String[]} payload.configPaths The path to configuration of the module in the config file.
     * @param {String} payload.type The type of the module.
     * @returns {void}
     */
    initializeModule: (context, {configPaths, type}) => {
        return fetchFirstModuleConfig(context, configPaths, upperFirst(type));
    },

    /**
     * Initializes other actions.
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    initializeOther ({dispatch}) {
        dispatch("Modules/WmsTime/watchVisibleLayerConfig", null, {root: true});
    },

    /**
     * Initializes the style list of vector styling. Sets state variable 'StyleListLoaded' to true, if successful loaded.
     * @param {Object} param.state the state
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.getters the getters
     * @returns {void}
     */
    initializeVectorStyle ({state, commit, dispatch, getters}) {
        const styleGetters = {
                mapMarkerPointStyleId: getters.configJs?.mapMarker?.pointStyleId,
                mapMarkerPolygonStyleId: getters.configJs?.mapMarker?.polygonStyleId,
                highlightFeaturesPointStyleId: getters["Modules/HighlightFeatures/pointStyleId"],
                highlightFeaturesPolygonStyleId: getters["Modules/HighlightFeatures/polygonStyleId"],
                highlightFeaturesLineStyleId: getters["Modules/HighlightFeatures/lineStyleId"],
                zoomToFeatureId: getters.configJs.zoomTo?.find(entry => entry.id === "zoomToFeatureId")?.styleId
            },
            layerConfigs = getters.allLayerConfigs,
            secondaryMenuSections = getters.menuFromConfig("secondaryMenu").sections ? getters.menuFromConfig("secondaryMenu").sections[0] : [],
            sectionsContent = getters.menuFromConfig("mainMenu").sections[0].concat(secondaryMenuSections);

        styleList.initializeStyleList(styleGetters, state.configJs, layerConfigs, sectionsContent,
            (initializedStyleList, error) => {
                if (error) {
                    dispatch("Alerting/addSingleAlert", {
                        category: "warning",
                        content: i18next.t("common:app-store.loadStylev3JsonFailed", {style_v3: state.configJs?.styleConf ? state.configJs?.styleConf : "style_v3.json"})
                    }, {root: true});
                }
                return initializedStyleList;
            }).then(() => {
            commit("setStyleListLoaded", true);
        }).catch(error => console.error(error));
    },

    /**
     * Loops trough defined alerts from config json and add it to the alerting module
     * @param {Object} param.dispatch the commit
     * @param {Object} alerts object with defined alerts
     * @returns {void}
     */
    addAlertsFromConfigJson ({dispatch}, alerts) {
        Object.values(alerts).forEach((value) => {
            value.initial = true;
            value.isNews = true;
            value.initialConfirmed = value.mustBeConfirmed;
            dispatch("Alerting/addSingleAlert", value, {root: true});
        });
    }
};
