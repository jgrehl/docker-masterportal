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
        ...mapGetters("Menu", ["previousNavigationEntryText", "currentComponentName"]),

        previousNavigation () {
            return this.previousNavigationEntryText(this.side);
        },

        currentTitle () {
            return this.currentComponentName(this.side);
        }
    },
    methods: {
        ...mapActions("Menu", ["navigateBack"])
    }
};
</script>

<template>
    <div :id="'mp-menu-navigation-' + side">
        <a
            v-if="previousNavigation"
            :id="'mp-navigation-' + side"
            class="p-2 mp-menu-navigation"
            href="#"
            @click="navigateBack(side)"
            @keypress="navigateBack(side)"
        >
            <h6 class="mp-menu-navigation-link mb-3"><p class="bi-chevron-left" />{{ previousNavigation }}</h6>
        </a>
        <h5
            v-if="previousNavigation"
            class="mp-menu-navigation-moduletitle mb-4"
        >
            {{ currentTitle }}
        </h5>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

.mp-menu-navigation{
    color: $black;
    display: flex;
}

.mp-menu-navigation-link{
    display: flex;
}

.mp-menu-navigation-moduletitle{
    display: flex;
}

</style>
