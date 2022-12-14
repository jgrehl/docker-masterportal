
import {wms} from "@masterportal/masterportalapi";
import Layer2dRaster from "./layer2dRaster";

/**
 * Creates a 2d raster wms (Web Map Service) layer.
 * @constructs
 * @extends Layer2dRaster
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {void}
 */
export default function Layer2dRasterWms (attributes) {
    const defaultAttributes = {
        format: "image/png",
        gutter: 0,
        origin: [442800, 5809000],
        singleTile: false,
        tilesize: 512,
        transparent: true,
        version: "1.3.0"
    };

    this.attributes = Object.assign(defaultAttributes, attributes);
    Layer2dRaster.call(this, this.attributes);
}

Layer2dRasterWms.prototype = Object.create(Layer2dRaster.prototype);

/**
 * Creates a layer of type WMS by using wms-layer of the masterportalapi.
 * Sets all needed attributes at the layer and the layer source.
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {void}
 */
Layer2dRasterWms.prototype.createLayer = function (attributes) {
    const rawLayerAttributes = this.getRawLayerAttributes(attributes),
        layerParams = this.getLayerParams(attributes),
        options = this.getOptions(attributes);

    this.setLayer(wms.createLayer(rawLayerAttributes, layerParams, options));
};

/**
 * Gets raw layer attributes from attributes.
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {Object} The raw layer attributes.
 */
Layer2dRasterWms.prototype.getRawLayerAttributes = function (attributes) {
    const rawLayerAttributes = {
        crs: attributes.crs,
        format: attributes.format,
        gutter: attributes.gutter,
        id: attributes.id,
        layers: attributes.layers,
        singleTile: attributes.singleTile,
        tilesize: attributes.tilesize,
        transparent: attributes.transparent?.toString(),
        url: attributes.url,
        version: attributes.version
    };

    if (attributes.styles !== undefined) {
        rawLayerAttributes.STYLES = attributes.styles;
    }

    return rawLayerAttributes;
};

/**
 * Gets additional layer params.
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {Obeject} The layer params.
 */
Layer2dRasterWms.prototype.getLayerParams = function (attributes) {
    return {
        format: attributes.format,
        gfiAsNewWindow: attributes.gfiAsNewWindow,
        gfiAttributes: attributes.gfiAttributes,
        gfiTheme: attributes.gfiTheme,
        infoFormat: attributes.infoFormat,
        layers: attributes.layers,
        name: attributes.name,
        opacity: (100 - attributes.transparency) / 100,
        typ: attributes.typ,
        zIndex: attributes.zIndex
    };
};

/**
 * Gets options that contains resolutions and origin to create the TileGrid.
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {Object} The options.
 */
Layer2dRasterWms.prototype.getOptions = function (attributes) {
    return {
        origin: attributes.origin,
        resolutions: mapCollection.getMapView("2D").getResolutions()
    };
};
