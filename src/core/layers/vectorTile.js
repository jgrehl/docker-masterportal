import Layer from "./layer";
import store from "../../app-store";

/**
 * Creates a layer of type vectorTile.
 * @param {Object} attrs  attributes of the layer
 * @returns {void}
 */
export default function VectorTileLayer (attrs) {
  
}

// Link prototypes and add prototype methods, means VTL uses all methods and properties of Layer
VectorTileLayer.prototype = Object.create(Layer.prototype);
