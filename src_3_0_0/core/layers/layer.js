/**
 * Creates a layer.
 * @param {Object} attributes Attributes of the layer.
 * @returns {void}
 */
export default function Layer (attributes) {
    const defaultAttributes = {
    };

    this.attributes = Object.assign(defaultAttributes, attributes);
    this.createLayer(this.attributes);
}

/**
 * To be overwritten, does nothing.
 * @returns {void}
 */
Layer.prototype.createLayer = function () {
    // do in children
    console.warn("Function Layer: 'createLayer' must be overwritten in extended layers!");
};
