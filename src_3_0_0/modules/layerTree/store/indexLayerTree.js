import actions from "./actionsLayerTree";
import state from "./stateLayerTree";
import mutations from "./mutationsLayerTree";
import getters from "./gettersLayerTree";

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
};
