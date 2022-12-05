import actions from "./actionsModules";
import getters from "./gettersModules";
import state from "./stateModules";

import AddWMS from "../addWMS/store/indexAddWMS";
import Contact from "../contact/store/indexContact";
import CoordToolkit from "../coordToolkit/store/indexCoordToolkit";
import GetFeatureInfo from "../getFeatureInfo/store/indexGetFeatureInfo";
import LayerInformation from "../layerInformation/store/indexLayerInformation";
import Measure from "../measure/store/indexMeasure";
import OpenConfig from "../openConfig/store/indexOpenConfig";
import Print from "../print/store/indexPrint";
import Routing from "../routing/store/indexRouting";
import ScaleSwitcher from "../scaleSwitcher/store/indexScaleSwitcher";
import ShareView from "../shareView/store/indexShareView";

export default {
    namespaced: true,
    actions,
    getters,
    state: {...state},
    modules: {
        // modules must be copied, else tests fail in watch mode
        AddWMS: {...AddWMS},
        Contact: {...Contact},
        CoordToolkit: {...CoordToolkit},
        GetFeatureInfo: {...GetFeatureInfo},
        LayerInformation: {...LayerInformation},
        Measure: {...Measure},
        OpenConfig: {...OpenConfig},
        Routing: {...Routing},
        Print: {...Print},
        ScaleSwitcher: {...ScaleSwitcher},
        ShareView: {...ShareView}
    }
};
