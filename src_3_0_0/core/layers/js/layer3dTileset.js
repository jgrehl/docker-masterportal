import {Tileset} from "@masterportal/masterportalapi/src";
import Layer3d from "./layer3d";

/**
 * Creates a 3d layer tileset.
 * @abstract
 * @constructs
 * @extends Layer
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {void}
 */
export default function Layer3dTileset (attributes) {
    const defaultAttributes = {
        cesium3DTilesetDefaults: {
            maximumScreenSpaceError: "6"
        },
        transparency: 0
    };

    this.attributes = Object.assign(defaultAttributes, attributes);
    Layer3d.call(this, this.attributes);
}

Layer3dTileset.prototype = Object.create(Layer3d.prototype);

/**
 * Creates a layer of type tileset by using tileset-layer of the masterportalapi.
 * Sets all needed attributes at the layer and the layer source.
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {void}
 */
Layer3dTileset.prototype.createLayer = function (attributes) {
    this.setLayer(new Tileset(attributes));
    this.setOpacity(attributes.transparency);
    this.setVisible(attributes.visibility, mapCollection.getMap("3D"));
};

/**
 * Calls masterportalAPI's layer to set this layer opacity.
 * @param {Object} [transparency=0] The transparency.
 * @returns {void}
 */
Layer3dTileset.prototype.setOpacity = function (transparency = 0) {
    this.getLayer()?.setOpacity((100 - transparency) / 100);
};

/**
 * Calls masterportalAPI's tilset-layer to set this layer visible.
 * @param {Boolean} visibility visibility of the layer
 * @param {Cesium} map The 3d map.
 * @returns {void}
 */
Layer3dTileset.prototype.setVisible = function (visibility, map) {
    this.getLayer()?.setVisible(visibility, map);
};

/**
 * Sets values to the cesium layer.
 * @param {Object} attributes The new attributes.
 * @returns {void}
 */
Layer3dTileset.prototype.updateLayerValues = function (attributes) {
    if (this.get("visibility") !== attributes.visibility) {
        this.setVisible(attributes.visibility, mapCollection.getMap("3D"));
    }
    this.setOpacity(attributes.transparency);
};
