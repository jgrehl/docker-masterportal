/**
 * Menu state definition.
 * @typedef {Object} LayerTreeState
 * @property {String} menuSide Specifies in which menu the layerTree should be rendered
 * @property {String} type The type of the layerTree component.
 * @property {String} delay Length of the delay on a touch device.
 * @property {Boolean} delayOnTouchOnly Specifies whether a delay should be used for a toch event.
 */
export default {
    menuSide: "mainMenu",
    type: "layerTree",

    delay: "500",
    delayOnTouchOnly: true
};
