import Vue from "vue";

export default {
    clickedMenuElement ({commit, dispatch, getters}, path) {
        const {itemType} = getters.section(path);

        commit("MenuNavigation/addEntry", path, {root: true});
        if (itemType) {
            if (itemType === "folder") {
                Vue.nextTick(() => document.getElementById(`menu-offcanvas-body-items-element-0-${path[0]}`).focus());
                return;
            }
            dispatch("setElementActive", itemType.charAt(0).toUpperCase() + itemType.slice(1));
            return;
        }
        console.error("Menu: A menu entry is missing the required value \"itemType\".");
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
