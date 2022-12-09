import {generateSimpleGetters} from "../../shared/js/utils/generators";
import stateModules from "./stateModules";

import AddWMS from "../addWMS/components/AddWMS.vue";
import Contact from "../contact/components/ContactFormular.vue";
import CoordToolkit from "../coordToolkit/components/CoordToolkit.vue";
import Folder from "../menu/components/MenuFolder.vue";
import GetFeatureInfo from "../getFeatureInfo/components/GetFeatureInfo.vue";
import LayerInformation from "../layerInformation/components/LayerInformation.vue";
import Measure from "../measure/components/MeasureInMap.vue";
import OpenConfig from "../openConfig/components/OpenConfig.vue";
import PrintMap from "../print/components/PrintMap.vue";
import Routing from "../routing/components/RoutingTemplate.vue";
import ScaleSwitcher from "../scaleSwitcher/components/ScaleSwitcher.vue";
import ShareView from "../shareView/components/ShareView.vue";


const getters = {
    ...generateSimpleGetters(stateModules),

    componentMap: () => {
        return {
            addWMS: AddWMS,
            contact: Contact,
            coordToolkit: CoordToolkit,
            folder: Folder,
            getFeatureInfo: GetFeatureInfo,
            layerInformation: LayerInformation,
            measure: Measure,
            openConfig: OpenConfig,
            print: PrintMap,
            routing: Routing,
            scaleSwitcher: ScaleSwitcher,
            shareView: ShareView
        };
    }
};

export default getters;
