import state from "./stateModules";

import ScaleSwitcher from "../scaleSwitcher/store/indexScaleSwitcher";

export default {
    namespaced: true,
    state: {...state},
    modules: {
        ScaleSwitcher
    }
};
