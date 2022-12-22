<script>
import {mapGetters, mapActions} from "vuex";
import MenuContainerBody from "./MenuContainerBody.vue";
import MenuContainerHeader from "./MenuContainerHeader.vue";
import ResizeHandle from "../../../shared/modules/resize/components/ResizeHandle.vue";


export default {
    name: "MenuContainer",
    components: {
        MenuContainerBody,
        MenuContainerHeader,
        ResizeHandle
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
        ...mapGetters(["uiStyle", "mainMenuFromConfig", "secondaryMenuFromConfig"]),
        ...mapGetters("Menu", ["mainExpanded", "secondaryExpanded", "titleBySide"]),
        /**
         * @returns {string} Defines whether the ResizeHandle should be displayed on the right or left side depending on the menu this component is rendered in.
         */
        handlePosition () {
            return this.side === "mainMenu" ? "right" : "left";
        }
    },
    watch: {
        mainMenu (mainMenu) {
            this.mergeMenuState({mainMenu: mainMenu, secondaryMenu: this.secondaryMenuFromConfig});
        },
        secondaryMenu (secondaryMenu) {
            this.mergeMenuState({mainMenu: this.mainMenuFromConfig, secondaryMenu: secondaryMenu});
        }
    },
    created () {
        this.mergeMenuState({mainMenu: this.mainMenuFromConfig, secondaryMenu: this.secondaryMenuFromConfig});
    },
    methods: {
        ...mapActions("Menu", ["mergeMenuState"])
    }
};
</script>

<template>
    <div
        :id="'mp-menu-' + side"
        class="mp-menu shadow collapse"
        :class="[
            'mp-' + side,
            {
                'mp-menu-table': uiStyle === 'TABLE',
                'show': mainExpanded && side === 'mainMenu' || secondaryExpanded && side === 'secondaryMenu'
            }
        ]"
        tabindex="-1"
        :aria-label="titleBySide(side) ? titleBySide(side).text : null"
    >
        <MenuContainerHeader
            :side="side"
        />
        <MenuContainerBody
            :side="side"
        />
        <ResizeHandle
            :id="'mp-resize-handle-' + side"
            class="mp-menu-container-handle"
            :handle-position="handlePosition"
            :min-width="0.1"
            :max-width="0.5"
        >
            &#8942;
        </ResizeHandle>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
.mp-menu {
    height: 100%;
    min-width: 100%;
    position: fixed;
    background-color: $menu-background-color;
    z-index: 2;
    overflow-y: auto;
}

.mp-mainMenu {
    left: 0px;
}

.mp-secondaryMenu {
    top: 80%;
    position: absolute;
}

.mp-menu-container-handle {
    display: none;
}


@include media-breakpoint-up(sm)  {
    .mp-menu {
        top: 0px;
        min-width: 20%;
        flex-grow: 0;
        flex-shrink: 0;
        position: relative;
    }

    .mp-mainMenu {
        left: 0;
    }

    .mp-secondaryMenu {
       right:0;
    }

    .mp-menu-container-handle {
        display: flex;
        width: 12px;
        align-items: center;
        justify-content: center;
        top: 0em;
        font-size: 2em;
    }
 }

.mp-menu-table {
    height: 200px;
    position: fixed;
    left: calc(50% - 200px);
    top: calc(100% - 250px);
}
</style>
