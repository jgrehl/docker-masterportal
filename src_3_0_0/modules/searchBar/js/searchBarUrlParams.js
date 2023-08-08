import store from "../../../app-store";
import processUrlParams from "../../../shared/js/utils/processUrlParams";
import searchBarComponent from "../components/SearchBar.vue";

const searchBarUrlParams = {
        QUERY: setQueryToSearchInput
    },
    legacySearchBarUrlParams = {
        "SEARCH/QUERY": setQueryToSearchInput
    };

/**
 * Process the searchBar url params.
 * @returns {void}
 */
function processSearchBarUrlParams () {
    processUrlParams(searchBarUrlParams, legacySearchBarUrlParams);
}

/**
 * Sets the query to searchInput in the searchBar.
 * @param {Object} params The found params.
 * @returns {void}
 */
function setQueryToSearchInput (params) {
    store.commit("Modules/SearchBar/setSearchInput", params.QUERY || params["SEARCH/QUERY"]);
    searchBarComponent.methods.startSearch();
}

export default {
    processSearchBarUrlParams,
    setQueryToSearchInput
};
