import Layer2d from "./layer2d";

/**
 * Creates a 2d raster layer.
 * @abstract
 * @constructs
 * @extends Layer2d
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {void}
 */
export default function Layer2dRaster (attributes) {
    const defaultAttributes = {
        infoFormat: "text/xml",
        crs: mapCollection.getMapView("2D").getProjection().getCode()
    };

    this.attributes = Object.assign(defaultAttributes, attributes);
    Layer2d.call(this, this.attributes);
}

Layer2dRaster.prototype = Object.create(Layer2d.prototype);
