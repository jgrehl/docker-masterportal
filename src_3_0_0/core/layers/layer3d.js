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
