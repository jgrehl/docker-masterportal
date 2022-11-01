import getters from "./gettersControls";
import mutations from "./mutationsControls";
import state from "./stateControls";

import backForward from "../backForward/store/indexBackForward";
<<<<<<<< HEAD:src_3_0_0/modules/controls/controls-store/indexControls.js
import orientation from "../orientation/store/indexOrientation";
========
>>>>>>>> b0b01718e (update move files into new folder structure):src_3_0_0/modules/controls/store/indexControls.js

/**
 * controls-Module is required to be able to nest controls
 * in the store as ["controls", controlName].
 * Also holds information on control components and allows
 * addons to register themselves via mutation.
 */
export default {
    namespaced: true,
    modules: {
        backForward,
        orientation
    },
    getters,
    mutations,
    state
};
