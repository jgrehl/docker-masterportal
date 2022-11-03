
/**
 * Writes active layers, visibility, transparency, Map/center and Map/zoomLevel as Url params.
 * @param {Object} _ vuex root state
 * @param {Object} rootGetters vuex root getters
 * @returns {String} url with params
 */
export function getStateAsUrlParams (_, rootGetters) {
    const layerIds = [],
        layerVisibilities = [],
        layerTransparencies = [];

    rootGetters.visibleLayerConfigs.forEach(layer => {
        layerIds.push(layer.id);
        layerVisibilities.push(layer.visibility);
        layerTransparencies.push(layer.transparency);
    });

    return location.origin + location.pathname +
        "?Map/layerIds=" + layerIds +
        "&visibility=" + layerVisibilities +
        "&transparency=" + layerTransparencies +
        "&Map/center=[" + rootGetters["Maps/center"] +
        "]&Map/zoomLevel=" + rootGetters["Maps/zoom"];
}
