import {generateSimpleGetters} from "../../../../app-store/utils/generators";
import stateFreeze from "./stateFreeze";

export default {
    ...generateSimpleGetters(stateFreeze)
};
