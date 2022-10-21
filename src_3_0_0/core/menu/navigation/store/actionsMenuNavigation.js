const actions = {
    navigateBack ({commit, dispatch, rootGetters}, side) {
        // eslint-disable-next-line new-cap
        const {itemType} = rootGetters["Menu/objectFromPath"]("mainMenu", "last");

        if (itemType !== "folder") {
            dispatch("Menu/setElementActive", {moduleNamespace: itemType.charAt(0).toUpperCase() + itemType.slice(1), isActive: false}, {root: true});
        }
        commit("removeLastEntry", side);
    }
};

export default actions;
