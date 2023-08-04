// How control which side is configured?
// Layout !
<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import SearchBarResultList from "./SearchBarResultList.vue";


/**
 * Searchbar to access search results.
 * @module modules/SearchBar
 * @vue-computed {String} searchInputValue - The v-bind of search input value.
 */
export default {
    name: "SearchBar",
    components: {
        SearchBarResultList
    },
    computed: {
        ...mapGetters("Modules/SearchBar", [
            "configPaths",
            "minCharacters",
            "placeholder",
            "searchInput",
            "type",
            "searchResultsActive"
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
    mounted () {
        this.initializeModule({configPaths: this.configPaths, type: this.type});
        this.overwriteDefaultValues();
        this.instantiateSearchInterfaces(this.$searchInterfaceAddons);
    },
    methods: {
        ...mapActions(["initializeModule"]),
        ...mapActions("Modules/SearchBar", ["instantiateSearchInterfaces", "overwriteDefaultValues", "search"]),
        ...mapMutations("Modules/SearchBar", ["setSearchInput", "setShowAllResults", "setSearchResultsActive"]),
        ...mapActions("Menu", ["clickedMenuElement", "navigateBack"]),

        /**
         * Starts the search in searchInterfaces, if min characters are introduced, updates the result list.
         * @returns {void}
         */
        startSearch () {
            if (this.searchInputValue.length >= parseInt(this.minCharacters, 10)) {
                this.setShowAllResults(false);
                if (!this.searchResultsActive) {
                    this.$store.state.Menu.mainMenu.navigation.history.push({0: {type: "root", props: []}});
                }
                this.setSearchResultsActive(true);
                this.search({searchInput: this.searchInputValue});

                this.clickedMenuElement({
                    name: "common:modules.searchBar.search",
                    side: "mainMenu",
                    type: "searchbarresultlist"
                });
            }
            if (this.searchInputValue.length < parseInt(this.minCharacters, 10) && this.searchResultsActive === true) {
                this.navigateBack("mainMenu");
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
       <!--  <SearchBarResultList /> -->
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

