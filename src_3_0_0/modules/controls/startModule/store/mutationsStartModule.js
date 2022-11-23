import {generateSimpleMutations} from "../../../../shared/js/utils/generators";
import stateStartModule from "./stateStartModule";

export default {
    ...generateSimpleMutations(stateStartModule)
};
