import {generateSimpleGetters} from "../../app-store/utils/generators";
import stateControls from "./stateControls";

const getters = {
    ...generateSimpleGetters(stateControls)
};

export default getters;
