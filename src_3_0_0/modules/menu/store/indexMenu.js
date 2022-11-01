import actions from "./actionsMenu";
import getters from "./gettersMenu";
import mutations from "./mutationsMenu";
import state from "./stateMenu";

import Navigation from "../navigation/store/indexMenuNavigation";
<<<<<<<< HEAD:src_3_0_0/modules/menu/menu-store/indexMenu.js
========
import ScaleSwitcher from "../../scaleSwitcher/store/indexScaleSwitcher";
>>>>>>>> 94d76c76d3 (update move files into new folder structure):src_3_0_0/modules/menu/store/indexMenu.js

export default {
    namespaced: true,
    actions,
    getters,
    mutations,
    state: {...state},
    modules: {
<<<<<<<< HEAD:src_3_0_0/modules/menu/menu-store/indexMenu.js
        Navigation
========
        Navigation,
        ScaleSwitcher
>>>>>>>> 94d76c76d3 (update move files into new folder structure):src_3_0_0/modules/menu/store/indexMenu.js
    }
};
