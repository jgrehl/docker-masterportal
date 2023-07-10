const actions = {

    /**
     * Updates the layerTree with all configs added to state.layersToAdd.
     * Sets 'visibility' and 'showInLayerTree' to true at each layer.
     * Clears state.layersToAdd and redirects to main menu.
     * Note: Baselayer will be set on top of the baselayer with the highest zIndex.
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.getters the getters
     * @param {Object} param.rootGetters the rootGetters
     * @returns {void}
     */
    updateLayerTree ({commit, dispatch, getters, rootGetters}) {
        const layerConfigs = [],
            maxBaselayerZIndex = Math.max(...rootGetters.layerConfigsByAttributes({
                baselayer: true,
                showInLayerTree: true
            }).map(layer => layer.zIndex));
        let baselayerZIndex = maxBaselayerZIndex + 1,
            addToZIndex = 0;

        getters.layersToAdd.forEach(layerId => {
            let zIndex = rootGetters.determineZIndex(layerId) + addToZIndex;

            if (rootGetters.isBaselayer(layerId)) {
                dispatch("updateLayerConfigZIndex", {
                    layerContainer: rootGetters.layerConfigsByAttributes({showInLayerTree: true}),
                    maxZIndex: maxBaselayerZIndex
                }, {root: true});
                zIndex = baselayerZIndex++;
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
     * @param {Array} payload.baselayerConfs baselayer configurations to show in layerSelection
     * @returns {void}
     */
    navigateForward ({commit}, {lastFolderName, subjectDataLayerConfs, baselayerConfs = []}) {
        commit("addToLayerSelection", {lastFolderName, subjectDataLayerConfs, baselayerConfs});
        commit("setBaselayerConfs", baselayerConfs);
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
        commit("setBaselayerConfs", getters.lastBaselayerConfs[getters.lastBaselayerConfs.length - 1]);

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
        commit("setBaselayerConfs", []);
    }
};

export default actions;
