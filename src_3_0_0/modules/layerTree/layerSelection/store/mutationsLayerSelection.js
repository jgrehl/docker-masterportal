import {generateSimpleMutations} from "../../../../shared/js/utils/generators";
import stateLayerSelection from "./stateLayerSelection";

const mutations = {
    /**
     * Creates from every state-key a setter.
     * For example, given a state Object {key: value}, an Object
     * {setKey:   (state, payload) => *   state[key] = payload * }
     * will be returned.
     */
    ...generateSimpleMutations(stateLayerSelection),
    /**
     * Clears layerSelection.
     * @param {Object} state vuex state
     * @returns {void}
     */
    clearLayerSelection (state) {
        state.layersToAdd = [];
        state.lastFolderNames = [];
        state.lastSubjectDataLayerConfs = [];
        state.lastBackgroundLayerConfs = [];
    },
    /**
     * Adds the layer id to state.layersToAdd.
     * @param {Object} state vuex state
     * @param {String} layerId the id of the layer
     * @returns {void}
     */
    addSelectedLayer (state, {layerId}) {
        state.layersToAdd.push(layerId);
    },
    /**
     * Removes the layer id from state.layersToAdd.
     * @param {Object} state vuex state
     * @param {String} layerId the id of the layer
     * @returns {void}
     */
    removeSelectedLayer (state, {layerId}) {
        const index = state.layersToAdd.indexOf(layerId);

        if (index > -1) {
            state.layersToAdd.splice(index, 1);
        }
    },
    /**
     * Reduces state to previus navigation state.
     * @param {Object} state vuex state
     * @returns {void}
     */
    reduceToPreviousLayerSelection (state) {
        state.lastFolderNames.pop();
        state.lastSubjectDataLayerConfs.pop();
        state.lastBackgroundLayerConfs.pop();
    },
    /**
     * Adds payload to navigation state.
     * @param {Object} state vuex state
     * @param {Object} payload the payload
     * @param {String} payload.lastFolderName name of the previous folder configuration name
     * @param {Array} payload.subjectDataLayerConfs subject data layer configurations to show in layerSelection
     * @param {Array} payload.backgroundLayerConfs background layer configurations to show in layerSelection
     * @returns {void}
     */
    addToLayerSelection (state, {lastFolderName, subjectDataLayerConfs, backgroundLayerConfs}) {
        state.lastFolderNames.push(lastFolderName);
        state.lastSubjectDataLayerConfs.push(subjectDataLayerConfs);
        state.lastBackgroundLayerConfs.push(backgroundLayerConfs);
    }
};

export default mutations;
