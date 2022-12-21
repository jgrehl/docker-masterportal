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
    clearSelectedLayer (state) {
        state.layersToAdd = [];
        state.layersToRemove = [];
    },
    addSelectedLayer (state, {layerId}) {
        state.layersToAdd.push(layerId);
    },
    removeSelectedLayer (state, {layerId}) {
        const index = state.layersToAdd.indexOf(layerId);

        if (index > -1) {
            state.layersToAdd.splice(state.layersToAdd.indexOf(layerId), 1);
        }
        else {
            state.layersToRemove.push(layerId);
        }

    }
};

export default mutations;
