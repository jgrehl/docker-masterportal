/**
 * User type definition
 * @property {Boolean} activatedExpandable Controls are expandend.
 * @property {Object} backgroundLayerIds Ids of the backgroundlayers form config
 * @property {Object}  topBackgroundLayerId id of the backgroundlayer that is on the top (highest zIndex)
 */
const state = {
    activatedExpandable: false,
    backgroundLayerIds: [],
    topBackgroundLayerId: null
};

export default state;
