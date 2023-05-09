<script>
import {mapGetters, mapActions} from "vuex";
import SearchBarSuggestionListItem from "./SearchBarSuggestionListItem.vue";

export default {
    name: "SearchBarSuggestionList",
    components: {
        SearchBarSuggestionListItem
    },
    props: {

    },
    data () {
        return {
            configuredSearchProvider: []
        };
    },
    computed: {
        ...mapGetters("Modules/SearchBar", ["searchInterfaces", "searchResults", "suggestionListLength"]),
        ...mapGetters([
            "portalConfig"
        ]),
        // sorts the results according the configured search providers and prepare the suggestionlist with the limit of suggestionListLength
        limitedSortedSearchResults () {
            const results = {};

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
                        }

                    }
                }
            }
            return results;
        }
    },
    components: {
        SearchBarSuggestionListItem
        //SearchBarResultList
    },
    watch: {
    },
    mounted () {
    },
    methods: {
        ...mapActions("Modules/SearchBar", ["getconf"]),
        /**
         * Starts the search in searchInterfaces, if min characters are introduced.
         * @returns {void}
         */
    }
};
</script>

<template lang="html">
    <div
        v-for="category in limitedSortedSearchResults.availableCategories"
        id="search-bar-suggestion-list"
        :key="category"
    >
        <h5
            id="search-bar-suggestion-heading"
            class="bold mb-4 mt-4"
        >
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
    </div>
</template>

<style lang="scss" scoped>
</style>
