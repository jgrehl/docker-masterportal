/**
 * Creates a layer.
 * @param {Object} attributes Attributes of the layer.
 * @returns {void}
 */
export default function Layer (attributes) {
    const defaultAttributes = {
        minScale: 0
    };

    this.attributes = Object.assign(defaultAttributes, attributes);
}
