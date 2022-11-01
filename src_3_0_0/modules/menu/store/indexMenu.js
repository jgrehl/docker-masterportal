import actions from "./actionsMenu";
import getters from "./gettersMenu";
import mutations from "./mutationsMenu";
import state from "./stateMenu";

import Navigation from "../navigation/store/indexMenuNavigation";
import ScaleSwitcher from "../../scaleSwitcher/store/indexScaleSwitcher";

export default {
    namespaced: true,
    actions,
    getters,
    mutations,
    state: {...state},
    modules: {
        Navigation,
        ScaleSwitcher
    }
};
