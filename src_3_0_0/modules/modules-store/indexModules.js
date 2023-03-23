import actions from "./actionsModules";
import getters from "./gettersModules";
import state from "./stateModules";

import AddWMS from "../addWMS/store/indexAddWMS";
import BufferAnalysis from "../bufferAnalysis/store/indexBufferAnalysis";
import Contact from "../contact/store/indexContact";
import CoordToolkit from "../coordToolkit/store/indexCoordToolkit";
import FeatureLister from "../featureLister/store/indexFeatureLister";
import FileImport from "../fileImport/store/indexFileImport";
import GetFeatureInfo from "../getFeatureInfo/store/indexGetFeatureInfo";
import GraphicalSelect from "../../shared/modules/graphicalSelect/store/indexGraphicalSelect";
import Language from "../language/store/indexLanguage";
import LayerClusterToggler from "../layerClusterToggler/store/indexLayerClusterToggler";
import LayerInformation from "../layerInformation/store/indexLayerInformation";
import LayerPills from "../layerPills/store/indexLayerPills";
import LayerSelection from "../layerSelection/store/indexLayerSelection";
import LayerSlider from "../layerSlider/store/indexLayerSlider";
import LayerTree from "../layerTree/store/indexLayerTree";
import Legend from "../legend/store/indexLegend";
import Measure from "../measure/store/indexMeasure";
import MouseHover from "../mouseHover/store/indexMouseHover";
import News from "../news/store/indexNewsView";
import OpenConfig from "../openConfig/store/indexOpenConfig";
import PortalFooter from "../portalFooter/store/indexPortalFooter";
import Print from "../print/store/indexPrint";
import Routing from "../routing/store/indexRouting";
import ScaleSwitcher from "../scaleSwitcher/store/indexScaleSwitcher";
import SelectFeatures from "../selectFeatures/store/indexSelectFeatures";
import Shadow from "../shadow/store/indexShadow";
import ShareView from "../shareView/store/indexShareView";
import StyleVT from "../styleVT/store/indexStyleVT";
import WfsSearch from "../wfsSearch/store/indexWfsSearch";
import Wfst from "../wfst/store/indexWfst";

export default {
    namespaced: true,
    actions,
    getters,
    state: {...state},
    modules: {
        // modules must be copied, else tests fail in watch mode
        AddWMS: {...AddWMS},
        BufferAnalysis: {...BufferAnalysis},
        Contact: {...Contact},
        CoordToolkit: {...CoordToolkit},
        FeatureLister: {...FeatureLister},
        FileImport: {...FileImport},
        GetFeatureInfo: {...GetFeatureInfo},
        GraphicalSelect: {...GraphicalSelect},
        Language: {...Language},
        LayerClusterToggler: {...LayerClusterToggler},
        LayerInformation: {...LayerInformation},
        LayerPills: {...LayerPills},
        LayerSelection: {...LayerSelection},
        LayerSlider: {...LayerSlider},
        LayerTree: {...LayerTree},
        Legend: {...Legend},
        Measure: {...Measure},
        MouseHover: {...MouseHover},
        News: {...News},
        OpenConfig: {...OpenConfig},
        Routing: {...Routing},
        PortalFooter: {...PortalFooter},
        Print: {...Print},
        ScaleSwitcher: {...ScaleSwitcher},
        SelectFeatures: {...SelectFeatures},
        Shadow: {...Shadow},
        ShareView: {...ShareView},
        StyleVT: {...StyleVT},
        WfsSearch: {...WfsSearch},
        Wfst: {...Wfst}
    }
};
