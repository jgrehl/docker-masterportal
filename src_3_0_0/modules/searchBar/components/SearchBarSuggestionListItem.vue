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
    data () {
        return {
            clickStatus: false
        };
    },
    computed: {
        ...mapGetters("Modules/SearchBar", ["featureButtonsMap", "showAllResults"])
    },
    methods: {
        ...mapActions(["addLayerToLayerConfig"]),
        ...mapActions("Modules/SearchBar", ["addSingleSearchResultToTopicTree"]),
        ...mapMutations("Modules/SearchBar", ["setSearchResultsActive", "addSelectedSearchResults", "removeSelectedSearchResults"]),

        /**
         * Adds a layer to the topic tree and closes the search
         * @param {Object} searchResult A single search result
         * @returns {void}
         */
        async addLayer (searchResult) {
            await this.addSingleSearchResultToTopicTree(searchResult);
            this.setSearchResultsActive(false);
        },
        /**
         * Updates the clickStatus
         * @param {Boolean} value True if selected
         * @returns {void}
         */
        updateClickStatus (value) {
            if (value !== undefined) {
                this.clickStatus = value;
            }
        },
        /**
         * Checks the behaviour for click action in the result overview and the 'show all' view.
         * @param {Object} searchResult A single search result
         * @param {Boolean} value True if selected
         * @returns {void}
         */
        checkClickBehaviour (searchResult, value) {
            this.clickStatus = value;
            if (this.showAllResults === true) {
                if (value === true) {
                    this.addSelectedSearchResults(searchResult);
                }
                else {
                    this.removeSelectedSearchResults(searchResult);
                }
            }
            else {
                this.addSingleSearchResultToTopicTree(searchResult);
            }
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
                @click="checkClickBehaviour(searchResult, !clickStatus);"
                @keydown.enter="checkClickBehaviour(searchResult, !clickStatus);"
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
                        :click-status="clickStatus"
                        @update-click-status="updateClickStatus($event)"
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
