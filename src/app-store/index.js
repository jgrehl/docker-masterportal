import Vue from "vue";
import Vuex from "vuex";

import Alerting from "../modules/alerting/store/indexAlerting";
import ScaleSwitcher from "../modules/tools/scale/store/indexScaleSwitcher";
import SupplyCoord from "../modules/tools/supplyCoord/store/indexSupplyCoord";
import ScaleLine from "../modules/scaleLine/store/indexScaleLine";
import Title from "../modules/title/store/indexTitle";
import Map from "../modules/map/store/indexMap";

import toolsActions from "../modules/tools/actionsTools";
import getters from "./getters";
import mutations from "./mutations";
import state from "./state";
import actions from "./actions";

import controlsModule from "../modules/controls/indexControls";

import isMobile from "../utils/isMobile";

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        Map,
        Alerting,
        Tools: {
            namespaced: true,
            modules: {
                // add here other Tools
                SupplyCoord,
                ScaleSwitcher
            },
            actions: toolsActions
        },
        controls: {
            ...controlsModule
        },
        ScaleLine,
        Title: Title
    },
    state,
    mutations,
    getters,
    actions
});

export default store;

/**
 * Debounce function
 * @param {function} callback - The callback form debounce function.
 * @param {number} wait - Wait before the callback function is called.
 * @returns {*} todo
 */
function debounce (callback, wait) {
    let timeout;

    return (...args) => {
        const that = this;

        clearTimeout(timeout);
        timeout = setTimeout(() => callback.apply(that, args), wait);
    };
}


// resize update
window.addEventListener("resize", debounce(() => {
    const nextIsMobile = isMobile();

    if (nextIsMobile !== store.state.mobile) {
        store.commit("setMobile", nextIsMobile);
    }
}, 250));

// TODO supposed to allow hot reloading vuex getters/mutations without reloading MP - doesn't work for some reason
// copied without thought from admintool, so maybe I'm missing a parameter somewhere
/* istanbul ignore next */
if (module.hot) {
    module.hot.accept([
        "./getters",
        "./mutations"
    ], () => {
        // see https://vuex.vuejs.org/guide/hot-reload.html - need to do disable rule here
        /* eslint-disable global-require */
        const newGetters = require("./getters").default,
            newMutations = require("./mutations").default;
        /* eslint-enable global-require */

        store.hotUpdate({
            getters: newGetters,
            mutations: newMutations
        });
    });
}
