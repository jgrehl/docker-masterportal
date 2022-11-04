import Folder from "../menu/components/MenuFolder.vue";
import OpenConfig from "../openConfig/components/OpenConfig.vue";
import ScaleSwitcher from "../scaleSwitcher/components/ScaleSwitcher.vue";
import ShareView from "../shareView/components/ShareView.vue";
import CoordToolkit from "../coordToolkit/components/CoordToolkit.vue";

/**
 * User type definition
 * @typedef {Object} ModulesState
 * @property {Object} componentMap Contains all modules components
 */
const state = {
    componentMap: {
        coordToolkit: CoordToolkit,
        folder: Folder,
        openConfig: OpenConfig,
        scaleSwitcher: ScaleSwitcher,
        shareView: ShareView
    }
};

export default state;
