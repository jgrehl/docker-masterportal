
import {wms} from "@masterportal/masterportalapi";
import LayerOl2dRaster from "./layerOl2dRaster";

/**
 * Creates a ol 2d raster layer.
 * @param {Object} attributes Attributes of the layer.
 * @returns {void}
 */
export default function LayerOl2dRasterWms (attributes) {
    const defaultAttributes = {
        crs: mapCollection.getMapView("2D").getProjection().getCode(),
        format: "image/png",
        gutter: 0,
        origin: [442800, 5809000],
        singleTile: false,
        tilesize: 512,
        transparent: true,
        version: "1.3.0"
    };

    this.attributes = Object.assign(defaultAttributes, attributes);
    LayerOl2dRaster.call(this, this.attributes);
}

LayerOl2dRasterWms.prototype = Object.create(LayerOl2dRaster.prototype);

/**
 * Creates a layer of type WMS by using wms-layer of the masterportalapi.
 * Sets all needed attributes at the layer and the layer source.
 * @param {Object} attributes Params of the raw layer.
 * @returns {void}
 */
LayerOl2dRasterWms.prototype.createLayer = function (attributes) {
    const rawLayerAttributes = this.getRawLayerAttributes(attributes),
        layerParams = this.getLayerParams(attributes),
        options = this.getOptions(attributes);

    this.layer = wms.createLayer(rawLayerAttributes, layerParams, options);
};

/**
 * Gets raw layer attributes from services.json attributes.
 * @param {Object} attributes Params of the raw layer.
 * @returns {Object} The raw layer attributes.
 */
LayerOl2dRasterWms.prototype.getRawLayerAttributes = function (attributes) {
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

    if (attributes.styles !== "nicht vorhanden") {
        rawLayerAttributes.STYLES = attributes.styles;
    }

    return rawLayerAttributes;
};

/**
 * Gets additional layer params.
 * @param {Object} attributes Params of the raw layer.
 * @returns {Obeject} The layer params.
 */
LayerOl2dRasterWms.prototype.getLayerParams = function (attributes) {
    return {
        format: attributes.format,
        layers: attributes.layers,
        name: attributes.name,
        typ: attributes.typ
    };
};

/**
 * Gets options that contains resolutions and origin to create the TileGrid.
 * @param {Object} attributes Params of the raw layer.
 * @returns {Object} The options.
 */
LayerOl2dRasterWms.prototype.getOptions = function (attributes) {
    return {
        origin: attributes.origin,
        resolutions: mapCollection.getMapView("2D").getResolutions()
    };
};
