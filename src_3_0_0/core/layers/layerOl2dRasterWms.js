
import LayerOl2dRaster from "./layerOl2dRaster";

/**
 * Creates a ol 2d raster layer.
 * @param {Object} attributes Attributes of the layer.
 * @returns {void}
 */
export default function LayerOl2dRasterWms (attributes) {
    const defaultAttributes = {
        infoFormat: "text/xml"
    };

    this.attributes = Object.assign(defaultAttributes, attributes);
    LayerOl2dRaster.call(this, this.attributes);
}

LayerOl2dRasterWms.prototype = Object.create(LayerOl2dRaster.prototype);
