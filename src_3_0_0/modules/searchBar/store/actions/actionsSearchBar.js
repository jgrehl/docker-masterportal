/**
 * Contains global actions of the search bar.
 */
import actionsSearchBarResultList from "./actionsSearchBarResultList";
import actionsSearchBarSearchInterfaces from "./actionsSearchBarSearchInterfaces";
import actionsSearchBarSearchResult from "./actionsSearchBarSearchResult";
import SearchInterface from "../../searchInterfaces/searchInterface";

export default {
    ...actionsSearchBarResultList,
    ...actionsSearchBarSearchInterfaces,
    ...actionsSearchBarSearchResult,

    /**
     * Overwrite default values in search interface.
     * @param {Object} param.state the state
     * @returns {void}
     */
    overwriteDefaultValues: ({state}) => {
        SearchInterface.prototype.timeout = state.timeout;
    },
    /**
     * Starts the search in searchInterfaces, if min characters are introduced, updates the result list.
     * @param {Object} param.getters the getters
     * @param {Object} param.dispatch the dispatch
     * @param {Object} param.commit the commit
     * @param {Object} param.rootState the rootState
     * @returns {void}
     */
    startSearch ({getters, dispatch, commit, rootState}) {
        const side = getters.currentSide;

        if (getters.searchInput?.length >= parseInt(getters.minCharacters, 10)) {
            commit("setShowAllResults", false);
            if (!getters.searchResultsActive) {
                rootState.Menu[side].navigation.history.push({0: {type: "root", props: []}});
            }

            commit("setSearchResultsActive", true);
            dispatch("search", {searchInput: getters.searchInput});

            dispatch("Menu/clickedMenuElement", {
                name: "common:modules.searchBar.searchResultList",
                side: side,
                type: "searchbarresultlist"
            }, {root: true});
        }
        if (getters.searchInput?.length < parseInt(getters.minCharacters, 10) && getters.searchResultsActive === true) {
            dispatch("Menu/navigateBack", side, {root: true});
        }
    }
};
