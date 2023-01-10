import sinon from "sinon";
import {Vector as VectorLayer} from "ol/layer";

/**
 * Creates an array with a given number of Layer Objects
 *
 * @param {number} count the number of returned array element
 *
 * @return {Array} the array of layer objects
 */
function createLayersArray (count) {
    const layers = [];


    for (let i = 0; i < count; i++) {
        const layer = {
            "id": i,
            "name": "Layer-" + i,
            "typ": "WFS",
            "visibility": true
        };

        layers.push(layer);
    }
    return layers;
}

export {
    createLayersArray
};
