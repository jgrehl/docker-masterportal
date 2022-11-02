import {generateSimpleMutations} from "../../../../app-store/utils/generators";
import stateZoom from "./stateZoom";

export default {
    ...generateSimpleMutations(stateZoom)
};
