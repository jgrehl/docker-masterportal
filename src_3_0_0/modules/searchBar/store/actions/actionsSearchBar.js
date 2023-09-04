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
     * Handles the switch from the single result view to the search overview and updates the menu navigation values
     * @param {Object} param.getters the getters
     * @param {Object} param.rootState the rootState
     * @param {Object} side the menu side of the search
     * @returns {void}
     */
    updateSearchNavigation: ({getters, commit, rootState}, side) => {
        if (getters.showAllResults === true) {
            commit("setShowAllResults", false);

            rootState.Menu[side].navigation.currentComponent.props.name = "common:modules.searchBar.searchResultList";
            rootState.Menu[side].navigation.history = [];
            rootState.Menu[side].navigation.history.push({type: "root", props: []});
        }
    }
};
