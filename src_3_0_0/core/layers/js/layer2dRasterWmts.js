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
    const rawLayerAttributes = this.getRawLayerAttributes(attributes),
        layerParams = this.getLayerParams(attributes);

    this.setLayer(wmts.createLayer(rawLayerAttributes, layerParams));
};

/**
 * Gets raw layer attributes from attributes.
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {Object} The raw layer attributes.
 */
Layer2dRasterWmts.prototype.getRawLayerAttributes = function (attributes) {
    return attributes;
};

/**
 * Gets additional layer params.
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {Obeject} The layer params.
 */
Layer2dRasterWmts.prototype.getLayerParams = function (attributes) {
    return {
        opacity: (100 - attributes.transparency) / 100,
        zIndex: attributes.zIndex
    };
};

