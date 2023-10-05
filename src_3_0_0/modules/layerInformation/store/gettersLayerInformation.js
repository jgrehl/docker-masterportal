import {generateSimpleGetters} from "../../../shared/js/utils/generators";
import stateLayerInformation from "./stateLayerInformation";

/**
 * The getters for the layerInformation.
 * @module modules/layerInformation/store/gettersLayerInformation
 */
export default {
    ...generateSimpleGetters(stateLayerInformation)
};
