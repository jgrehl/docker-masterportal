import BackForward from "../backForward/components/BackForward.vue";
import Button3d from "../button3d/components/Button3dItem.vue";
import FreezeScreen from "../freeze/components/FreezeScreen.vue";
import FullScreen from "../fullScreen/components/FullScreen.vue";
import TotalView from "../totalView/components/TotalView.vue";
import ZoomInAndOut from "../zoom/components/ZoomInAndOut.vue";
import Orientation from "../orientation/components/OrientationItem.vue";

/**
 * User type definition
 * @typedef {Object} controls
 * @property {Object} componentMap Maps config.json.md control key to component.
 * @property {Boolean} activatedExpandable Controls are expandend.
 */
const state = {
    componentMap: {
        backForward: BackForward,
        button3d: Button3d,
        freeze: FreezeScreen,
        fullScreen: FullScreen,
        totalView: TotalView,
        zoom: ZoomInAndOut,
        orientation: Orientation
    },

    activatedExpandable: false
};

export default state;
