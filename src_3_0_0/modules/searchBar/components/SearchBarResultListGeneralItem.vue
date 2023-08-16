<script>
import {mapActions} from "vuex";

/**
 * Searchbar - single item of a search suggestion.
 * @module modules/searchBar/components/SearchBarResultListGeneralItem
 * @vue-props {Object} searchResult - A single search result.
 */
export default {
    name: "SearchBarResultListGeneralItem",
    props: {
        searchResult: {
            type: Object,
            required: true
        }
    },
    methods: {
        ...mapActions("Modules/SearchBar", [
            "activateAction"
        ])
    }
};
</script>

<template lang="html">
    <div :id="'search-bar-result-list-general-item' + searchResult.id">
        <div class="d-flex flex-row bd-highlight bold">
            <button
                type="button"
                class="btn btn-light d-flex"
                :title="searchResult.toolTip ? searchResult.toolTip : searchResult.name"
                :aria-label="searchResult.toolTip ? searchResult.toolTip : searchResult.name"
                @click="activateAction({searchResult: searchResult, actionType: 'onClick'})"
                @keydown.enter="activateAction({searchResult: searchResult, actionType: 'onClick'})"
                @mouseover="activateAction({searchResult: searchResult, actionType: 'onHover'})"
                @focus="activateAction({searchResult: searchResult, actionType: 'onHover'})"
            >
                <span class="btn-title">
                    {{ searchResult.name }}
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
