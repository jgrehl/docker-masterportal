<script>
import {mapGetters, mapActions} from "vuex";
import SearchBarSuggestionList from "./SearchBarSuggestionList.vue";
import SearchBarResultList from "./SearchBarResultList.vue";

export default {
    name: "SearchBar",
    components: {
        SearchBarSuggestionList,
        SearchBarResultList
    },
    computed: {
        ...mapGetters("Modules/SearchBar", [
            "searchInterfaceInstances",
            "searchResults",
            "searchSuggestions"
        ])
    },
    watch: {
        searchResults: {
            handler (searchResults) {
                /* eslint-disable no-console */
                console.log("SearchResults:");
                console.log(searchResults);
            },
            deep: true
        },
        searchSuggestions: {
            handler (searchSuggestions) {
                /* eslint-disable no-console */
                console.log("SearchSuggestions:");
                console.log(searchSuggestions);
            },
            deep: true
        }
    },
    mounted () {
        this.overwriteDefaultValues();
        this.instantiateSearchInterfaces();

        // Testcase
        setTimeout(() => {
            const testSearchInput = "Neuenfelder Straße";

            /* eslint-disable no-console */
            console.log("Testcase:");
            console.log(`Search for "${testSearchInput}"`);
            console.log("SearchInterfaceInstaces:");
            console.log(this.searchInterfaceInstances);
            this.search({searchInput: testSearchInput});
        }, 500);
    },
    methods: {
        ...mapActions("Modules/SearchBar", ["instantiateSearchInterfaces", "overwriteDefaultValues", "search"])
    }
};
</script>

<template lang="html">
    <div id="search-bar">
        <SearchBarSuggestionList />
        <SearchBarResultList />
    </div>
</template>

<style lang="scss" scoped>
</style>

