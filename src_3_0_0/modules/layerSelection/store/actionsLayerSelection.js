const actions = {

    /**
     * Updates the layerTree with all configs added to state.layersToAdd.
     * Sets 'visibility' and 'showInLayerTree' to true at each layer.
     * Clears state.layersToAdd and redirects to main menu.
     * Note: Background layer will be set on top of the background layer with the highest zIndex.
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.getters the getters
     * @param {Object} param.rootGetters the rootGetters
     * @returns {void}
     */
    updateLayerTree ({commit, dispatch, getters, rootGetters}) {
        const layerConfigs = [],
            maxBackgroundLayerZIndex = Math.max(...rootGetters.layerConfigsByAttributes({
                backgroundLayer: true,
                showInLayerTree: true
            }).map(layer => layer.zIndex));
        let backgroundLayerZIndex = maxBackgroundLayerZIndex + 1,
            addToZIndex = 0;

        getters.layersToAdd.forEach(layerId => {
            let zIndex = rootGetters.determineZIndex(layerId) + addToZIndex;

            if (rootGetters.isBackgroundLayer(layerId)) {
                dispatch("updateLayerConfigZIndex", {
                    layerContainer: rootGetters.layerConfigsByAttributes({showInLayerTree: true}),
                    maxZIndex: maxBackgroundLayerZIndex
                }, {root: true});
                zIndex = backgroundLayerZIndex++;
            }
            else {
                addToZIndex++;
            }

            layerConfigs.push({
                id: layerId,
                layer: {
                    id: layerId,
                    visibility: true,
                    showInLayerTree: true,
                    zIndex: zIndex
                }
            });
        });

        dispatch("replaceByIdInLayerConfig", {layerConfigs: layerConfigs}, {root: true});
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
        commit("setSubjectDataLayerConfs", []);
        commit("setBackgroundLayerConfs", []);
    }
};

export default actions;
