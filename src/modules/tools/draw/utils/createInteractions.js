import {Select, Modify} from "ol/interaction.js";
import Draw, {createRegularPolygon} from "ol/interaction/Draw.js";
import createStyleModule from "./style/createStyle";

/**
 * Creates a draw interaction to draw features on the map.
 *
 * @param {Object} state actions context object.
 * @param {Object} styleSettings the settings of the current style
 * @returns {module:ol/interaction/Draw} draw interaction
 */
function createDrawInteraction (state, styleSettings) {
    let draw;

    if (state.drawType.id === "drawSquare") {
        draw = new Draw({
            source: state.layer.getSource(),
            type: "Circle",
            geometryFunction: createRegularPolygon(4),
            style: createStyleModule.createStyle(state, styleSettings)
        });
    }
    else {
        draw = new Draw({
            source: state.layer.getSource(),
            type: state.drawType.geometry,
            style: createStyleModule.createStyle(state, styleSettings),
            freehand: state.freeHand
        });
    }
    return draw;
}

/**
 * Creates a modify interaction and returns it.
 *
 * @param  {module:ol/layer/Vector} layer The layer in which the features are drawn.
 * @returns {module:ol/interaction/Modify} The modify interaction.
 */
function createModifyInteraction (layer) {
    return new Modify({
        source: layer.getSource()
    });
}
/**
 * Creates a modifyAttributes interaction and returns it.
 *
 * @param  {module:ol/layer/Vector} layer The layer in which the features are drawn.
 * @returns {module:ol/interaction/Modify} The modify interaction.
 */
function createModifyAttributesInteraction (layer) {
    return new Modify({
        source: layer.getSource()
    });
}

/**
 * Creates a select interaction (for deleting features) and returns it.
 *
 * @param {module:ol/layer/Vector} layer The layer in which the features are drawn.
 * @param {Number} [hitTolerance=0] - Hit-detection tolerance. Pixels inside the radius around the given position will be checked for features.
 * @returns {module:ol/interaction/Select} The select interaction.
 */
function createSelectInteraction (layer, hitTolerance = 0) {
    return new Select({
        layers: [layer],
        hitTolerance: hitTolerance
    });
}

export {
    createDrawInteraction,
    createModifyInteraction,
    createModifyAttributesInteraction,
    createSelectInteraction
};
