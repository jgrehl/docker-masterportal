import Vue from "vue";
import Vuex from "vuex";

import getters from "./getters";
import mutations from "./mutations";
import state from "./state";
import actions from "./actions";

import Controls from "../modules/controls/indexControls";
import Maps from "../core/maps/store/indexMaps";
import Menu from "../core/menu/indexMenu";
import MenuNavigation from "../core/menu/navigation/store/indexMenuNavigation";
import Modules from "../core/modules/store/indexModules";

Vue.use(Vuex);

const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    modules: {
        Controls: {...Controls},
        Maps,
        Menu,
        MenuNavigation,
        Modules: {...Modules}
    }
});

export default store;
