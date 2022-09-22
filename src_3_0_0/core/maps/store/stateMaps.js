/**
 * User type definition
 * @typedef {Object} MapState
 * @property {Number[]} boundingBox Current boundingBox values of the map.
 * @property {String} mode Current mode of the map e.g. 2D/3D.
 * @property {Number} resolution Current resolution value of the map.
 * @property {Number} scale Current scale value of the map.
 * @property {Number} zoom Current zoom level of the map view.
*/

const state = {
    boundingBox: null,
    mode: "2D",
    resolution: null,
    scale: null,
    zoom: null
};

export default state;
