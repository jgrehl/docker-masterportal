const actions = {
    /**
     * Sets showInLayerTree and visibility of the given layer to false.
     * @param {Object} layerConf The layer config.
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    updateLayerTree ({commit, getters}) {
        const layerConfigs = [];

        getters.layersToAdd.forEach(layerId => {
            layerConfigs.push(
                {
                    id: layerId,
                    layer: {
                        id: layerId,
                        visibility: true,
                        showInLayerTree: true
                    }
                }
            );
        });
        getters.layersToRemove.forEach(layerId => {
            layerConfigs.push(
                {
                    id: layerId,
                    layer: {
                        id: layerId,
                        visibility: false,
                        showInLayerTree: false
                    }
                }
            );
        });
        commit("replaceByIdInLayerConfig", {layerConfigs: layerConfigs}, {root: true});
        commit("clearSelectedLayer");
    }
};

export default actions;
