import {generateSimpleGetters} from "../../../shared/js/utils/generators";
import stateBasemapSwitcher from "./stateBasemapSwitcher";

const getters = {
    ...generateSimpleGetters(stateBasemapSwitcher)
};

export default getters;
