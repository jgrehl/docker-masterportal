import crs from "@masterportal/masterportalapi/src/crs";


export default {
    /**
     * Zoom to a given extent
     * @param {Object} _ store context.
     * @param {Object} payload parameter object.
     * @param {String[]} payload.extent The extent to zoom.
     * @param {Object} payload.options Options for zoom.
     * @param {Number} [payload.options.duration=800] The duration of the animation in milliseconds.
     * @see {@link https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#fit} for more options.
     * @returns {void}
     */
    zoomToExtent (_, {extent, options}) {
        mapCollection.getMapView("2D").fit(extent, {
            size: mapCollection.getMap("2D").getSize(),
            ...Object.assign({duration: 800}, options)
        });
    },

    /**
     * Zoom to a given extent, this function allows to give projection of extent
     * Note: Used in remoteInterface.
     * @param {Object} param store context.
     * @param {Object} param.dispatch the dispatch.
     * @param {Object} payload parameter object.
     * @param {Object} payload.data Contains extent, options as Object and projection.
     * @param {String[]} payload.data.extent The extent to zoom.
     * @param {Object} payload.data.options Options for zoom.
     * @param {string} payload.data.projection The projection from RUL parameter.
     * @returns {void}
     */
    zoomToProjExtent ({dispatch}, {data}) {
        if (Object.values(data).every(val => val !== undefined)) {
            const leftBottom = data.extent.slice(0, 2),
                topRight = data.extent.slice(2, 4),
                transformedLeftBottom = crs.transformToMapProjection(mapCollection.getMap("2D"), data.projection, leftBottom),
                transformedTopRight = crs.transformToMapProjection(mapCollection.getMap("2D"), data.projection, topRight),
                extentToZoom = transformedLeftBottom.concat(transformedTopRight);

            dispatch("zoomToExtent", {extent: extentToZoom, options: data.options});
        }
    }
};
