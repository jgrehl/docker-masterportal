// todo: reset bei neuer Suche
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
            showAllResults: false,
            currentShowAllList: [],
            currentAvailableCategories: []
        };
    },
    computed: {
        ...mapGetters("Modules/SearchBar", ["searchInterfaces", "searchResults", "suggestionListLength", "searchInput", "minCharacters", "searchSuggestions"]),

        /**
         * Sorts the results according the configured search providers and prepare the suggestionlist with the limit of suggestionListLength, updates searchSuggestions
         * Prepares currentShowAllList (used to show all results of a category).
         * @returns {Object} results the limited and sorted results.
         */
        limitedSortedSearchResults () {
            const results = {};

            this.currentShowAllList = [];
            this.setSearchSuggestions([]);
            results.availableCategories = [];
            for (const [key] of Object.entries(this.searchInterfaces)) {
                for (const [index, value] of Object.entries(this.searchResults)) {
                    if (value.searchInterfaceId === key) {
                        results[value.category + "Count"] = results[value.category + "Count"] === undefined ? 1 : ++results[value.category + "Count"];

                        if (this.checkObjectExists(results.availableCategories, value.category,value.searchInterfaceId)) {
                            results.availableCategories.push({"category": value.category, "searchInterfaceId": value.searchInterfaceId});
                        }
                        this.currentShowAllList.push(value);
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
            console.log("limitedSortedSearchResults", results);
            console.log("limitedSortedSearchResults", this.currentShowAllList);
            return results;
        }
    },
    methods: {
        ...mapMutations("Modules/SearchBar", ["setSearchSuggestions", "addSuggestionItem"]),
        /**
         * Prepares the all results list of one category
         * @returns {void}
         */
        prepareShowAllResults (categoryItem) {
            this.currentAvailableCategories = [categoryItem];
            this.currentShowAllList = this.currentShowAllList.filter(function(value) {
                return (value.category === categoryItem.category  && value.searchInterfaceId === categoryItem.searchInterfaceId);
            })
            this.showAllResults = true;

        },
        /**
         * Checks if the object already exists in the availableCategories array.
         * @returns {void}
         */
        checkObjectExists (availableCategories, category,searchInterfaceId) {
            for (const value of Object.entries(availableCategories)) {
                if (value.category === category && value.searchInterfaceId === searchInterfaceId) {
                    return false;
                }
            }
            return true;
        }
    }
};
</script>

<template lang="html">
    <div
        v-if="searchInput.length>=minCharacters"
    >
        <div
            v-for="categoryItem in showAllResults===false ? limitedSortedSearchResults.availableCategories : currentAvailableCategories"
            id="search-bar-suggestion-list"
            :key="categoryItem.category"
        >
            <h5
                id="search-bar-suggestion-heading"
                class="bold mb-4 mt-4"
            >
                <img
                    v-if="limitedSortedSearchResults[categoryItem.category+'ImgPath']"
                    alt="search result image"
                    src="searchResult.imgPath"
                >
                <i
                    v-if="!limitedSortedSearchResults[categoryItem.category+'ImgPath']"
                    :class="limitedSortedSearchResults[categoryItem.category+'Icon']"
                />

                {{ categoryItem.category +": " + limitedSortedSearchResults[categoryItem.category+"Count"] + "    " + $t("common:modules.searchBar.searchResults") }}
            </h5>
            <div
                v-for="(item) in showAllResults===false ? limitedSortedSearchResults : currentShowAllList"
                :key="item.name"
            >
                <p
                    v-if="item.category===categoryItem.category"
                    id="searchInputLi"
                >
                    <SearchBarSuggestionListItem
                        :search-result="item"
                    />
                </p>
            </div>
            <div
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
