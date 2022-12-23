const actions = {

    /**
     * Updates the layerTree with all configs added to state.layersToAdd.
     * Sets 'visibility' and 'showInLayerTree' to true at each layer.
     * Clears state.layersToAdd and redirects to main menu.
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.getters the getters
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

    /**
     * todo remove/change if menu is new refactored
     * @param {Object} param.commit the commit
     * @returns {void}
     */
    navigateBackToMainMenu ({commit}) {
        commit("setActive", false);
        commit("Menu/Navigation/setEntry", "mainMenu", {root: true});
    }
};

export default actions;
