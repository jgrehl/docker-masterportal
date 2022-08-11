import LayerOl2d from "./layerOl2d";

/**
 * Creates a ol 2d raster layer.
 * @param {Object} attributes Attributes of the layer.
 * @returns {void}
 */
export default function LayerOl2dRaster (attributes) {
    const defaultAttributes = {
        infoFormat: "text/xml"
    };

    this.attributes = Object.assign(defaultAttributes, attributes);
    LayerOl2d.call(this, this.attributes);
}

LayerOl2dRaster.prototype = Object.create(LayerOl2d.prototype);
