import mutations from "./mutationsLayerTree";
import state from "./stateLayerTree";

export default {
    namespaced: true,
    mutations,
    state: {...state}
};
