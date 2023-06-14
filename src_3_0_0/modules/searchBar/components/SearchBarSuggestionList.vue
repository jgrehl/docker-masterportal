<script>
import {mapGetters, mapMutations} from "vuex";
import SearchBarSuggestionListItem from "./SearchBarSuggestionListItem.vue";

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
            configuredSearchProvider: []
        };
    },
    computed: {
        ...mapGetters("Modules/SearchBar", ["searchInterfaces", "searchResults", "suggestionListLength", "searchInput", "minCharacters", "searchSuggestions"]),

        /**
         * Sorts the results according the configured search providers and prepare the suggestionlist with the limit of suggestionListLength, updates searchSuggestions
         * @param {Object} results the limited and sorted results.
         * @returns {void}
         */
        limitedSortedSearchResults () {
            const results = {};

            this.setSearchSuggestions([]);
            results.availableCategories = [];
            for (const [key] of Object.entries(this.searchInterfaces)) {
                for (const [index, value] of Object.entries(this.searchResults)) {
                    if (value.searchInterfaceId === key) {
                        results[value.category + "Count"] = results[value.category + "Count"] === undefined ? 1 : ++results[value.category + "Count"];

                        if (results.availableCategories.includes(value.category) === false) {
                            results.availableCategories.push(value.category);
                        }
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
            return results;
        }
    },
    methods: {
        ...mapMutations("Modules/SearchBar", ["setSearchSuggestions", "addSuggestionItem"])
    }
};
</script>

<template lang="html">
    <div
        v-if="searchInput.length>=minCharacters"
    >
        <div
            v-for="category in limitedSortedSearchResults.availableCategories"
            id="search-bar-suggestion-list"
            :key="category"
        >
            <h5
                id="search-bar-suggestion-heading"
                class="bold mb-4 mt-4"
            >
                <img
                    v-if="limitedSortedSearchResults[category+'ImgPath']"
                    alt="search result image"
                    src="searchResult.imgPath"
                >
                <i
                    v-if="!limitedSortedSearchResults[category+'ImgPath']"
                    :class="limitedSortedSearchResults[category+'Icon']"
                />

                {{ category +": " + limitedSortedSearchResults[category+"Count"] + "    " + $t("common:modules.searchbar.searchResults") }}
            </h5>
            <div
                v-for="item in limitedSortedSearchResults"
                :key="item.name"
            >
                <p
                    v-if="item.category===category"
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
                >
                    {{ $t("common:modules.searchbar.showAll") }}
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
