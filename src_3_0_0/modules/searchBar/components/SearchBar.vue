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
            "configPaths",
            "minCharacters",
            "placeholder",
            "searchInput",
            "searchInterfaceInstances",
            "searchResults",
            "type"
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
                if(searchResults.length > 0){
                    this.openGetFeatureInfo(searchResults[0].events.onClick.openGetFeatureInfo);
                }
            },
            deep: true
        }
    },
    mounted () {
        this.initializeModule({configPaths: this.configPaths, type: this.type});
        this.overwriteDefaultValues();
        this.instantiateSearchInterfaces(this.$searchInterfaceAddons);
    },
    methods: {
        ...mapActions(["initializeModule"]),
        ...mapActions("Modules/SearchBar", ["instantiateSearchInterfaces", "overwriteDefaultValues", "startSearch"]),
        ...mapMutations("Modules/SearchBar", ["setSearchInput"])
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
                @xinput="startSearch"
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

