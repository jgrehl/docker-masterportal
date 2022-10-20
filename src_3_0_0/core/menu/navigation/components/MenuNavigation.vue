<script>
import {mapGetters, mapMutations} from "vuex";

export default {
    name: "MenuNavigation",
    props: {
        side: {
            type: String,
            required: true,
            validator: value => value === "mainMenu" || value === "secondaryMenu"
        }
    },
    computed: {
        ...mapGetters("Menu", ["objectFromPath"]),
        ...mapGetters("MenuNavigation", ["lastEntry", "previousEntry"]),
        entry () {
            return !this.previousEntry(this.side) ? i18next.t("common:menu.name") : this.objectFromPath(this.side, "previous").title;
        }
    },
    methods: {
        ...mapMutations("MenuNavigation", ["removeLastEntry"])
    }
};
</script>

<template>
    <a
        v-if="lastEntry(side)"
        :id="'menu-offcanvas-body-navigation-' + side"
        href="#"
        @click="removeLastEntry(side)"
        @keypress="removeLastEntry(side)"
    >
        <h5>&#60; {{ entry }}</h5>
    </a>
</template>

<style lang="scss" scoped>
@import "~variables";
</style>
