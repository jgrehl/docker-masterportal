import {generateSimpleMutations} from "../../../../app-store/utils/generators";
import stateFreeze from "./stateFreeze";

export default {
    ...generateSimpleMutations(stateFreeze)
};
