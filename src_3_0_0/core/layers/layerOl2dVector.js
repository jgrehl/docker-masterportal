
import LayerOl2d from "./layerOl2d";

/**
 * Creates a ol 2d vector layer.
 * @param {Object} attributes Attributes of the layer.
 * @returns {void}
 */
export default function LayerOl2dVector (attributes) {
    const defaultAttributes = {
        altitudeMode: "clampToGround"
    };

    this.attributes = Object.assign(defaultAttributes, attributes);
    LayerOl2d.call(this, this.attributes);
}

LayerOl2dVector.prototype = Object.create(LayerOl2d.prototype);
