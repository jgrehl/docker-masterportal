import Layer from "./layer";

/**
 * Creates a 2d layer.
 * @abstract
 * @constructs
 * @extends Layer
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {void}
 */
export default function Layer2d (attributes) {
    const defaultAttributes = {
    };

    this.attributes = Object.assign(defaultAttributes, attributes);
    Layer.call(this, this.attributes);
    this.set("layerSource", this.get("layer").getSource());
}

Layer2d.prototype = Object.create(Layer.prototype);

/**
 * Sets values to the ol layer.
 * @param {Object} values The new values.
 * @returns {void}
 */
Layer2d.prototype.updateLayerValues = function (values) {
    this.layer.setVisible(values.visibility);
};
