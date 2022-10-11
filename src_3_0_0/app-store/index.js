import Vue from "vue";
import Vuex from "vuex";

import getters from "./getters";
import mutations from "./mutations";
import state from "./state";
import actions from "./actions";

import Controls from "../modules/controls/indexControls";
import Maps from "../core/maps/store/indexMaps";
import Menu from "../core/menu/indexMenu";
import Modules from "../core/modules/store/indexModules";
import PortalTitle from "../core/menu/portalTitle/store/indexPortalTitle";

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
        Modules: {...Modules},
        PortalTitle
    }
});

export default store;
