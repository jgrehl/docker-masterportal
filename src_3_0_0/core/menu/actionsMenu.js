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
            dispatch("setElementActive", {moduleNamespace: itemType.charAt(0).toUpperCase() + itemType.slice(1), isActive: true});
            return;
        }
        console.error("Menu: A menu entry is missing the required value \"itemType\".");
    },
    setElementActive ({commit, dispatch}, {moduleNamespace, isActive}) {
        const setActiveName = `Menu/${moduleNamespace}/setActive`;

        if (Object.keys(this._actions).includes(setActiveName)) {
            dispatch(setActiveName, isActive, {root: true});
        }
        else {
            commit(setActiveName, isActive, {root: true});
        }
    }
};
