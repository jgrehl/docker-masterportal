import state from "./stateRotationItem";
import getters from "./gettersRotationItem";
import mutations from "./mutationsRotationItem.js";

export default {
    namespaced: true,
    state: {...state},
    getters,
    mutations
};
