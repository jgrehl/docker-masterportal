import state from "./stateStartModule";
import getters from "./gettersStartModule";
import mutations from "./mutationsStartModule";

export default {
    namespaced: true,
    state: {...state},
    getters,
    mutations
};
