import Folder from "../menu/components/MenuFolder.vue";
import PrintMap from "../print/components/PrintMap.vue";
import Measure from "../measure/components/MeasureInMap.vue";
import OpenConfig from "../openConfig/components/OpenConfig.vue";
import ScaleSwitcher from "../scaleSwitcher/components/ScaleSwitcher.vue";
import ShareView from "../shareView/components/ShareView.vue";
import CoordToolkit from "../coordToolkit/components/CoordToolkit.vue";
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
        measure: Measure,
        openConfig: OpenConfig,
        print: PrintMap,
        scaleSwitcher: ScaleSwitcher,
        shareView: ShareView,
        addWMS: AddWMS
    }
};

export default state;
