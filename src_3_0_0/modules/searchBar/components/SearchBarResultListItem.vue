<script>
import {mapGetters} from "vuex";

export default {
    name: "SearchBarResultListItem",
    computed: {
        ...mapGetters("Modules/SearchBar", [])
    }
};
</script>

<template lang="html">
    <div id="search-bar-result-list-item">
        <!-- do something -->
    </div>
</template>

<style lang="scss" scoped>
</style>

