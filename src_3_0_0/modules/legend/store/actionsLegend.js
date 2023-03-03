import layerCollection from "../../../core/layers/js/layerCollection";
import layerFactory from "../../../core/layers/js/layerFactory";
import validator from "../js/validator";
import legendDraw from "../js/legendDraw";

const actions = {

    /**
         * Adds the legend of one layer to the legends in the store
         * @param {Object} param.commit the commit
         * @param {Object} param.state the state
         * @param {Object} legendObj Legend object of one layer
         * @returns {void}
         */
    addLegend: function ({state, commit}, legendObj) {
        const legends = state.legends;

        if (!legends.find(layer => layer.name === legendObj.name)) {
            legends.push(legendObj);
            commit("setLegends", legends);
        }
    },

    /**
         * Sorts the Legend Entries by position descending
         * @param {Object} param.commit the commit
         * @param {Object} param.state the state
         * @returns {void}
         */
    sortLegend: function ({state, commit}) {
        const sorted = state.legends.sort(function (a, b) {
            return b.position - a.position;
        });

        commit("setLegends", sorted);
    },

    /**
     * Removes a layer legend from the legends in the store by given id.
     * @param {Object} param.commit the commit
     * @param {Object} param.state the state
     * @param {String} id Id of layer.
     * @returns {void}
     */
    removeLegend: function ({state, commit}, id) {
        const legends = state.legends.filter((legendObj) => {
            return legendObj.id !== id;
        });

        commit("setLegends", legends);
    },


    /**
     * Creates the legend for the layer info.
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.getters the getters
     * @param {Object} param.rootGetters the rootGetters
     * @param {String} layerId Id of layer to create the layer info legend.
     * @returns {void}
     */
    createLegendForLayerInfo ({commit, dispatch, getters, rootGetters}, layerId) {
        let layerForLayerInfo = layerCollection.getLayerById(layerId),
            legendObj = null,
            isValidLegend = null;

        if (!layerForLayerInfo) {
            const layerConfig = rootGetters.layerConfigById(layerId);

            layerForLayerInfo = layerFactory.createLayer(layerConfig);
        }

        if (layerForLayerInfo) {
            if (layerForLayerInfo.get("typ") === "GROUP") {
                dispatch("prepareLegendForGroupLayer", layerForLayerInfo.getLayerSource());
            }
            else {
                dispatch("prepareLegend", layerForLayerInfo.getLegend());
            }

            legendObj = {
                id: layerForLayerInfo.get("id"),
                name: layerForLayerInfo.get("name"),
                legend: getters.preparedLegend,
                position: layerForLayerInfo.get("selectionIDX")
            };

            isValidLegend = validator.isValidLegendObj(legendObj);
            if (isValidLegend) {
                commit("setLayerInfoLegend", legendObj);
            }
        }
    },

    /**
     * Prepares the legend with the given legendInfos
     * @param {Object} param.commit the commit
     * @param {*[]} legendInfos legend Infos of layer
     * @returns {void}
     */
    prepareLegend ({commit}, legendInfos) {
        let preparedLegend = [];

        if (Array.isArray(legendInfos) && legendInfos.every(value => typeof value === "string") && legendInfos.length > 0) {
            preparedLegend = legendInfos;
        }
        else if (Array.isArray(legendInfos)) {
            legendInfos.forEach(legendInfo => {
                const geometryType = legendInfo.geometryType,
                    name = legendInfo.label,
                    style = legendInfo.styleObject;
                let legendObj = {
                    name
                };

                if (geometryType) {
                    if (geometryType === "Point") {
                        legendObj = legendDraw.prepareLegendForPoint(legendObj, style);
                    }
                    else if (geometryType === "LineString") {
                        legendObj = legendDraw.prepareLegendForLineString(legendObj, style);
                    }
                    else if (geometryType === "Polygon") {
                        legendObj = legendDraw.prepareLegendForPolygon(legendObj, style);
                    }
                    else if (geometryType === "Cesium") {
                        legendObj.name = legendDraw.prepareNameForCesium(style);
                        legendObj = legendDraw.prepareLegendForCesium(legendObj, style);
                    }
                }
                /** Style WMS */
                else if (legendInfo?.name && legendInfo?.graphic) {
                    legendObj = legendInfo;
                }
                if (Array.isArray(legendObj)) {
                    legendObj.forEach(obj => {
                        preparedLegend.push(obj);
                    });
                }
                else {
                    preparedLegend.push(legendObj);
                }
            });
        }
        commit("setPreparedLegend", preparedLegend);
    },

    /**
     * Prepares the legend array for a grouplayer by iterating over its layers and generating the legend of each child.
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.getters the getters
     * @param {ol/Layer/Source} layerSource Layer sources of group layer.
     * @returns {void}
     */
    prepareLegendForGroupLayer ({commit, dispatch, getters}, layerSource) {
        let legends = [];

        layerSource.forEach(layer => {
            dispatch("prepareLegend", layer.getLegend());
            legends.push(getters.preparedLegend);
        });
        legends = [].concat(...legends);
        commit("setPreparedLegend", legends);
    }


};

export default actions;
