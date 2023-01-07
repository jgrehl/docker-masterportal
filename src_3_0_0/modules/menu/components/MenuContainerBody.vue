<script>
import MenuContainerBodyRoot from "./MenuContainerBodyRoot.vue";
import MenuNavigation from "./MenuNavigation.vue";
import {mapGetters} from "vuex";

export default {
    name: "MenuContainerBody",
    components: {
        MenuContainerBodyRoot,
        MenuNavigation
    },
    props: {
        /** Defines in which menu the component is being rendered */
        side: {
            type: String,
            default: "mainMenu",
            validator: value => value === "mainMenu" || value === "secondaryMenu"
        }
    },
    computed: {
        ...mapGetters("Menu", [
            "componentsAlwaysActivated",
            "mainMenu",
            "secondaryMenu"
        ]),
        ...mapGetters("Modules", ["componentMap"]),

        /**
         * @returns {object} Menu configuration for the given menu.
         */
        menu () {
            return this.side === "mainMenu" ? this.mainMenu : this.secondaryMenu;
        },

        /**
         * @returns {object} Returns the currently visible Component.
         */
        currentComponent () {
            let current = this.menu.navigation.currentComponent.type;

            if (current !== "root") {
                current = this.componentMap[current];

            }
            return current;
        }
    },
    methods: {
        /**
         * @param {Number} sectionIndex Index inside of a section of a menu.
         * @returns {Array} Returns the path for a section inside the menu this component is rendered in.
         */
        path (sectionIndex) {
            return [this.side, "sections", sectionIndex];
        }
    }
};
</script>

<template>
    <div
        :id="'mp-body-' + side"
        class="mp-menu-body"
    >
        <MenuNavigation :side="side" />

        <!-- mount components which need to be always active in background because of eventlisteners etc. -->
        <template v-for="component in componentsAlwaysActivated">
            <component
                :is="component.module"
                v-if="side === component.menuSide"
                :key="'module-' + component.module.name"
            />
        </template>

        <component
            :is="currentComponent"
            v-if="currentComponent !== 'root'"
        />

        <MenuContainerBodyRoot
            v-show="currentComponent === 'root'"
            :side="side"
        />
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
    .mp-menu-body {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: $padding;
        font-size: $font-size-base;
        overflow-y: auto;
        max-height: 100%;
    }
</style>
