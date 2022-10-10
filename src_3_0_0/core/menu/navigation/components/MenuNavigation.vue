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
        ...mapGetters("MenuNavigation", ["previousEntry", "lastEntry"])
    },
    methods: {
        ...mapMutations("MenuNavigation", ["addEntry", "removeLastEntry"])
    }
};
</script>

<template>
    <div>
        <a
            v-if="lastEntry"
            href="#"
            @click="removeLastEntry"
            @keypress="removeLastEntry"
        >
            <h5>
                &#60; {{ lastEntry && !previousEntry ? "Menu" : previousEntry.props.name }}
            </h5>
        </a>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
</style>
