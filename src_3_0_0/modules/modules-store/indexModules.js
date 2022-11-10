import actions from "./actionsModules";
import state from "./stateModules";

import CoordToolkit from "../coordToolkit/store/indexCoordToolkit";
import OpenConfig from "../openConfig/store/indexOpenConfig";
import Print from "../print/store/indexPrint";
import ScaleSwitcher from "../scaleSwitcher/store/indexScaleSwitcher";
import ShareView from "../shareView/store/indexShareView";

export default {
    namespaced: true,
    actions,
    state: {...state},
    modules: {
        // modules must be copied, else tests fail in watch mode
        CoordToolkit: {...CoordToolkit},
        OpenConfig: {...OpenConfig},
        Print: {...Print},
        ScaleSwitcher: {...ScaleSwitcher},
        ShareView: {...ShareView}
    }
};
