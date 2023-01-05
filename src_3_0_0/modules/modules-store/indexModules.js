import actions from "./actionsModules";
import getters from "./gettersModules";
import state from "./stateModules";

import AddWMS from "../addWMS/store/indexAddWMS";
import Contact from "../contact/store/indexContact";
import CoordToolkit from "../coordToolkit/store/indexCoordToolkit";
import FileImport from "../fileImport/store/indexFileImport";
import GetFeatureInfo from "../getFeatureInfo/store/indexGetFeatureInfo";
import Language from "../language/store/indexLanguage";
import LayerInformation from "../layerInformation/store/indexLayerInformation";
import LayerPills from "../layerPills/store/indexLayerPills";
import LayerSlider from "../layerSlider/store/indexLayerSlider";
import LayerTree from "../layerTree/store/indexLayerTree";
import Measure from "../measure/store/indexMeasure";
import MouseHover from "../mouseHover/store/indexMouseHover";
import OpenConfig from "../openConfig/store/indexOpenConfig";
import Print from "../print/store/indexPrint";
import Routing from "../routing/store/indexRouting";
import ScaleSwitcher from "../scaleSwitcher/store/indexScaleSwitcher";
import ShareView from "../shareView/store/indexShareView";
import StyleVT from "../styleVT/store/indexStyleVT";
import WfsSearch from "../wfsSearch/store/indexWfsSearch";

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
        FileImport: {...FileImport},
        GetFeatureInfo: {...GetFeatureInfo},
        Language: {...Language},
        LayerInformation: {...LayerInformation},
        LayerPills: {...LayerPills},
        LayerSlider: {...LayerSlider},
        LayerTree: {...LayerTree},
        Measure: {...Measure},
        MouseHover: {...MouseHover},
        OpenConfig: {...OpenConfig},
        Routing: {...Routing},
        Print: {...Print},
        ScaleSwitcher: {...ScaleSwitcher},
        ShareView: {...ShareView},
        StyleVT: {...StyleVT},
        WfsSearch: {...WfsSearch}
    }
};
