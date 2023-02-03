const actions = {

    /**
     * Updates the layerTree with all configs added to state.layersToAdd.
     * Sets 'visibility' and 'showInLayerTree' to true at each layer.
     * Clears state.layersToAdd and redirects to main menu.
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.getters the getters
     * @param {Object} param.rootGetters the rootGetters
     * @returns {void}
     */
    updateLayerTree ({commit, dispatch, getters, rootGetters}) {
        const layerConfigs = [];

        getters.layersToAdd.forEach(layerId => {
            layerConfigs.push(
                {
                    id: layerId,
                    layer: {
                        id: layerId,
                        visibility: true,
                        showInLayerTree: true,
                        zIndex: rootGetters.determineZIndex(layerId)
                    }
                }
            );
        });
        dispatch("replaceByIdInLayerConfig", {layerConfigs: layerConfigs}, {root: true});
        dispatch("updateAllZIndexes", null, {root: true});
        commit("clearLayerSelection");
        commit("Menu/switchToRoot", getters.menuSide, {root: true});
    },

    /**
     * Navigates forward in layerSelection.
     * @param {Object} param.commit the commit
     * @param {Object} param.state the state
     * @param {Object} payload the payload
     * @param {String} payload.lastFolderName name of the previous folder configuration name
     * @param {Array} payload.subjectDataLayerConfs subject data layer configurations to show in layerSelection
     * @param {Array} payload.backgroundLayerConfs background layer configurations to show in layerSelection
     * @returns {void}
     */
    navigateForward ({commit}, {lastFolderName, subjectDataLayerConfs, backgroundLayerConfs = []}) {
        commit("addToLayerSelection", {lastFolderName, subjectDataLayerConfs, backgroundLayerConfs});
        commit("setLastFolderName", lastFolderName);
        commit("setBackgroundLayerConfs", backgroundLayerConfs);
        commit("setSubjectDataLayerConfs", subjectDataLayerConfs);
    },

    /**
     * Navigates back in layerSelection.
     * @param {Object} param.commit the commit
     * @param {Object} param.getters the getters
     * @param {Object} param.state the state
     * @returns {void}
     */
    navigateBack ({commit, getters}) {
        commit("reduceToPreviousLayerSelection");
        commit("setLastFolderName", getters.lastFolderNames[getters.lastFolderNames.length - 1]);
        commit("setSubjectDataLayerConfs", getters.lastSubjectDataLayerConfs[getters.lastSubjectDataLayerConfs.length - 1]);
        commit("setBackgroundLayerConfs", getters.lastBackgroundLayerConfs[getters.lastBackgroundLayerConfs.length - 1]);

    },

    /**
     * Resets the layerSelection.
     * @param {Object} param.commit the commit
     * @param {Object} param.state the state
     * @returns {void}
     */
    reset ({commit}) {
        commit("clearLayerSelection");
        commit("setLastFolderName", null);
        commit("setSubjectDataLayerConfs", []);
        commit("setBackgroundLayerConfs", []);
    }
};

export default actions;
