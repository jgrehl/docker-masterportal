<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import SearchBarSuggestionList from "./SearchBarSuggestionList.vue";
import SearchBarResultList from "./SearchBarResultList.vue";

/**
 * Searchbar to access search results.
 * @module modules/searchBar/components/SearchBar
 * @vue-computed {String} searchInputValue - The v-bind of search input value.
 * @vue-computed {Object} limitedSortedSearchResults - Results the limited and sorted search results.
 */
export default {
    name: "SearchBar",
    components: {
        SearchBarResultList,
        SearchBarSuggestionList
    },
    props: {
        clickAction: {
            type: Function,
            default: undefined,
            required: false
        }
    },
    data: function () {
        return {
            side: undefined,
            currentComponentSide: undefined
        };
    },
    computed: {
        ...mapGetters("Modules/SearchBar", [
            "configPaths",
            "minCharacters",
            "placeholder",
            "searchInput",
            "searchInterfaceInstances",
            "searchResults",
            "showAllResults",
            "suggestionListLength",
            "type",
            "currentSide"
        ]),
        ...mapGetters("Menu",
            {menuCurrentComponent: "currentComponent"}
        ),
        ...mapGetters([
            "portalConfig"
        ]),
        /**
         * v-bind of search input value.
         */
        searchInputValue: {
            get () {
                return this.searchInput;
            },
            set (searchInput) {
                this.setSearchInput(searchInput);
            }
        },
        /**
         * Check if search should be activated.
         * @returns {Boolean} True if search should be executed.
         */
        searchActivated () {
            return this.searchInputValue.length >= parseInt(this.minCharacters, 10);
        },
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
    watch: {
        /**
        * Watcher to check the current component
        */
        currentComponentSide: {
            handler (newVal) {
                if (newVal === "root") {
                    this.searchInputValue = "";
                    this.$refs.searchInput.blur();
                    if (this.side) {
                        this.switchToRoot(this.side);
                    }
                }
            },
            deep: true
        }
    },
    mounted () {
        this.setCurrentSide(this.portalConfig?.mainMenu?.searchBar !== undefined ? "mainMenu" : "secondaryMenu");
        this.currentComponentSide = this.menuCurrentComponent(this.currentSide).type;
        this.initializeModule({configPaths: this.configPaths, type: this.type});
        this.overwriteDefaultValues();
        this.instantiateSearchInterfaces(this.$searchInterfaceAddons);
        this.focusInput();
    },
    methods: {
        ...mapActions(["initializeModule"]),
        ...mapActions("Modules/SearchBar", [
            "instantiateSearchInterfaces",
            "overwriteDefaultValues",
            "search"
        ]),
        ...mapMutations("Modules/SearchBar", [
            "addSuggestionItem",
            "setSearchInput",
            "setShowAllResults",
            "setSearchResultsActive",
            "setSearchSuggestions",
            "setCurrentSide"
        ]),
        ...mapMutations("Menu", [
            "switchToRoot"
        ]),
        /**
         * Starts the search in searchInterfaces, if min characters are introduced, updates the result list.
         * @returns {void}
         */
        startSearch () {
            if (this.searchActivated) {
                this.setSearchResultsActive(true);
                this.search({searchInput: this.searchInputValue});
            }
        },
        /**
         * Sets the focus to the searchbar input.
         * @returns {void}
         */
        focusInput () {
            this.$refs.searchInput.focus();
        },
        /**
         * Handles the input action behavior of the search
         * @param {String} currentComponentSide Current component type
         * @returns {void}
         */
        checkCurrentComponent (currentComponentSide) {
            if (currentComponentSide === "root") {
                this.clickAction();
            }
            else {
                this.startSearch();
            }
        }
    }
};
</script>

<template lang="html">
    <div id="search-bar">
        <div class="input-group mb-3">
            <button
                id="search-button"
                class="btn btn-primary"
                :disabled="!searchActivated"
                :aria-label="$t(placeholder)"
                type="button"
                @click="checkCurrentComponent(currentComponentSide)"
            >
                <i
                    class="bi-search"
                    role="img"
                />
            </button>
            <input
                ref="searchInput"
                v-model="searchInputValue"
                type="search"
                class="form-control"
                :placeholder="$t(placeholder)"
                :aria-label="$t(placeholder)"
                @click="clickAction"
                @input="checkCurrentComponent(currentComponentSide)"
                @keydown.enter="checkCurrentComponent(currentComponentSide)"
            >
        </div>
        <SearchBarSuggestionList
            v-if="!showAllResults"
            :limited-sorted-search-results="limitedSortedSearchResults"
        />
        <SearchBarResultList
            v-else-if="showAllResults"
            :limited-sorted-search-results="limitedSortedSearchResults"
        />
    </div>
</template>

<style lang="scss" scoped>
    #search-bar {
        #search-button {
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
        }
    }
</style>

