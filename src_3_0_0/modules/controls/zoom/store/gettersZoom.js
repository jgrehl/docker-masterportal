import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import stateZoom from "./stateZoom";

export default {
    ...generateSimpleGetters(stateZoom)
};
