<script>
import {mapGetters, mapMutations} from "vuex";
import SearchBarSuggestionListItem from "./SearchBarSuggestionListItem.vue";

/**
 * Searchbar result list to show the categorized overview or single search results.
 * @module modules/searchBar/components/SearchBarSuggestionList
 * @vue-props {Object} limitedSortedSearchResults - Results the limited and sorted search results.
 * @vue-data {Array} currentShowAllList - Array of the single search results to show from the 'show all' button.
 */
export default {
    name: "SearchBarSuggestionList",
    components: {
        SearchBarSuggestionListItem
    },
    props: {
        limitedSortedSearchResults: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            currentShowAllList: []
        };
    },
    computed: {
        ...mapGetters("Modules/SearchBar", [
            "minCharacters",
            "searchInput",
            "searchResults",
            "searchResultsActive",
            "showAllResults"
        ])
    },
    methods: {
        ...mapMutations("Modules/SearchBar", [
            "setCurrentAvailableCategories",
            "setSearchResultsActive",
            "setShowAllResults"
        ]),

        /**
         * Prepares the all results list of one category
         * @param {String} categoryItem the category of the results
         * @returns {void}
         */
        prepareShowAllResults (categoryItem) {
            this.setCurrentAvailableCategories(categoryItem);
            this.currentShowAllList = this.limitedSortedSearchResults.currentShowAllList.filter(value => {
                return value.category === categoryItem;
            });
            this.setShowAllResults(true);
        }
    }
};
</script>

<template lang="html">
    <div
        v-if="searchInput.length >= minCharacters && searchResultsActive && searchResults.length > 0"
        class="overflow-auto suggestions-container"
    >
        <a
            :id="'mp-navigation'"
            class="pb-2 pt-2 mp-menu-navigation-link"
            href="#"
            @click="setSearchResultsActive(false)"
            @keypress="setSearchResultsActive(false)"
        >
            <h6 class="mp-menu-navigation-link-text mb-3"><p class="bi-chevron-left me-2">{{ $t("common:modules.menu.name") }}</p></h6>
        </a>
        <div
            v-for="categoryItem in limitedSortedSearchResults.results.availableCategories"
            id="search-bar-suggestion-list"
            :key="categoryItem"
        >
            <h5
                id="search-bar-suggestion-heading"
                class="bold mb-4 mt-4"
                :title="$t('common:modules.searchBar.searchResultsFrom') + limitedSortedSearchResults.results.categoryProvider[categoryItem] + '-' + $t('common:modules.searchBar.search')"
            >
                <img
                    v-if="limitedSortedSearchResults.results[categoryItem + 'ImgPath']"
                    alt="search result image"
                    src="searchResult.imgPath"
                >
                <i
                    v-if="!limitedSortedSearchResults.results[categoryItem + 'ImgPath']"
                    :class="limitedSortedSearchResults.results[categoryItem + 'Icon']"
                />

                {{ categoryItem +": " + limitedSortedSearchResults.results[categoryItem+"Count"] + "    " + $t("common:modules.searchBar.searchResults") }}
            </h5>
            <div
                v-for="(item, index) in showAllResults===false ? limitedSortedSearchResults.results : limitedSortedSearchResults.currentShowAllList"
                :key="item.id + '-' + index"
            >
                <p
                    v-if="item.category===categoryItem"
                    id="searchInputLi"
                >
                    <SearchBarSuggestionListItem
                        :search-suggestion="item"
                    />
                </p>
            </div>
            <div class="showAllSection">
                <button
                    type="button"
                    class="btn btn-light d-flex text-left"
                    :title="$t('common:modules.searchBar.showAllResults')"
                    @click="prepareShowAllResults(categoryItem)"
                >
                    {{ $t("common:modules.searchBar.showAll") }}
                    <span class="bi-chevron-right" />
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
button {
    span {
        margin-top: .1rem;
        margin-left: .25rem;
    }
}
.suggestions-container {
    overflow-y: scroll;
    overflow-x: hidden;
    max-height: 70vH;
}
.showAllSection {
    display: flex;
    justify-content: right;
    align-items: right;
}
</style>
