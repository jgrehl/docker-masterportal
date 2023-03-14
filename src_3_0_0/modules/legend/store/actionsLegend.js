import layerCollection from "../../../core/layers/js/layerCollection";
import layerFactory from "../../../core/layers/js/layerFactory";
import validator from "../js/validator";
import legendDraw from "../js/legendDraw";

const actions = {

     /**
         * Creates the legend.
         * @returns {void}
         */
      createLegend ({commit, dispatch, getters}) {
        layerCollection.getLayers().forEach(layer => dispatch("toggleLayerInLegend", {layer:layer, visibility: layer.get("visibility")}));
        getters.waitingLegendsInfos.forEach(layer => dispatch("generateLegendForLayerInfo", layer));
        commit("setWaitingLegendsInfos", []);       
    },
    
    /**
         * Adds the legend of one layer to the legends in the store
         * @param {Object} param.commit the commit
         * @param {Object} param.state the state
         * @param {Object} legendObj Legend object of one layer
         * @returns {void}
         */
    addLegend ({state, commit}, legendObj) {
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
    sortLegend ({state, commit}) {
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
    removeLegend ({state, commit}, id) {
        const legends = state.legends.filter((legendObj) => {
            return legendObj.id !== id;
        });

        commit("setLegends", legends);
    },

    /**
         * Generates or removed the layers legend object.
         * @param {Object} layer the layer to show the legend for
         * @param {Boolean} visibility visibility of layer in map
         * @returns {void}
         */
     toggleLayerInLegend ({dispatch}, {layer, visibility}) {
        const
            layerId = layer.get("id"),
            layerTyp = layer.get("typ");

        if (visibility === false) {
            dispatch("removeLegend", layerId);

        }
        else {
            if (layerTyp === "GROUP") {
                dispatch("prepareLegendForGroupLayer", layer.getLayerSource());
            }
            else {
                dispatch("prepareLegend", layer.getLegend());
            }
            dispatch("generateLegend", layer);
        }
    },

    /**
     * Generates the legend object and adds it to the legend array in the store.
     * @param {String} id Id of layer.
     * @param {String} name Name of layer.
     * @param {Number} zIndex ZIndex of layer.
     * @param {Object[]} legend Legend of layer.
     * @returns {void}
     */
    generateLegend ({dispatch, getters}, layer) {
        const   id = layer.get("id"),
        legendObj = {
                id: id,
                name: layer.get("name"),
                legend: getters.preparedLegend,
                position: layer.getLayer().getZIndex()
            },
            isValidLegend = validator.isValidLegendObj(legendObj),
            isNotInLegend = isValidLegend && !getters.isLayerInLegend(id),
            isLegendChanged = isValidLegend && !isNotInLegend && getters.isLegendChanged(legendObj);

        if (isNotInLegend) {
            dispatch("addLegend", legendObj);
        }
        else if (isLegendChanged) {
            dispatch("removeLegend", id);
            dispatch("addLegend", legendObj);
        }
        dispatch("sortLegend");
    },

    /**
     * Creates the legend for the layer info.
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.rootGetters the rootGetters
     * @param {String} layerId Id of layer to create the layer info legend.
     * @returns {void}
     */
    async createLegendForLayerInfo ({state, commit, dispatch, rootGetters}, layerId) {
        let layer = layerCollection.getLayerById(layerId);

        if (!layer) {
            const layerConfig = rootGetters.layerConfigById(layerId);

            layer = layerFactory.createLayer(layerConfig);

            // legend is not loaded at this time, will be triggered by adding layer to map
            if(layer.getLegend() === true){
                dispatch("Maps/addLayer", layer.getLayer(), {root: true});
                state.waitingLegendsInfos.push(layer);
                commit("setLayerInfoLegend", {});
                if(layer.get("typ") === "WFS"){
                    await dispatch("Maps/areLayerFeaturesLoaded", layerId, {root: true});
                    layer.getLayer().setVisible(false);
                }
                else  if(layer.get("typ") === "SensorThings"){
                    layer.getLayer().setVisible(false);
                    layer.stopSubscription();
                }
            }
            else {
                dispatch("generateLegendForLayerInfo", layer);
            }
        }
        else {
            dispatch("generateLegendForLayerInfo", layer);
        }
    },

    /**
     * Generates legend for the layer info.
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.getters the getters
     * @param {Object} layer the layer
     * @returns {void}
     */
    generateLegendForLayerInfo ({commit, dispatch, getters}, layer) {
        let legendObj = null;

        if (layer) {
            if (layer.get("typ") === "GROUP") {
                dispatch("prepareLegendForGroupLayer", layer.getLayerSource());
            }
            else {
                dispatch("prepareLegend", layer.getLegend());
            }

            legendObj = {
                id: layer.get("id"),
                name: layer.get("name"),
                legend: getters.preparedLegend,
                position: layer.getLayer().getZIndex()
            };
            if (validator.isValidLegendObj(legendObj)) {
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
                    legendObj = legendDraw.prepare(geometryType, style, name);
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
