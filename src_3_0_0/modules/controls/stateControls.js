import BackForward from "./backForward/components/BackForward.vue";
import Button3d from "./button3d/components/Button3dItem.vue";
import FullScreen from "./fullScreen/components/FullScreen.vue";

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
        fullScreen: FullScreen
    },
    mobileHiddenControls: ["fullScreen"],
    expandableControls: []
};

export default state;
