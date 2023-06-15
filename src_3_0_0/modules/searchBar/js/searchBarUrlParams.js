import store from "../../../app-store";
import processUrlParams from "../../../shared/js/utils/processUrlParams";

const searchBarUrlParams = {
        QUERY: setQueryToSearchInput
    },
    legacysearchBarUrlParams = {
        "SEARCH/QUERY": setQueryToSearchInput
    };

/**
 * Process the searchBar url params.
 * @returns {void}
 */
function processSearchBarUrlParams () {
    processUrlParams(searchBarUrlParams, legacysearchBarUrlParams);
}

/**
 * Sets the query to searchInput in the searchBar.
 * @param {Object} params The found params.
 * @returns {void}
 */
function setQueryToSearchInput (params) {
    store.commit("SearchBar/setSearchInput", params.QUERY || params["SEARCH/QUERY"]);
    store.dispatch("SearchBar/startSearch");
}

export default {
    processSearchBarUrlParams,
    setQueryToSearchInput
};
