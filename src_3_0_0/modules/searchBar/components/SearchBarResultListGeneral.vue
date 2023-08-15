<script>
import {mapGetters} from "vuex";
import SearchBarResultListGeneralItem from "./SearchBarResultListGeneralItem.vue";

/**
 * Searchbar result list to show the categorized overview or single search results.
 * @module modules/searchBar/components/SearchBarResultListGeneral
 * @vue-computed {Object} limitedSortedSearchResults - Results the limited and sorted search results.
 */
export default {
    name: "SearchBarResultListGeneral",
    components: {
        SearchBarResultListGeneralItem
    },
    props: {
        resultItems: {
            type: Array,
            required: true
        }
    },
    computed: {
        ...mapGetters("Modules/SearchBar", [
            "searchInput",
            "searchResults",
            "selectedSearchResults"
        ])
    }
};
</script>

<template lang="html">
    <div
        class="results-general-container"
    >
        <div
            v-for="(item, index) in resultItems"
            :key="item.id + '-' + index"
        >
            <p id="searchInputLi">
                <SearchBarResultListGeneralItem
                    :search-result="item"
                />
            </p>
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
</style>
