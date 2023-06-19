// todo: reset bei neuer Suche
// ergebnissliste scrollable
// title übersetzen
// rename files and variables


<script>
import {mapGetters, mapMutations} from "vuex";
import SearchBarSuggestionListItem from "./SearchBarSuggestionListItem.vue";

/**
 * Search Bar Suggestion List
 * @module modules/SearchBarSuggestionList
 */
export default {
    name: "SearchBarSuggestionList",
    components: {
        SearchBarSuggestionListItem
        // todo SearchBarResultList
    },
    props: {

    },
    data () {
        return {
            configuredSearchProvider: [],
            currentShowAllList: [],
            currentAvailableCategories: []
        };
    },
    computed: {
        ...mapGetters("Modules/SearchBar", ["searchInterfaces", "searchResults", "suggestionListLength", "searchInput", "minCharacters", "searchSuggestions", "showAllResults"]),

        /**
         * Sorts the results according the configured search providers and prepare the suggestionlist with the limit of suggestionListLength, updates searchSuggestions
         * Prepares currentShowAllList (used to show all results of a category).
         * @returns {Object} results the limited and sorted results.
         */
        limitedSortedSearchResults () {
            const results = {},
                currentShowAllList = [];

            results.categoryProvider = {};
            this.setSearchSuggestions([]);
            results.availableCategories = [];
            for (const [key] of Object.entries(this.searchInterfaces)) {
                for (const [index, value] of Object.entries(this.searchResults)) {
                    if (value.searchInterfaceId === key) {
                        results[value.category + "Count"] = results[value.category + "Count"] === undefined ? 1 : ++results[value.category + "Count"];


                        if (results.availableCategories.includes(value.category) === false) {
                            results.availableCategories.push(value.category);
                            results.categoryProvider[value.category] = value.searchInterfaceId;
                        }

                        currentShowAllList.push(value);

                        if (results[value.category + "Count"] <= this.suggestionListLength) {
                            results[index] = value;
                            this.addSuggestionItem(value);
                        }
                        if (value.imgPath) {
                            results[value.category + "ImgPath"] = value.imgPath;
                        }
                        if (value.icon) {
                            results[value.category + "Icon"] = value.icon;
                        }
                    }
                }
            }
            return {results: results, currentShowAllList: currentShowAllList};
        }
    },
    methods: {
        ...mapMutations("Modules/SearchBar", ["setSearchSuggestions", "addSuggestionItem", "setShowAllResults"]),
        /**
         * Prepares the all results list of one category
         * @returns {void}
         */
        prepareShowAllResults (categoryItem) {
            this.currentAvailableCategories = [categoryItem];
            this.currentShowAllList = this.limitedSortedSearchResults.currentShowAllList.filter(function (value) {
                return value.category === categoryItem;
            });
            this.setShowAllResults(true);

        }
    }
};
</script>

<template lang="html">
    <div
        v-if="searchInput.length>=minCharacters"
    >
        <div
            v-for="categoryItem in showAllResults===false ? limitedSortedSearchResults.results.availableCategories : currentAvailableCategories"
            id="search-bar-suggestion-list"
            :key="categoryItem"
        >
            <h5
                id="search-bar-suggestion-heading"
                class="bold mb-4 mt-4"
                :title="'results from '+limitedSortedSearchResults.results.categoryProvider[categoryItem]+'-search'"
            >
                <img
                    v-if="limitedSortedSearchResults.results[categoryItem+'ImgPath']"
                    alt="search result image"
                    src="searchResult.imgPath"
                >
                <i
                    v-if="!limitedSortedSearchResults.results[categoryItem+'ImgPath']"
                    :class="limitedSortedSearchResults.results[categoryItem+'Icon']"
                />

                {{ categoryItem +": " + limitedSortedSearchResults.results[categoryItem+"Count"] + "    " + $t("common:modules.searchBar.searchResults") }}
            </h5>
            <div
                v-for="item in showAllResults===false ? limitedSortedSearchResults.results : limitedSortedSearchResults.currentShowAllList"
                :key="item.name"
            >
                <p
                    v-if="item.category===categoryItem"
                    id="searchInputLi"
                >
                    <SearchBarSuggestionListItem
                        :search-result="item"
                    />
                </p>
            </div>
            <div
                v-if="showAllResults===false"
                class="showAllSection"
            >
                <button
                    type="button"
                    class="btn btn-light d-flex text-left"
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
.showAllSection{
  display: flex;
  justify-content: right;
  align-items: right;
}
</style>
