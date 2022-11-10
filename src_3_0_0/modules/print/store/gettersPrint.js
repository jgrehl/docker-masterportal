import {generateSimpleGetters} from "../../../shared/js/utils/generators";
import statePrint from "./statePrint";

const getters = {
    ...generateSimpleGetters(statePrint)
};

export default getters;
