<script>
import {mapGetters} from "vuex";
import SearchBarResultListItem from "./SearchBarResultListItem.vue";

/**
 * Search Bar Result List
 * @module modules/SearchBarResultList
 */
export default {
    name: "SearchBarResultList",
    components: {
        SearchBarResultListItem
    },
    computed: {
        ...mapGetters("Modules/SearchBar", [])
    }
};
</script>

<template lang="html">
    <div id="search-bar-result-list">
        <SearchBarResultListItem />
    </div>
</template>

<style lang="scss" scoped>
</style>

