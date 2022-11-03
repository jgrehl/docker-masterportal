import Folder from "../menu/components/MenuFolder.vue";
import ScaleSwitcher from "../scaleSwitcher/components/ScaleSwitcher.vue";
import ShareView from "../shareView/components/ShareView.vue";

/**
 * User type definition
 * @typedef {Object} ModulesState
 * @property {Object} componentMap Contains all modules components
 */
const state = {
    componentMap: {
        folder: Folder,
        scaleSwitcher: ScaleSwitcher,
        shareView: ShareView
    }
};

export default state;
