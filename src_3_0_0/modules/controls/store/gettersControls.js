import {generateSimpleGetters} from "../../../shared/js/utils/generators";
import stateControls from "./stateControls";

const getters = {
    ...generateSimpleGetters(stateControls)
};

export default getters;
