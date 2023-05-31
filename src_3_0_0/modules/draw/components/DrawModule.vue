<script>
import {mapGetters} from "vuex";

export default {
    name: "DrawModule",
    computed: {
        ...mapGetters("Modules/Draw", [])
    }
};
</script>

<template lang="html">
    <div id="modules-draw-module">
        <!-- import share components -->
    </div>
</template>

<style lang="scss" scoped>
</style>

