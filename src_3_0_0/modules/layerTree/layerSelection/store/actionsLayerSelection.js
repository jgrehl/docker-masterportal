const actions = {
    /**
     * Sets showInLayerTree and visibility of the given layer to false.
     * @param {Object} layerConf The layer config.
     * @param {Object} param.dispatch the dispatch
     * @returns {void}
     */
    updateLayerTree ({commit, dispatch, getters}) {
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
        commit("replaceByIdInLayerConfig", {layerConfigs: layerConfigs}, {root: true});
        commit("clearSelectedLayer");
        dispatch("navigateBackToMainMenu");
    },

    // @ todo remove/change if menu is new refactored
    navigateBackToMainMenu ({commit}) {
        commit("setActive", false);
        commit("Menu/Navigation/setEntry", "mainMenu", {root: true});
    }
};

export default actions;
