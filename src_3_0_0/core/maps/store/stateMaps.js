/**
 * User type definition
 * @typedef {Object} MapState
 * @property {Number[]} boundingBox Current boundingBox values of the map.
 * @property {String} mode Current mode of the map e.g. 2D/3D.
*/

const state = {
    boundingBox: null,
    mode: "2D"
};

export default state;
