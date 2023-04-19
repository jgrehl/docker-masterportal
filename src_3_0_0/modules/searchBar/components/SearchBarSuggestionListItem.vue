<script>
import {mapGetters} from "vuex";

export default {
    name: "SearchBarSuggestionListItem",
    computed: {
        ...mapGetters("Modules/SearchBar", [])
    }
};
</script>

<template lang="html">
    <div id="search-bar-suggestion-list-item">
        <!-- do something -->
    </div>
</template>

<style lang="scss" scoped>
</style>

