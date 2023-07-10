/**
 * User type definition
 * @property {Boolean} activatedExpandable Controls are expandend.
 * @property {Object} baselayerIds Ids of the baselayers form config
 * @property {Object}  topBaselayerId id of the baselayer that is on the top (highest zIndex)
 */
const state = {
    activatedExpandable: false,
    baselayerIds: [],
    topBaselayerId: null
};

export default state;
