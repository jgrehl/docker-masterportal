import {generateSimpleGetters} from "../../shared/js/utils/generators";
import stateModules from "./stateModules";

const getters = {
    ...generateSimpleGetters(stateModules)
};

export default getters;
