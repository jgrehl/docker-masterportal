import getters from "./gettersLayerTree";
import mutations from "./mutationsLayerTree";
import state from "./stateLayerTree";

export default {
    namespaced: true,
    getters,
    mutations,
    state: {...state}
};
