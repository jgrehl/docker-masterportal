<script>
import {mapGetters, mapActions, mapMutations} from "vuex";

/**
 * Search Bar Suggestion List Item
 * @module modules/SearchBarSuggestionListItem
 */
export default {
    name: "SearchBarSuggestionListItem",
    props: {
        searchResult: {
            type: Object,
            required: false,
            default: undefined
        }
    },
    computed: {
        ...mapGetters("Modules/SearchBar", ["featureButtonsMap"])
    },
    methods: {
        ...mapActions(["addLayerToLayerConfig"]),
        ...mapActions("Modules/SearchBar", ["addSearchResultToTopicTree"]),
        ...mapMutations("Modules/SearchBar", ["setSearchResultsActive"]),

        /**
         * Adds a layer to the topic tree and closes the search
         * @param {Object} searchResult a single search result
         * @returns {void}
         */
        async addLayer (searchResult) {
            await this.addSearchResultToTopicTree(searchResult);
            this.setSearchResultsActive(false);
        }
    }
};
</script>

<template lang="html">
    <div id="search-bar-suggestion-list-item">
        <div class="d-flex flex-row bd-highlight bold mb-2">
            <button
                type="button"
                class="btn btn-light d-flex"
                :title="searchResult.toolTip ? searchResult.toolTip : searchResult.name"
                :aria-label="searchResult.toolTip ? searchResult.toolTip : searchResult.name"
                @click="addLayer(searchResult)"
                @keydown.enter="addLayer(searchResult)"
            >
                <span class="btn-title">
                    {{ searchResult.name }}
                </span>
            </button>
            <div
                v-if="searchResult.featureButtons[0]"
                title="placeholder"
                class="ms-auto mt-1 p-2"
            >
                <div
                    v-for="featureButton in searchResult.featureButtons"
                    :key="featureButton"
                >
                    <component
                        :is="featureButtonsMap[featureButton.charAt(0).toUpperCase()+featureButton.slice(1)]"
                        :search-result="searchResult"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
.btn {
    display: flex;
    align-items: center;
    justify-content: left;
    white-space: nowrap;
    min-height: 2.5rem;
    width: 80%;

    i {
        font-size: 1.3rem;
        padding-right: 1rem;
    }
    i:last-child {
        padding-left: .5rem;
        padding-right: 0;
    }
    .btn-texts {
        text-align: left;

    }
    .btn-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
