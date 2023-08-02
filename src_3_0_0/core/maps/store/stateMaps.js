/**
 * User type definition
 * @typedef {Object} MapState
 * @property {Number[]} boundingBox Current boundingBox values of the map.
 * @property {Number[]} center Current center values of the map.
 * @property {Number[]} initialCenter Initial center values of the map.
 * @property {Number} initialRotation Initial rotation of the map view.
 * @property {Number} initialZoom Initial zoom level of the map.
 * @property {String} mode Current mode of the map e.g. 2D/3D.
 * @property {Number} resolution Current resolution value of the map.
 * @property {Number} rotation Current rotation value of the map view.
 * @property {Number} scale Current scale value of the map.
 * @property {Number} zoom Current zoom level of the map view.
*/

const state = {
    boundingBox: null,
    center: null,
    initialCenter: null,
    initialRotation: null,
    initialZoom: null,
    mode: "2D",
    resolution: null,
    rotation: null,
    scale: null,
    zoom: null
};

export default state;
