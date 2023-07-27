import {generateSimpleMutations} from "../../../shared/js/utils/generators";
import stateDraw from "./stateDraw";

/**
 * The mutations for the draw module.
 * @module modules/draw/store/mutations
 */
export default {
    ...generateSimpleMutations(stateDraw)
};
