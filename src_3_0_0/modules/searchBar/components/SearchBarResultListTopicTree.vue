<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import SearchBarResultListTopicTreeItem from "./SearchBarResultListTopicTreeItem.vue";
import ElevatedButton from "../../../shared/modules/buttons/components/ElevatedButton.vue";

/**
 * Searchbar result list to show search results for topic tree.
 * @module modules/searchBar/components/SearchBarResultListTopicTree
 */
export default {
    name: "SearchBarResultListTopicTree",
    components: {
        SearchBarResultListTopicTreeItem,
        ElevatedButton
    },
    props: {
        resultItems: {
            type: Array,
            required: true
        }
    },
    computed: {
        ...mapGetters("Modules/SearchBar", [
            "searchInput",
            "searchResults",
            "selectedSearchResults"
        ])
    },
    unmounted () {
        this.setSelectedSearchResults([]);
    },
    methods: {
        ...mapActions("Modules/SearchBar", [
            "activateAction"
        ]),
        ...mapMutations("Modules/SearchBar", [
            "setSelectedSearchResults"
        ]),

        /**
         * Activate click actions of searchResult.
         * @param {Object} searchResult The search result.
         * @returns {void}
         */
        activateOnClickAction () {
            this.selectedSearchResults.forEach(selectedSearchResult => {
                this.activateAction({
                    searchResult: selectedSearchResult,
                    actionType: "onClick"
                });
            });
        }
    }
};
</script>

<template lang="html">
    <div class="overflow-auto results-topic-tree-container">
        <div
            v-for="(item, index) in resultItems"
            :key="item.id + '-' + index"
        >
            <span id="searchInputLi">
                <SearchBarResultListTopicTreeItem
                    :search-result="item"
                />
            </span>
        </div>
    </div>
    <div class="mt-4 d-flex justify-content-center sticky">
        <ElevatedButton
            id="add-layerSelection-btn"
            aria-label="$t('common:modules.layerSelection.addSelectedSubjectsToMap', {count: selectedSearchResults.length})"
            :interaction="activateOnClickAction"
            :text="selectedSearchResults.length !== undefined && selectedSearchResults.length >= 1 ? $t('common:modules.layerSelection.addSelectedSubjectsToMap', {count: selectedSearchResults.length}) : $t('common:modules.layerSelection.selectedSubjectsCount', {count: selectedSearchResults.length})"

            :icon="'bi-plus-circle'"
            :disabled="selectedSearchResults.length === 0"
        />
    </div>
</template>

<style lang="scss" scoped>
button {
    span {
        margin-top: .1rem;
        margin-left: .25rem;
    }
}

.sticky {
    position : sticky;
    bottom:0;
}
</style>
