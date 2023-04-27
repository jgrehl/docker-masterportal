import {generateSimpleMutations} from "../../../shared/js/utils/generators";
import stateBasemapSwitcher from "./stateBasemapSwitcher";

const mutations = {
    ...generateSimpleMutations(stateBasemapSwitcher)
};

export default mutations;
