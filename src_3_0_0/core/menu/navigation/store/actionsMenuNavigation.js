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
        const {itemType} = rootGetters["Menu/objectFromPath"](side, "last");

        if (itemType !== "folder") {
            dispatch("Menu/setElementActive", {moduleNamespace: itemType.charAt(0).toUpperCase() + itemType.slice(1), isActive: false}, {root: true});
        }
        commit("removeLastEntry", side);
    }
};

export default actions;
