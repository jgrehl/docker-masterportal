import {generateSimpleGetters} from "../../shared/js/utils/generators";
import stateModules from "./stateModules";

import AddWMS from "../addWMS/components/AddWMS.vue";
import Contact from "../contact/components/ContactFormular.vue";
import CoordToolkit from "../coordToolkit/components/CoordToolkit.vue";
import FeatureLister from "../featureLister/components/FeatureLister.vue";
import FileImport from "../fileImport/components/FileImport.vue";
import Folder from "../menu/components/MenuFolder.vue";
import GetFeatureInfo from "../getFeatureInfo/components/GetFeatureInfo.vue";
import Language from "../language/components/LanguageItem.vue";
import LayerInformation from "../layerInformation/components/LayerInformation.vue";
import LayerSelection from "../layerTree/layerSelection/components/LayerSelection.vue";
import LayerTree from "../layerTree/components/LayerTree.vue";
import LayerPills from "../layerPills/components/LayerPills.vue";
import LayerSlider from "../layerSlider/components/LayerSlider.vue";
import Measure from "../measure/components/MeasureInMap.vue";
import MouseHover from "../mouseHover/components/MouseHover.vue";
import OpenConfig from "../openConfig/components/OpenConfig.vue";
import PrintMap from "../print/components/PrintMap.vue";
import Routing from "../routing/components/RoutingTemplate.vue";
import ScaleSwitcher from "../scaleSwitcher/components/ScaleSwitcher.vue";
import Shadow from "../shadow/components/ShadowTool.vue";
import ShareView from "../shareView/components/ShareView.vue";
import StyleVT from "../styleVT/components/StyleVT.vue";
import WfsSearch from "../wfsSearch/components/WfsSearch.vue";


const getters = {
    ...generateSimpleGetters(stateModules),

    componentMap: () => {
        return {
            addWMS: AddWMS,
            contact: Contact,
            coordToolkit: CoordToolkit,
            featureLister: FeatureLister,
            fileImport: FileImport,
            folder: Folder,
            getFeatureInfo: GetFeatureInfo,
            language: Language,
            layerInformation: LayerInformation,
            layerTree: LayerTree,
            layerSelection: LayerSelection,
            layerPills: LayerPills,
            layerSlider: LayerSlider,
            measure: Measure,
            mouseHover: MouseHover,
            openConfig: OpenConfig,
            print: PrintMap,
            routing: Routing,
            scaleSwitcher: ScaleSwitcher,
            shadow: Shadow,
            shareView: ShareView,
            styleVT: StyleVT,
            wfsSearch: WfsSearch
        };
    }
};

export default getters;
