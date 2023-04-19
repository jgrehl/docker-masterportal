<script>
import {mapGetters} from "vuex";
import SearchBarSuggestionListItem from "./SearchBarSuggestionListItem.vue";

export default {
    name: "SearchBarSuggestionList",
    components: {
        SearchBarSuggestionListItem
    },
    computed: {
        ...mapGetters("Modules/SearchBar", [])
    }
};
</script>

<template lang="html">
    <div id="search-bar-suggestion-list">
        <SearchBarSuggestionListItem />
    </div>
</template>

<style lang="scss" scoped>
</style>

