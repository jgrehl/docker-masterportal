import actions from "./actionsMenu";
import getters from "./gettersMenu";
import mutations from "./mutationsMenu";
import state from "./stateMenu";

import ScaleSwitcher from "../../modules/scaleSwitcher/store/indexScaleSwitcher";

export default {
    namespaced: true,
    actions,
    getters,
    mutations,
    state,
    modules: {
        ScaleSwitcher
    }
};
