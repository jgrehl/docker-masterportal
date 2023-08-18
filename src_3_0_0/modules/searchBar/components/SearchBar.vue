//commons
<script>
import {mapGetters, mapActions, mapMutations} from "vuex";


/**
 * Searchbar to access search results.
 * @module modules/SearchBar
 * @vue-computed {String} searchInputValue - The v-bind of search input value.
 */
export default {
    name: "SearchBar",
    computed: {
        ...mapGetters("Modules/SearchBar", [
            "configPaths",
            "minCharacters",
            "placeholder",
            "searchInput",
            "type",
            "searchResultsActive",
            "currentSide"
        ]),
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
        }
    },
    mounted () {
        this.initializeModule({configPaths: this.configPaths, type: this.type});
        this.overwriteDefaultValues();
        this.instantiateSearchInterfaces(this.$searchInterfaceAddons);
        this.setCurrentSide(this.portalConfig?.mainMenu?.searchBar !== undefined ? "mainMenu" : "secondaryMenu");
    },
    methods: {
        ...mapActions(["initializeModule"]),
        ...mapActions("Modules/SearchBar", ["instantiateSearchInterfaces", "overwriteDefaultValues", "search", "startSearch"]),
        ...mapMutations("Modules/SearchBar", ["setSearchInput", "setShowAllResults", "setSearchResultsActive", "setCurrentSide"]),
        ...mapActions("Menu", ["clickedMenuElement", "navigateBack", "resetMenu"])
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
                id="search-bar-input"
                v-model="searchInputValue"
                type="search"
                class="form-control"
                :placeholder="$t(placeholder)"
                :aria-label="$t(placeholder)"
                @click="resetMenu(currentSide)"
                @input="startSearch"
                @keydown.enter="startSearch"
            >
        </div>
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

