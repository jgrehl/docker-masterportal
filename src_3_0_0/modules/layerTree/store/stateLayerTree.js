/**
 * Menu state definition.
 * @typedef {Object} LayerTreeState
 * @property {String} menuSide Specifies in which menu the layerTree should be rendered
 * @property {String} type The type of the layerTree component.
 * @property {String} delay Length of the delay on a touch device in milliseconds.
 * @property {Boolean} delayOnTouchOnly Specifies whether a delay should be used for a toch event.
 * @property {Boolean} removeOnSpill Indicates whether layers with spill can be removed.
 * @property {Number} touchStartThreshold This option sets the minimum pointer movement that must occur before the delayed sorting is cancelled.
 */
export default {
    menuSide: "mainMenu",
    type: "layerTree",

    delay: "500",
    delayOnTouchOnly: true,
    removeOnSpill: true,
    touchStartThreshold: 3
};
