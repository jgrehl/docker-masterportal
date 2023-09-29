import {generateSimpleMutations} from "../../../../shared/js/utils/generators";
import stateRotationItem from "./stateRotationItem.js";

export default {
    ...generateSimpleMutations(stateRotationItem)
};
