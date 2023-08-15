<script>
import {mapActions, mapMutations} from "vuex";

/**
 * Searchbar - single item of a search suggestion.
 * @module modules/searchBar/components/SearchBarSuggestionListItem
 * @vue-props {Object} searchSuggestion - A single search suggestion.
 */
export default {
    name: "SearchBarSuggestionListItem",
    props: {
        searchSuggestion: {
            type: Object,
            required: true
        }
    },
    methods: {
        ...mapActions("Modules/SearchBar", [
            "activateLayerInTopicTree",
            "addLayerToTopicTree",
            "highligtFeature",
            "openGetFeatureInfo",
            "setMarker",
            "zoomToResult"
        ]),
        ...mapMutations("Modules/SearchBar", [
            "setSearchResultsActive"
        ]),

        /**
         * Activate click action(s) of searchSuggestion.
         * @param {Object} searchSuggestion The search suggestion.
         * @param {Object} actionType The action type onHover or onClick
         * @returns {void}
         */
        activateAction (searchSuggestion, actionType) {
            const events = searchSuggestion.events[actionType] || {};

            Object.keys(events).forEach(event => {
                this[event](events[event]);
            });
        }
    }
};
</script>

<template lang="html">
    <div id="search-bar-suggestion-list-item">
        <div class="d-flex flex-row bd-highlight bold">
            <button
                type="button"
                class="btn btn-light d-flex"
                :title="searchSuggestion.toolTip ? searchSuggestion.toolTip : searchSuggestion.name"
                :aria-label="searchSuggestion.toolTip ? searchSuggestion.toolTip : searchSuggestion.name"
                @click="activateAction(searchSuggestion, 'onClick')"
                @keydown.enter="activateAction(searchSuggestion, 'onClick')"
                @mouseover="activateAction(searchSuggestion, 'onHover')"
                @focus="activateAction(searchSuggestion, 'onHover')"
            >
                <span class="btn-title">
                    {{ searchSuggestion.name }}
                </span>
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
.btn {
    align-items: center;
    justify-content: left;
    white-space: nowrap;
    min-height: 2.5rem;
    width: 100%;

    .btn-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
