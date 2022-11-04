import actions from "./actionsModules";
import state from "./stateModules";

import OpenConfig from "../openConfig/store/indexOpenConfig";
import ScaleSwitcher from "../scaleSwitcher/store/indexScaleSwitcher";
import ShareView from "../shareView/store/indexShareView";
import CoordToolkit from "../coordToolkit/store/indexCoordToolkit";

export default {
    namespaced: true,
    actions,
    state: {...state},
    modules: {
        // modules must be copied, else tests fail in watch mode
        OpenConfig: {...OpenConfig},
        CoordToolkit: {...CoordToolkit},
        ScaleSwitcher: {...ScaleSwitcher},
        ShareView: {...ShareView}
    }
};
