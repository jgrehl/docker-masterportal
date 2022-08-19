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
    this.setLayerSource(this.getLayer()?.getSource());
}

Layer2d.prototype = Object.create(Layer.prototype);

/**
 * Sets values to the ol layer.
 * @param {Object} values The new values.
 * @returns {void}
 */
Layer2d.prototype.updateLayerValues = function (values) {
    this.getLayer().setVisible(values.visibility);
};

/**
 * Getter for ol layer.
 * @returns {ol/layer/Layer~Layer} The ol layer
 */
Layer2d.prototype.getLayer = function () {
    return this.layer;
};

/**
 * Getter for ol layer source.
 * @returns {ol/source/Source~Source} The ol layer source.
 */
Layer2d.prototype.getLayerSource = function () {
    return this.layerSource;
};

/**
 * Setter for ol layer.
 * @param {ol/layer/Layer~Layer} value The ol layer
 * @returns {void}
 */
Layer2d.prototype.setLayer = function (value) {
    this.layer = value;
};

/**
 * Setter for ol layer source.
 * @param {ol/source/Source~Source} value The ol layer source.
 * @returns {void}
 */
Layer2d.prototype.setLayerSource = function (value) {
    this.layerSource = value;
};
