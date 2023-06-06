<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
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
            "minCharacters",
            "placeholder",
            "searchInput",
            "searchInterfaceInstances",
            "searchResults"
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
        }
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
        this.instantiateSearchInterfaces(this.$searchInterfaceAddons);
    },
    methods: {
        ...mapActions("Modules/SearchBar", ["instantiateSearchInterfaces", "overwriteDefaultValues", "search"]),
        ...mapMutations("Modules/SearchBar", ["setSearchInput"]),

        /**
         * Starts the search in searchInterfaces, if min characters are introduced.
         * @returns {void}
         */
        startSearch () {
            if (this.searchInputValue.length >= parseInt(this.minCharacters, 10)) {
                this.search({searchInput: this.searchInputValue});
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
                :aria-label="$t(placeholder)"
                type="button"
                @click="startSearch"
            >
                <i
                    class="bi-search"
                    role="img"
                />
            </button>
            <input
                v-model="searchInputValue"
                type="search"
                class="form-control"
                :placeholder="$t(placeholder)"
                :aria-label="$t(placeholder)"
                @input="startSearch"
                @keydown.enter="startSearch"
            >
        </div>
        <SearchBarSuggestionList />
        <SearchBarResultList />
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

