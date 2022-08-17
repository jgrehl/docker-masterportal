
import Layer2d from "./layer2d";

/**
 * Creates a 2d vector layer.
 * @abstract
 * @constructs
 * @extends Layer2d
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {void}
 */
export default function Layer2dVector (attributes) {
    const defaultAttributes = {
        altitudeMode: "clampToGround"
    };

    this.attributes = Object.assign(defaultAttributes, attributes);
    Layer2d.call(this, this.attributes);
}

Layer2dVector.prototype = Object.create(Layer2d.prototype);
