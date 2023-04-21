<script>
import MenuContainerBodyRoot from "./MenuContainerBodyRoot.vue";
import MenuNavigation from "./MenuNavigation.vue";
import {mapGetters} from "vuex";
import GetFeatureInfo from "../../getFeatureInfo/components/GetFeatureInfo.vue";

export default {
    name: "MenuContainerBody",
    components: {
        GetFeatureInfo,
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
            "defaultComponent",
            "mainMenu",
            "secondaryMenu",
            "mainExpanded",
            "secondaryExpanded"
        ]),
        ...mapGetters("Modules", ["componentMap"]),

        /**
         * @returns {Object} Menu configuration for the given menu.
         */
        menu () {
            return this.side === "mainMenu" ? this.mainMenu : this.secondaryMenu;
        },

        /**
         * @returns {Object} Returns the currently visible Component.
         */
        currentComponent () {
            let current = this.menu.navigation.currentComponent.type;

            if (current !== "root" && current !== this.defaultComponent) {
                current = this.componentMap[current];
            }
            return current;
        }
    }
};
</script>

<template>
    <div
        :id="'mp-body-' + side"
        class="mp-menu-body"
        :class="
            {'mp-menu-body-collapsed': !mainExpanded && side === 'mainMenu' || !secondaryExpanded && side === 'secondaryMenu'}
        "
    >
        <MenuNavigation :side="side" />
        <GetFeatureInfo
            v-if="side === 'secondaryMenu'"
            v-show="currentComponent === 'getFeatureInfo'"
        />

        <component
            :is="currentComponent"
            v-if="currentComponent !== 'root' && currentComponent !== 'getFeatureInfo'"
            :side="side"
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
        height: 100%;
        max-height: 100%;

        &-collapsed {
            padding: 0;
            display: none;
        }
    }

    #mp-body-secondaryMenu {
        overflow-y: unset;
    }

    @include media-breakpoint-up(sm)  {

        #mp-body-secondaryMenu {
            overflow-y: auto;
        }
        .mp-menu-body-collapsed {
            display: flex;
        }

    }
</style>
