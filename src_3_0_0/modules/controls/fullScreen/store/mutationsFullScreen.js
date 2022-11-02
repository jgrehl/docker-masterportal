import {generateSimpleMutations} from "../../../../app-store/utils/generators";
import stateFullScreen from "./stateFullScreen";

export default {
    ...generateSimpleMutations(stateFullScreen)
};
