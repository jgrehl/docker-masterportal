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
            "activateAction"
        ]),
        ...mapMutations("Modules/SearchBar", [
            "setSearchResultsActive"
        ])
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
                @click="activateAction({searchResult: searchSuggestion, actionType: 'onClick'})"
                @keydown.enter="activateAction({searchResult: searchSuggestion, actionType: 'onClick'})"
                @mouseover="activateAction({searchResult: searchSuggestion, actionType: 'onHover'})"
                @focus="activateAction({searchResult: searchSuggestion, actionType: 'onHover'})"
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
