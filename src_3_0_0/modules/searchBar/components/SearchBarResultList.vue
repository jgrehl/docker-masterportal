<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import SearchBarResultListItem from "./SearchBarResultListItem.vue";
import ElevatedButton from "../../../shared/modules/buttons/components/ElevatedButton.vue";

/**
 * Searchbar result list to show the categorized overview or single search results.
 * @module modules/SearchBar
 * @vue-data {Array} configuredSearchProvider - Array of the configured search providers.
 * @vue-data {Array} currentShowAllList - Array of the single search results to show from the 'show all' button.
 * @vue-data {Array} currentAvailableCategories - Array of the current available categories.
 * @vue-computed {Object} limitedSortedSearchResults - Results the limited and sorted search results.
 */
export default {
    name: "SearchBarResultList",
    components: {
        SearchBarResultListItem,
        ElevatedButton
    },
    inheritAttrs: false,
    data () {
        return {
            configuredSearchProvider: [],
            currentShowAllList: [],
            currentAvailableCategories: []
        };
    },
    computed: {
        ...mapGetters("Modules/SearchBar", ["searchInterfaceInstances", "searchResults", "suggestionListLength", "searchInput", "minCharacters", "showAllResults", "searchResultsActive", "selectedSearchResults"]),

        /**
         * Updates the categories to unique categories.
         * @returns {Object} The searchresults with unique categories.
         */
        searchResultsWithUniqueCategories () {
            if (this.searchInterfaceInstances.every(searchInterfaceInstance => searchInterfaceInstance.searchState !== "running")) {
                const categories = [...new Set(this.searchResults.map(searchResult => searchResult.category))];

                categories.forEach(category => {
                    const searchResultsByCategory = this.searchResults.filter(searchResult => searchResult.category === category),
                        searchInterfaceIds = [...new Set(searchResultsByCategory.map(searchResult => searchResult.searchInterfaceId))];

                    if (searchInterfaceIds.length > 1) {
                        let count = 0;

                        searchInterfaceIds.forEach(searchInterfaceId => {
                            searchResultsByCategory.forEach(searchResult => {
                                if (searchResult.searchInterfaceId === searchInterfaceId) {
                                    searchResult.category = searchResult.category + "_" + count;
                                }
                            });

                            ++count;
                        });
                    }
                });
            }

            return this.searchResults;
        },

        /**
         * Sorts the results according the configured search providers and prepare the suggestionlist with the limit of suggestionListLength, updates searchSuggestions
         * Prepares currentShowAllList (used to show all results of a category).
         * @returns {Object} results the limited and sorted search results.
         */
        limitedSortedSearchResults () {
            const results = {},
                currentShowAllList = [];

            results.categoryProvider = {};
            this.setSearchSuggestions([]);
            results.availableCategories = [];
            this.searchInterfaceInstances.forEach(searchInterfaceInstance => {
                for (const [index, value] of Object.entries(this.searchResultsWithUniqueCategories)) {
                    if (value.searchInterfaceId === searchInterfaceInstance.searchInterfaceId) {
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
            });

            return {results: results, currentShowAllList: currentShowAllList};
        }
    },
    methods: {
        ...mapActions("Modules/SearchBar", ["addSelectedSearchResultToTopicTree"]),
        ...mapActions("Menu", ["clickedMenuElement", "navigateBack"]),
        ...mapMutations("Modules/SearchBar", ["setSearchSuggestions", "addSuggestionItem", "setShowAllResults", "setSearchResultsActive"]),
        /**
         * Prepares the all results list of one category
         * @param {String} categoryItem the category of the results
         * @returns {void}
         */
        prepareShowAllResults (categoryItem) {
            const side = this.portalConfig?.mainMenu?.searchBar !== undefined ? "mainMenu" : "secondaryMenu";

            this.$store.state.Menu[side].navigation.currentComponent = {props: {name: "common:modules.searchBar.searchResults"}, type: "searchbarresultlist"};

            this.$store.state.Menu.currentComponent = "searchbarresultlist";
            this.$store.state.Menu[side].navigation.history = [];
            this.$store.state.Menu[side].navigation.history.push({type: "root", props: []}, {type: "searchResultList", props: {name: "modules.searchBar.searchResultList"}});

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
        v-if="searchInput.length>=minCharacters && searchResultsActive && searchResults.length>0"
        class="overflow-auto results-container"
    >
        <div
            v-for="categoryItem in showAllResults===false ? limitedSortedSearchResults.results.availableCategories : currentAvailableCategories"
            id="search-bar-result-list"
            :key="categoryItem"
        >
            <h5
                id="search-bar-result-heading"
                class="bold mb-4 mt-4"
                :title="$t('common:modules.searchBar.searchResultsFrom')+limitedSortedSearchResults.results.categoryProvider[categoryItem]+'-'+$t('common:modules.searchBar.search')"
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
                v-for="(item, index) in showAllResults===false ? limitedSortedSearchResults.results : limitedSortedSearchResults.currentShowAllList"
                :key="item.id + '-' + index"
            >
                <p
                    v-if="item.category===categoryItem"
                    id="searchInputLi"
                >
                    <SearchBarResultListItem
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
                    :title="$t('common:modules.searchBar.showAllResults')"
                    @click="prepareShowAllResults(categoryItem)"
                >
                    {{ $t("common:modules.searchBar.showAll") }}
                    <span class="bi-chevron-right" />
                </button>
            </div>
        </div>
    </div>
    <div
        v-if="showAllResults===true"
        class="mt-4 d-flex justify-content-center sticky"
    >
        <ElevatedButton
            id="add-layerSelection-btn"
            aria-label="$t('common:modules.layerSelection.addSelectedSubjectsToMap', {count: selectedSearchResults.length})"
            :interaction="()=>addSelectedSearchResultToTopicTree()"
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
.results-container {
    overflow-y: scroll;
    overflow-x: hidden;
    max-height: 70vH;
}
.showAllSection{
  display: flex;
  justify-content: right;
  align-items: right;
}
</style>
