import {vectorBase} from "@masterportal/masterportalapi/src";
import Layer2dVector from "./layer2dVector";

/**
 * Creates a 2d vector vectorbase layer.
 * @constructs
 * @extends Layer2dVector
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {void}
 */
export default function Layer2dVectorVectorbase (attributes) {
    const defaultAttributes = {
        isSecured: false
    };

    this.attributes = Object.assign(defaultAttributes, attributes);
    Layer2dVector.call(this, this.attributes);
}

Layer2dVectorVectorbase.prototype = Object.create(Layer2dVector.prototype);

/**
 * Creates the vectorbase layer.
 * @param {Object} attributes The attributes of the layer configuration.
 * @returns {void}
 */
Layer2dVectorVectorbase.prototype.createLayer = function (attributes) {
    this.layer = vectorBase.createLayer(attributes);
    this.features = attributes.features;
};
