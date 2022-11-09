import Layer from "./layer";

/**
 * Creates a 3d layer.
 * @abstract
 * @constructs
 * @extends Layer
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {void}
 */
export default function Layer3d (attributes) {
    const defaultAttributes = {
    };

    this.attributes = Object.assign(defaultAttributes, attributes);
    Layer.call(this, this.attributes);
}

Layer3d.prototype = Object.create(Layer.prototype);

/**
 * Calls masterportalAPI's layer to set this layer visible.
 * @param {Boolean} visibility visibility of the layer
 * @param {Cesium} map The 3d map.
 * @param {Object} [attributes={}] The attributes of the layer configuration.
 * @returns {void}
 */
Layer3d.prototype.setVisible = function (visibility, map, attributes = {}) {
    this.getLayer()?.setVisible(visibility, attributes, map);
};

/**
 * Sets values to the cesium layer.
 * @param {Object} attributes The new attributes.
 * @returns {void}
 */
Layer3d.prototype.updateLayerValues = function (attributes) {
    if (this.get("visibility") !== attributes.visibility) {
        this.setVisible(attributes.visibility, mapCollection.getMap("3D"), attributes);
    }
};
