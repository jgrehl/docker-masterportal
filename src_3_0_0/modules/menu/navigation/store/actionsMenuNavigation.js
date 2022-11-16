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

        if (type !== "folder") {
            dispatch("Menu/setElementActive", {moduleNamespace: upperFirst(type), isActive: false}, {root: true});
        }
        Vue.nextTick(() => commit("removeLastEntry", side));
    },

    /**
     * Resets one side of menu.
     * @param {Object} param store context
     * @param {Object} param.commit the commit
     * @param {String} side The menu side to reset.
     * @returns {void}
     */
    resetMenu ({commit}, side) {
        commit("setEntry", side);
    }
};

export default actions;
