import Layer from "./layer";

/**
 * Creates a ol 2d layer.
 * @param {Object} attributes Attributes of the layer.
 * @returns {void}
 */
export default function LayerOl2d (attributes) {
    const defaultAttributes = {
        transparency: 0
    };

    this.attributes = Object.assign(defaultAttributes, attributes);
    Layer.call(this, this.attributes);
}

LayerOl2d.prototype = Object.create(Layer.prototype);
