import actions from "./actionsModules";
import state from "./stateModules";

import ScaleSwitcher from "../scaleSwitcher/store/indexScaleSwitcher";

export default {
    namespaced: true,
    actions,
    state: {...state},
    modules: {
        ScaleSwitcher
    }
};
