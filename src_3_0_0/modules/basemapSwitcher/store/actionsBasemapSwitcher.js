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
     * @param {Object} layerId id of the layer to add
     * @returns {void}
     */
    updateLayerVisibilityAndZIndex ({dispatch, rootGetters}, layerId) {
        const layerConfigs = [],
            maxBackgroundLayerZIndex = Math.max(...rootGetters.layerConfigsByAttributes({
                backgroundLayer: true,
                showInLayerTree: true
            }).map(layer => layer.zIndex));
        let backgroundLayerZIndex = maxBackgroundLayerZIndex + 1,
            addToZIndex = 0,
            zIndex = rootGetters.determineZIndex(layerId) + addToZIndex;

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

        dispatch("replaceByIdInLayerConfig", {layerConfigs: layerConfigs}, {root: true});
        dispatch("updateBackgroundLayerVisibility", layerId);
    },
    /**
     * Updates the layer visibility of the previously visible backgroundLayer
     * Sets 'visibility' to false and keeps 'showInLayerTree' to true at each layer.
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.rootGetters the rootGetters
     * @param {Object} layerId id of the layer that needs to stay visible
     * @returns {void}
     */
    updateBackgroundLayerVisibility ({dispatch, rootGetters}, layerId) {
        const layerConfigs = [],
            visibleBackgroundLayers = rootGetters.layerConfigsByAttributes({
                backgroundLayer: true,
                showInLayerTree: true
            }),
            backgroundLayersToSetUnvisible = visibleBackgroundLayers.filter(layer => layer.id !== layerId);

        backgroundLayersToSetUnvisible.forEach((layer) => {
            layerConfigs.push({
                id: layer.id,
                layer: {
                    id: layer.id,
                    visibility: false,
                    showInLayerTree: true
                }
            });
        });

        dispatch("replaceByIdInLayerConfig", {layerConfigs: layerConfigs}, {root: true});
    }
};

export default actions;
