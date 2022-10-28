import state from "./stateFreeze";
import getters from "./gettersFreeze";

export default {
    namespaced: true,
    state: {...state},
    getters
};
