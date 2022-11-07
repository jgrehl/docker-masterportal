<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "MenuNavigation",
    props: {
        /** Defines in which menu the component is being rendered */
        side: {
            type: String,
            required: true,
            validator: value => value === "mainMenu" || value === "secondaryMenu"
        }
    },
    computed: {
        ...mapGetters("Menu", ["objectFromPath"]),
        ...mapGetters("Menu/Navigation", ["lastEntry", "previousEntry"]),
        /**
         * If no previousEntry besides the menu is present, show the menu String.
         * Otherwise, show the name of the folder.
         * @returns {String} Value to be displayed.
         */
        entry () {
            return !this.previousEntry(this.side) ? i18next.t("common:menu.name") : this.objectFromPath(this.side, "previous").name;
        }
    },
    methods: {
        ...mapActions("Menu/Navigation", ["navigateBack"])
    }
};
</script>

<template>
    <a
        v-if="lastEntry(side)"
        :id="'menu-offcanvas-body-navigation-' + side"
        href="#"
        @click="navigateBack(side)"
        @keypress="navigateBack(side)"
    >
        <h5>&#60; {{ entry }}</h5>
    </a>
</template>

<style lang="scss" scoped>
@import "~variables";
</style>
