<script>
import {mapGetters, mapMutations} from "vuex";

/**
 * Searchbar - single item of a search result topic tree.
 * @module modules/searchBar/components/SearchBarResultListTopicTreeItem
 * @vue-props {Object} searchResult - A single search result.
 * @vue-computed {Boolean} isChecked - Returns true, if layer checkbox is checked.
 */
export default {
    name: "SearchBarResultListTopicTreeItem",
    props: {
        searchResult: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters(["visibleLayerConfigs"]),
        ...mapGetters("Modules/SearchBar", [
            "selectedSearchResults"
        ]),

        /**
         * Returns true, if layer checkbox is checked.
         * @returns {Boolean} true, if layer checkbox is checked
         */
        isChecked () {
            const layerId = this.searchResult.events?.onClick?.activateLayerInTopicTree?.layerId || this.searchResult.events?.onClick?.addLayerToTopicTree?.layerId;

            if (this.visibleLayerConfigs?.find(layer => layer.id === layerId) !== undefined) {
                return true;
            }

            return typeof this.selectedSearchResults.find(item => this.searchResult.id === item.id) !== "undefined";
        }
    },
    methods: {
        ...mapMutations("Modules/SearchBar", [
            "addSelectedSearchResults",
            "removeSelectedSearchResults"
        ]),

        /**
         * Add or remove the searchResult to or from the selectedSearchresults
         * @returns {void}
         */
        addOrRemoveLayer () {
            if (!this.isChecked) {
                this.addSelectedSearchResults(this.searchResult);
            }
            else {
                this.removeSelectedSearchResults(this.searchResult);
            }
        }
    }
};
</script>

<template lang="html">
    <div :id="'search-bar-result-list-topic-tree-item-' + searchResult.id">
        <div
            class="d-flex flex-row p-1 pb-2 search-bar-result-list-topic-tree-item-title"
            @click="addOrRemoveLayer"
            @keydown.enter="addOrRemoveLayer"
        >
            <span
                :id="'search-bar-result-list-topic-tree-item-checkbox-' + searchResult.id"
                :class="[
                    'search-bar-result-list-topic-tree-item-checkbox ps-1 pe-3',
                    {
                        'bi-check-square': isChecked,
                        'bi-square': !isChecked
                    }
                ]"
            />
            <label
                :class="['search-bar-result-list-topic-tree-item-label', 'mt-0 d-flex flex-column align-self-start', isChecked ? 'bold' : '']"
                :for="'search-bar-result-list-topic-tree-item-checkbox-' + searchResult.id"
                tabindex="0"
                :aria-label="$t(searchResult.name)"
            >
                <span>
                    {{ $t(searchResult.name) }}
                </span>
            </label>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
@import "~mixins";

.search-bar-result-list-topic-tree-item-title, .search-bar-result-list-topic-tree-item-checkbox {
    &:hover {
        @include primary_action_hover;
    }
    &:focus {
        @include primary_action_focus;
    }
}

.search-bar-result-list-topic-tree-item-label {
    cursor: pointer;
}
</style>
