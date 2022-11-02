import Vue from "vue";
import Vuex from "vuex";

import getters from "./getters";
import mutations from "./mutations";
import state from "./state";
import actions from "./actions";

import Controls from "../modules/controls/store/indexControls";
import Maps from "../core/maps/store/indexMaps";
import Menu from "../modules/menu/store/indexMenu";
import Modules from "../modules/store/indexModules";

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
        Modules
    }
});

export default store;
