import Cluster from "ol/source/Cluster";

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
        transparency: 0
    };

    this.attributes = Object.assign(defaultAttributes, attributes);
    Layer.call(this, this.attributes);

    this.setLayerSource(this.getLayer()?.getSource());
    this.controlAutoRefresh(attributes);
}

Layer2d.prototype = Object.create(Layer.prototype);

/**
 * Controls the automatic refresh of the layer source.
 * @param {Object} attributes The attributes of the layer configuration
 * @returns {void}
 */
Layer2d.prototype.controlAutoRefresh = function (attributes) {
    const autoRefresh = attributes?.autoRefresh;

    if (typeof autoRefresh === "number" || typeof autoRefresh === "string") {
        if (attributes.visibility && typeof this.getIntervalAutoRefresh() === "undefined") {
            this.startAutoRefresh(parseInt(autoRefresh, 10));
        }
        else if (!attributes.visibility) {
            this.stopAutoRefresh();
        }
    }
};

/**
 * Creates and starts an interval to refresh the layer.
 * @param {Number} autoRefresh The interval in milliseconds.
 * @returns {void}
 */
Layer2d.prototype.startAutoRefresh = function (autoRefresh) {
    this.setIntervalAutoRefresh(setInterval(() => {
        const layerSource = this.getLayerSource() instanceof Cluster ? this.getLayerSource()?.getSource() : this.getLayerSource();

        layerSource?.refresh();
    }, autoRefresh));
};

/**
 * Clears running auto refresh interval.
 * @returns {void}
 */
Layer2d.prototype.stopAutoRefresh = function () {
    clearInterval(this.getIntervalAutoRefresh());
    this.setIntervalAutoRefresh(undefined);
};

/**
 * Sets values to the ol layer.
 * @param {Object} attributes The new attributes.
 * @returns {void}
 */
Layer2d.prototype.updateLayerValues = function (attributes) {
    this.getLayer()?.setVisible(attributes.visibility);
    this.controlAutoRefresh(attributes);
};

/**
 * Getter for interval auto refresh.
 * @returns {Number} The interval auto refresh.
 */
Layer2d.prototype.getIntervalAutoRefresh = function () {
    return this.intervalAutoRefresh;
};

/**
 * Getter for ol layer source.
 * @returns {ol/source/Source~Source} The ol layer source.
 */
Layer2d.prototype.getLayerSource = function () {
    return this.layerSource;
};

/**
 * Setter for interval auto refresh.
 * @param {Number} value The interval auto refresh.
 * @returns {void}
 */
Layer2d.prototype.setIntervalAutoRefresh = function (value) {
    this.intervalAutoRefresh = value;
};

/**
 * Setter for ol layer source.
 * @param {ol/source/Source~Source} value The ol layer source.
 * @returns {void}
 */
Layer2d.prototype.setLayerSource = function (value) {
    this.layerSource = value;
};
