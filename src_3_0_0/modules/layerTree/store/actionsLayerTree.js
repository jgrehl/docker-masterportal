const actions = {
    /**
     * Sets showInLayerTree and visibility of the given layer to false.
     * @param {Object} layerConf The layer config.
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    removeLayer ({dispatch}, layerConf) {
        const layerConfCopy = {...layerConf, ...{
            showInLayerTree: false,
            visibility: false
        }};

        dispatch("replaceByIdInLayerConfig", layerConfCopy);
    },

    /**
     * Sets the given transparency to the layer.
     * @param {Object} layerConf The layer config.
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    updateTransparency ({dispatch}, {layerConf, transparency}) {
        const layerConfCopy = {...layerConf, ...{
            transparency: transparency
        }};

        dispatch("replaceByIdInLayerConfig", layerConfCopy);
    },

    /**
     * Commits the layerconf to the app-store.
     * @param {Object} layerConf The layer config.
     * @param {Object} param.commit the commit
     * @returns {void}
     */
    replaceByIdInLayerConfig ({commit}, layerConf) {
        commit("replaceByIdInLayerConfig", {
            layerConfigs: [
                {
                    layer: layerConf,
                    id: layerConf.id
                }
            ]
        }, {root: true});
    }
};

export default actions;
