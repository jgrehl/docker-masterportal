import Vue from "vue";
import upperFirst from "../../../../shared/js/utils/upperFirst";

const actions = {
    /**
     * Properly deactivates an element if it is not a folder
     * and removes its entry from the navigation.
     * @param {Object} context Vuex context object.
     * @param {String} side Side on which the navigation action occurred.
     * @returns {void}
     */
    navigateBack ({commit, dispatch, rootGetters}, side) {
        // eslint-disable-next-line new-cap
        const {type} = rootGetters["Menu/objectFromPath"](side, "last");

        if (type && type !== "folder") {
            dispatch("Menu/setElementActive", {moduleNamespace: upperFirst(type), isActive: false}, {root: true});
        }
        Vue.nextTick(() => commit("removeLastEntry", side));
    }
};

export default actions;
