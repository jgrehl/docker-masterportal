import actions from "./actionsModules";
import getters from "./gettersModules";
import state from "./stateModules";

import CoordToolkit from "../coordToolkit/store/indexCoordToolkit";
import GetFeatureInfo from "../getFeatureInfo/store/indexGetFeatureInfo";
import Measure from "../measure/store/indexMeasure";
import OpenConfig from "../openConfig/store/indexOpenConfig";
import Print from "../print/store/indexPrint";
import ScaleSwitcher from "../scaleSwitcher/store/indexScaleSwitcher";
import ShareView from "../shareView/store/indexShareView";
import Contact from "../contact/store/indexContact";
import AddWMS from "../addWMS/store/indexAddWMS";

export default {
    namespaced: true,
    actions,
    getters,
    state: {...state},
    modules: {
        // modules must be copied, else tests fail in watch mode
        CoordToolkit: {...CoordToolkit},
        GetFeatureInfo: {...GetFeatureInfo},
        Measure: {...Measure},
        OpenConfig: {...OpenConfig},
        Print: {...Print},
        ScaleSwitcher: {...ScaleSwitcher},
        ShareView: {...ShareView},
        Contact: {...Contact},
        AddWMS: {...AddWMS}
    }
};
