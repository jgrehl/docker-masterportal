import {generateSimpleMutations} from "../../../shared/js/utils/generators";
import stateSearchBar from "./stateSearchBar";

const mutations = {
    ...generateSimpleMutations(stateSearchBar),

    /**
     * Adds an instance of a search interface to searchInterfaceInstances.
     * @param {Object} state The state of search bar.
     * @param {SearchInterface} searchInterfaceInstance The instance of a search interface.
     * @returns {void}
     */
    addSearchInterfaceInstances (state, searchInterfaceInstance) {
        state.searchInterfaceInstances.push(searchInterfaceInstance);
    },

    /**
     * Adds search hits to result list depending on search type.
     * @param {Object} state The state of search bar.
     * @param {Object} param The params.
     * @param {Object} param.searchResults The search results.
     * @returns {void}
     */
    addSearchResults (state, {searchResults}) {
        state.searchResults = state.searchResults.concat(searchResults);
    },
    /**
     * Adds suggestion to the searchSuggestion
     * @param {Object} state The state of search bar.
     * @param {Object} item to add.
     * @returns {void}
     */
    addSuggestionItem (state, item) {
        state.searchSuggestions.push(item);
    }
};

export default mutations;
