import {wmts} from "@masterportal/masterportalapi";
import Layer2dRaster from "./layer2dRaster";

/**
 * Creates a 2d raster wmts (Web Map Tile Service) layer.
 * @constructs
 * @extends Layer2dRaster
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {void}
 */
export default function Layer2dRasterWmts (attributes) {
    const defaultAttributes = {
        optionsFromCapabilities: false
    };

    this.attributes = Object.assign(defaultAttributes, attributes);
    Layer2dRaster.call(this, this.attributes);
}

Layer2dRasterWmts.prototype = Object.create(Layer2dRaster.prototype);

/**
 * Creates a layer of type WMTS by using wmts-layer of the masterportalapi.
 * Sets all needed attributes at the layer and the layer source.
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {void}
 */
Layer2dRasterWmts.prototype.createLayer = function (attributes) {
    this.setLayer(wmts.createLayer(attributes));
};
