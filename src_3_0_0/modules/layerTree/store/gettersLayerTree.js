import {generateSimpleGetters} from "../../../shared/js/utils/generators";
import stateLayerTree from "./stateLayerTree";

/**
 * The getters for the LayerTree.
 * @module modules/layerTree/store/getters
 */
const getters = {
    ...generateSimpleGetters(stateLayerTree)
};

export default getters;
