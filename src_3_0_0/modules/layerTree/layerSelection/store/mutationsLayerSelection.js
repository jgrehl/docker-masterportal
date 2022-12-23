import {generateSimpleMutations} from "../../../../shared/js/utils/generators";
import stateLayerSelection from "./stateLayerSelection";

const mutations = {
    /**
     * Creates from every state-key a setter.
     * For example, given a state object {key: value}, an object
     * {setKey:   (state, payload) => *   state[key] = payload * }
     * will be returned.
     */
    ...generateSimpleMutations(stateLayerSelection),
    /**
     * Clears state.layersToAdd.
     * @param {object} state vuex state
     * @returns {void}
     */
    clearSelectedLayer (state) {
        state.layersToAdd = [];
    },
    /**
     * Adds the layer id to state.layersToAdd.
     * @param {object} state vuex state
     * @param {String} layerId the id of the layer
     * @returns {void}
     */
    addSelectedLayer (state, {layerId}) {
        state.layersToAdd.push(layerId);
    },
    /**
     * Removes the layer id from state.layersToAdd.
     * @param {object} state vuex state
     * @param {String} layerId the id of the layer
     * @returns {void}
     */
    removeSelectedLayer (state, {layerId}) {
        const index = state.layersToAdd.indexOf(layerId);

        if (index > -1) {
            state.layersToAdd.splice(index, 1);
        }
    }
};

export default mutations;
