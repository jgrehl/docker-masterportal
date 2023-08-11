<script>
import {mapActions} from "vuex";

/**
 * Searchbar - single item of a search suggestion.
 * @module modules/searchBar/components/SearchBarResultListGeneralItem
 * @vue-props {Object} searchSuggestion - A single search suggestion.
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
            "activateLayerInTopicTree",
            "addLayerToTopicTree",
            "highligtFeature",
            "openGetFeatureInfo",
            "setMarker",
            "zoomToResult"
        ]),

        /**
         * Activate click action(s) of searchResult.
         * @param {Object} searchResult The search result.
         * @param {Object} actionType The action type onHover or onClick
         * @returns {void}
         */
        activateAction (searchResult, actionType) {
            const events = searchResult.events[actionType] || {};

            Object.keys(events).forEach(event => {
                this[event](events[event]);
            });
        }
    }
};
</script>

<template lang="html">
    <div id="search-bar-result-list-general-item">
        <div class="d-flex flex-row bd-highlight bold">
            <button
                type="button"
                class="btn btn-light d-flex"
                :title="searchResult.toolTip ? searchResult.toolTip : searchResult.name"
                :aria-label="searchResult.toolTip ? searchResult.toolTip : searchResult.name"
                @click="activateAction(searchResult, 'onClick')"
                @keydown.enter="activateAction(searchResult, 'onClick')"
                @mouseover="activateAction(searchResult, 'onHover')"
                @focus="activateAction(searchResult, 'onHover')"
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
