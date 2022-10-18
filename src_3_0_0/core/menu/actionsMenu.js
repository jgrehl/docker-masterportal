export default {
    clickedMenuElement ({commit, dispatch, getters}, path) {
        const {itemType} = getters.section(path);

        commit("MenuNavigation/addEntry", path, {root: true});
        if (itemType && itemType !== "folder") {
            dispatch("setElementActive", itemType.charAt(0).toUpperCase() + itemType.slice(1));
        }
    },
    setElementActive ({commit, dispatch}, moduleNamespace) {
        const setActiveName = `Menu/${moduleNamespace}/setActive`;

        if (Object.keys(this._actions).includes(setActiveName)) {
            dispatch(setActiveName, true, {root: true});
        }
        else {
            commit(setActiveName, true, {root: true});
        }
    }
};
