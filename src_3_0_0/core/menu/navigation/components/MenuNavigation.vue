<script>

import {mapGetters, mapMutations} from "vuex";

export default {
    name: "MenuNavigation",
    data () {
        return {
            entries: []
        };
    },
    computed: {
        ...mapGetters("MenuNavigation", ["lastEntry"])
    },
    // mounted () {
    // },
    methods: {
        ...mapMutations("MenuNavigation", ["addEntry", "removeLastEntry"])
    }
};
</script>

<template>
    <div>
        <!-- TODO: ESLint: Visible, non-interactive elements with click handlers must have at least one keyboard listener.(vuejs-accessibility/click-events-have-key-events) -->
        <!-- eslint-disable-next-line -->
        <a
            v-if="lastEntry"
            @click="removeLastEntry"
        >
            &#60; {{ lastEntry }}
        </a>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
</style>
