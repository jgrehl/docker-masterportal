import actions from "./actionsMenu";
import getters from "./gettersMenu";
import mutations from "./mutationsMenu";
import state from "./stateMenu";

import Navigation from "../navigation/store/indexMenuNavigation";
<<<<<<< HEAD
<<<<<<<< HEAD:src_3_0_0/modules/menu/menu-store/indexMenu.js
========
import ScaleSwitcher from "../../scaleSwitcher/store/indexScaleSwitcher";
>>>>>>>> b0b01718e (update move files into new folder structure):src_3_0_0/modules/menu/store/indexMenu.js
=======
import ScaleSwitcher from "../../scaleSwitcher/store/indexScaleSwitcher";
>>>>>>> 673d450ae (update rename store folders and move loaderOverlay to app-store/js)

export default {
    namespaced: true,
    actions,
    getters,
    mutations,
    state: {...state},
    modules: {
<<<<<<< HEAD
<<<<<<<< HEAD:src_3_0_0/modules/menu/menu-store/indexMenu.js
        Navigation
========
        Navigation,
        ScaleSwitcher
>>>>>>>> b0b01718e (update move files into new folder structure):src_3_0_0/modules/menu/store/indexMenu.js
=======
        Navigation,
        ScaleSwitcher
>>>>>>> 673d450ae (update rename store folders and move loaderOverlay to app-store/js)
    }
};
