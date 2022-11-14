import CoordToolkit from "../coordToolkit/components/CoordToolkit.vue";
import Folder from "../menu/components/MenuFolder.vue";
import GetFeatureInfo from "../getFeatureInfo/components/GetFeatureInfo.vue";
import PrintMap from "../print/components/PrintMap.vue";
import Measure from "../measure/components/MeasureInMap.vue";
import OpenConfig from "../openConfig/components/OpenConfig.vue";
import Routing from "../routing/components/RoutingTemplate.vue";
import ScaleSwitcher from "../scaleSwitcher/components/ScaleSwitcher.vue";
import ShareView from "../shareView/components/ShareView.vue";
import Contact from "../contact/components/ContactFormular.vue";
import AddWMS from "../addWMS/components/AddWMS.vue";

/**
 * User type definition
 * @typedef {Object} ModulesState
 * @property {Object} componentMap Contains all modules components
 */
const state = {
    componentMap: {
        contact: Contact,
        coordToolkit: CoordToolkit,
        folder: Folder,
        getFeatureInfo: GetFeatureInfo,
        measure: Measure,
        openConfig: OpenConfig,
        print: PrintMap,
        routing: Routing,
        scaleSwitcher: ScaleSwitcher,
        shareView: ShareView,
        addWMS: AddWMS
    }
};

export default state;
