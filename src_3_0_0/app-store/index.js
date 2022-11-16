import {createStore} from "vuex";

import getters from "./getters";
import mutations from "./mutations";
import state from "./state";
import actions from "./actions";

import Controls from "../modules/controls/controls-store/indexControls";
import Alerting from "../modules/alerting/store/indexAlerting";
import Maps from "../core/maps/store/indexMaps";
import Menu from "../modules/menu/menu-store/indexMenu";
import Modules from "../modules/modules-store/indexModules";
import LayerPills from "../modules/layerPills/store/indexLayerPills";

const store = createStore({
    state,
    getters,
    mutations,
    actions,
    modules: {
        Controls,
        Alerting,
        Maps,
        Menu,
        Modules,
        LayerPills
    }
});

export default store;
