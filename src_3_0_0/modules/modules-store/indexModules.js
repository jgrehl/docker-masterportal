import actions from "./actionsModules";
import state from "./stateModules";

import ScaleSwitcher from "../scaleSwitcher/store/indexScaleSwitcher";
import ShareView from "../shareView/store/indexShareView";

export default {
    namespaced: true,
    actions,
    state: {...state},
    modules: {
        ScaleSwitcher: {...ScaleSwitcher},
        ShareView: {...ShareView}
    }
};
