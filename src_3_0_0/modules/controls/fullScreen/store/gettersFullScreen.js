import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import stateFullScreen from "./stateFullScreen";

export default {
    ...generateSimpleGetters(stateFullScreen)
};
