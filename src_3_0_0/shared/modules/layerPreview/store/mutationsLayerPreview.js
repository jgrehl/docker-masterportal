import {generateSimpleMutations} from "../../../js/utils/generators";
import stateLayerPreview from "./stateLayerPreview";

const mutations = {
    /**
     * Creates from every state-key a setter.
     * For example, given a state object {key: value}, an object
     * {setKey:   (state, payload) => *   state[key] = payload * }
     * will be returned.
     */
    ...generateSimpleMutations(stateLayerPreview),

    /**
     * Collapses Menucontainers
     * @param {Object} state current state
     * @returns {void}
     */
    setPreviewCenter (state, {center}) {
        state.center = center;
    },

    /**
     * Collapses Menucontainers
     * @param {Object} state current state
     * @returns {void}
     */
    setPreviewZoomLevel (state, {zoomLevel}) {
        state.zoomLevel = zoomLevel;
    }

};

export default mutations;
