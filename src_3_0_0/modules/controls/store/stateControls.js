import BackForward from "../backForward/components/BackForward.vue";
import Button3d from "../button3d/components/Button3dItem.vue";
import FreezeScreen from "../freeze/components/FreezeScreen.vue";
import FullScreen from "../fullScreen/components/FullScreen.vue";
import TotalView from "../totalView/components/TotalView.vue";
import ZoomInAndOut from "../zoom/components/ZoomInAndOut.vue";
<<<<<<<< HEAD:src_3_0_0/modules/controls/controls-store/stateControls.js
import Orientation from "../orientation/components/OrientationItem.vue";
========
>>>>>>>> b0b01718e (update move files into new folder structure):src_3_0_0/modules/controls/store/stateControls.js

/**
 * User type definition
 * @typedef {Object} controls
 * @property {Object} componentMap Maps config.json.md control key to component.
 * @property {Object[]} mobileHiddenControls config.json.md control keys where the matching element is to be hidden in mobile mode.
 * @property {Object[]} expandableControls Controls that are rendered in the expandable area.
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
    mobileHiddenControls: [
        "backForward",
        "freeze",
        "fullScreen",
        "totalView"
    ],
    expandableControls: []
};

export default state;
