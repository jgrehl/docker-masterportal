import Vue from "vue";
import Vuex from "vuex";

import getters from "./getters";
import mutations from "./mutations";
import state from "./state";
import actions from "./actions";

import Controls from "../modules/controls/controls-store/indexControls";
import Maps from "../core/maps/store/indexMaps";
import Menu from "../modules/menu/menu-store/indexMenu";
import Modules from "../modules/modules-store/indexModules";

Vue.use(Vuex);

const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    modules: {
        Controls,
        Maps,
        Menu,
        Modules
    }
});

export default store;
