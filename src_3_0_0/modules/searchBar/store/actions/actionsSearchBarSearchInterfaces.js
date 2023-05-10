/**
 * Contains actions that communicate with the search interfaces.
 */
import SearchInterfaceElasticSearch from "../../searchInterfaces/searchInterfaceElasticSearch";
import SearchInterfaceGazetteer from "../../searchInterfaces/searchInterfaceGazetteer";

export default {
    /**
     * Instantiate the configured search interfaces
     * and stores them in the state.
     * @param {Object} param.commit the commit
     * @param {Object} param.state the state
     * @returns {void}
     */
    instantiateSearchInterfaces: ({commit, state}) => {
        const searchInterfacesMapper = {
            elasticSearch: SearchInterfaceElasticSearch,
            gazetteer: SearchInterfaceGazetteer
        };

        Object.keys(state.searchInterfaces).forEach(searchInterface => {
            if (searchInterfacesMapper[searchInterface]) {
                commit("addSearchInterfaceInstances", new searchInterfacesMapper[searchInterface](state.searchInterfaces[searchInterface]));
            }
            else {
                console.warn(`The searchInterface: "${searchInterface}" hasn't been implemented yet`);
            }
        });
    },

    /**
     * Send search input to configured searchInterfaces
     * and push the response objects to the state attribute "searchResults".
     * @param {Object} param.commit the commit
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.state the state
     * @param {Object} payload The payload.
     * @param {Object} payload.searchInput The search input.
     * @returns {void}
     */
    search: ({commit, dispatch, state}, {searchInput}) => {
        dispatch("cleanSearchResults");
        state.searchInterfaceInstances.forEach(instance => {
            instance.clearSearchResults();
            instance.search(searchInput)
                .then(searchResults => {
                    commit("addSearchResults", {searchResults});
                })
                .catch(error => {
                    if (String(error) !== "AbortError: The user aborted a request." && error.code !== "ERR_CANCELED") {
                        console.error(error);
                    }
                });
        });
    },

    /**
     * Clean the search results.
     * @param {Object} param.commit the commit
     * @returns {void}
     */
    cleanSearchResults: ({commit}) => {
        commit("setSearchResults", []);
    }
};
