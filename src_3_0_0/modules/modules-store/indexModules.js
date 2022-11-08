import actions from "./actionsModules";
import state from "./stateModules";

import OpenConfig from "../openConfig/store/indexOpenConfig";
import ScaleSwitcher from "../scaleSwitcher/store/indexScaleSwitcher";
import ShareView from "../shareView/store/indexShareView";

export default {
    namespaced: true,
    actions,
    state: {...state},
    modules: {
        OpenConfig: {...OpenConfig},
        ScaleSwitcher: {...ScaleSwitcher},
        ShareView: {...ShareView}
    }
};
