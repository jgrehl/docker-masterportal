import {generateSimpleMutations} from "../../../shared/js/utils/generators";
import stateSearchBar from "./stateSearchBar";

const mutations = {
    ...generateSimpleMutations(stateSearchBar),

    /**
     * Adds unique searchInterfaceIds for multiple searchInterfaces.
     * @param {Object} state The state of search bar.
     * @returns {void}
     */
    addMultipleSearchInterfaceIds (state) {
        const types = state.searchInterfaces.map(searchInterface => searchInterface.type),
            duplicates = types.filter((searchInterfaces, index) => types.indexOf(searchInterfaces) !== index);
        let count = 0;

        duplicates.forEach(duplicate => {
            state.searchInterfaces.forEach(searchInterface => {
                if (searchInterface.type === duplicate) {
                    searchInterface.searchInterfaceId = searchInterface.type + "_" + count++;
                }
            });
        });
    },

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
    },
    /**
     * Adds a search result to the selectedSearchResults to add the layer later.
     * @param {Object} state The state of search bar.
     * @param {Object} searchResult to add.
     * @returns {void}
     */
    addSelectedSearchResults (state, searchResult) {
        state.selectedSearchResults.push(searchResult);
    },
    /**
     * Removes a search result from the selectedSearchResults to add just the current selected layers later.
     * @param {Object} state The state of search bar.
     * @param {Object} searchResult to remove.
     * @returns {void}
     */
    removeSelectedSearchResults (state, searchResult) {
        state.selectedSearchResults = state.selectedSearchResults.filter(item => searchResult.id !== item.id);
    }
};

export default mutations;
