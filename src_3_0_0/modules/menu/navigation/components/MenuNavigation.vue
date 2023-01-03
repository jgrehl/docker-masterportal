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
            return !this.previousEntry(this.side) ? this.$t("common:menu.name") : this.objectFromPath(this.side, "previous").name;
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
        :id="'mp-navigation-' + side"
        class="p-2 mp-menu-navigation"
        href="#"
        @click="navigateBack(side)"
        @keypress="navigateBack(side)"
    >
        <h5 class="mp-menu-navigation-link"><p class="bi-chevron-left" />{{ entry }}</h5>
    </a>
</template>

<style lang="scss" scoped>
@import "~variables";

.mp-menu-navigation{
    color: $black;
    margin-bottom: 25px;
    display: flex;
    position: sticky;
    top: 0;
    background-color: $menu-background-color;
}

.mp-menu-navigation-link{
    display: flex;
    >.bi-chevron-left {
        font-size: 21px;
    }
}

</style>
