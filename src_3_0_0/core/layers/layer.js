/**
 * Creates a layer.
 * @abstract
 * @constructs
 * @param {Object} attributes The attributes of the layer configuration.
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
 * @abstract
 * @returns {void}
 */
Layer.prototype.createLayer = function () {
    // do in children
    console.warn("Function Layer: 'createLayer' must be overwritten in extended layers!");
};

/**
 * To be overwritten, does nothing.
 * @abstract
 * @returns {void}
 */
Layer.prototype.updateLayerValues = function () {
    // do in children
    console.warn("Function Layer: 'updateLayerValues' must be overwritten in extended layers!");
};

/**
 * Getter for attribute values.
 * @param {String} key The attribute key.
 * @returns {*} The attribute value
 */
Layer.prototype.get = function (key) {
    return this.attributes[key];
};

/**
 * Setter for attribute values.
 * @param {String} key The attribute key.
 * @param {*} value The attribute value
 * @returns {void}
 */
Layer.prototype.set = function (key, value) {
    this.attributes[key] = value;
};
