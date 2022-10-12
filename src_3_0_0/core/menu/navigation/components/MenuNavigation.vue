<script>
import {mapGetters, mapMutations} from "vuex";

export default {
    name: "MenuNavigation",
    props: {
        side: {
            type: String,
            required: true,
            validator: value => value === "main" || value === "secondary"
        }
    },
    computed: {
        ...mapGetters("MenuNavigation", ["lastEntry", "previousEntry", "objectFromPath"])
    },
    methods: {
        ...mapMutations("MenuNavigation", ["removeLastEntry"])
    }
};
</script>

<template>
    <div>
        <a
            v-if="lastEntry(side)"
            href="#"
            @click="removeLastEntry(side)"
            @keypress="removeLastEntry(side)"
        >
            <h5>
                &#60; {{ !previousEntry(side) ? $t('common:menu.name') : objectFromPath(side).title }}
            </h5>
        </a>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
</style>
