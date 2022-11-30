import axios from "axios";
import handleAxiosResponse from "../../../shared/js/utils/handleAxiosResponse";
import {setLikeFilterProperties} from "../js/buildFilter";
import {createUserHelp, prepareLiterals, resetFieldValues} from "../js/literalFunctions";
import layerCollection from "../../../core/layers/js/layerCollection";
import {createLayer, getLayerTypes3d} from "../../../core/layers/js/layerFactory";
import {rawLayerList} from "@masterportal/masterportalapi/src";

const actions = {
    /**
     * Updates the currently set search instance based on the given id and prepares the tool for that instance.
     *
     * @param {Number} instanceIndex The index of the currentInstance.
     * @returns {void}
     */
    instanceChanged ({commit, dispatch}, instanceIndex) {
        commit("setCurrentInstanceIndex", instanceIndex);
        dispatch("prepareModule");
    },
    /**
     * If the WFS is given, the required values are set, information from the external source (dropdowns) is retrieved,
     * like filter values and the service are set.
     *
     * @returns {void}
     */
    prepareModule ({commit, dispatch, getters}) {
        dispatch("resetModule", false);

        const {currentInstance} = getters,
            {requestConfig: {layerId, likeFilter, restLayerId, storedQueryId}, title} = currentInstance;

        dispatch("getWFSById", {id: restLayerId ? restLayerId : layerId, type: restLayerId ? "restLayerId" : "layerId"}).then((wfs) => {
            if (wfs) {
                const {selectSource} = currentInstance,
                    service = {url: wfs.url || (wfs.get ? wfs.get("url") : undefined)};

                // NOTE: The extra object is sadly needed so that the object is reactive :(
                commit("setRequiredValues", {...prepareLiterals(currentInstance.literals)});
                commit("setUserHelp", currentInstance.userHelp || createUserHelp(currentInstance.literals));

                if (selectSource) {
                    dispatch("retrieveData");
                }
                if (likeFilter) {
                    setLikeFilterProperties(likeFilter);
                }
                if (!storedQueryId && layerId) {
                    service.typeName = wfs.featureType || (wfs.get ? wfs.get("featureType") : undefined);
                }
                commit("setService", service);
            }
            else {
                dispatch("resetModule", true);
                dispatch("Alerting/addSingleAlert", i18next.t("common:modules.tools.wfsSearch.wrongConfig", {id: restLayerId ? restLayerId : layerId, title}), {root: true});
            }
        }
        );
    },
    /**
     * Gets the WFS depending on id and layer type defined in the config.json
     *
     * @returns {object} - wfs object
     */
    getWFSById ({rootGetters}, {id, type}) {
        if (type === "restLayerId") {
            return rootGetters.restServiceById(id);
        }
        else if (type === "layerId") {
            const layerInLayerCollection = layerCollection.getLayerById(id);
            let layerConfig = null;


            if (layerInLayerCollection === undefined) {
                layerConfig = rootGetters.layerConfigById(id);

                if (layerConfig === undefined) {

                    const rawLayer = rawLayerList.getLayerWhere({id: id}),
                        rawLayerMapMode = getLayerTypes3d().includes(rawLayer?.typ) ? "3D" : "2D";

                    if (rawLayer) {
                        const layer = createLayer(rawLayer, rawLayerMapMode);

                        return layer.attributes;
                    }
                }
                else {
                    return layerConfig;
                }
            }

            return layerInLayerCollection;
        }

        return null;
    },
    /**
     * Resets state parameters to its initial state.
     * If the tool was closed, the tool is completely reset.
     *
     * @param {Boolean} closeTool Whether the tool was closed or not.
     * @returns {void}
     */
    resetModule ({commit, dispatch}, closeTool) {
        commit("setRequiredValues", null);
        commit("setSearched", false);
        commit("setService", null);
        commit("setUserHelp", "");
        dispatch("resetResult");

        if (closeTool) {
            commit("setCurrentInstanceIndex", 0);
            commit("setParsedSource", null);
            commit("setActive", false);
        }
    },
    /**
     * Retrieves information from the external file to the state.
     *
     * @returns {void}
     */
    retrieveData ({commit, getters}) {
        const {currentInstance: {selectSource}} = getters;

        axios.get(encodeURI(selectSource))
            .then(response => handleAxiosResponse(response, "WfsSearch, retrieveData"))
            .then(data => commit("setParsedSource", data));
    },
    /**
     * Resets the results in the state as well as the inputs/dropdowns in the UI.
     * Also removes the map marker.
     * @returns {void}
     */
    resetResult ({commit, dispatch, getters, state}) {
        commit("setValuesReset", true);
        commit("setSearched", false);
        commit("setResults", []);
        commit("setSelectedOptions", {});
        // @todo remove point marker
        dispatch("MapMarker/removePointMarker", null, {root: true});
        resetFieldValues(getters.currentInstance.literals);

        // Reset dropdowns
        if (state.requiredValues !== null) {
            Object.keys(state.requiredValues).forEach(val => {
                state.requiredValues[val] = "";
            });
        }
    }
};

export default actions;