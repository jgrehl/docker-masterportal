<script>
import {mapGetters, mapMutations} from "vuex";
import MenuContainerBody from "./MenuContainerBody.vue";
import ResizeHandle from "../../../shared/modules/resize/components/ResizeHandle.vue";


export default {
    name: "MenuContainer",
    components: {
        MenuContainerBody,
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
        ...mapGetters([
            "menuFromConfig",
            "isMobile",
            "uiStyle"
        ]),
        ...mapGetters("Menu", [
            "mainExpanded",
            "secondaryExpanded",
            "titleBySide",
            "toggleMenu"
        ]),

        /**
         * @returns {String} Defines whether the ResizeHandle should be displayed on the right or left side depending on the menu this component is rendered in.
         */
        handlePosition () {
            return this.side === "mainMenu" ? "right" : "left";
        }
    },
    watch: {
        mainMenu (mainMenu) {
            this.mergeMenuState({menu: mainMenu, side: "mainMenu"});
        },
        secondaryMenu (secondaryMenu) {
            this.mergeMenuState({menu: secondaryMenu, side: "secondaryMenu"});
        }
    },
    created () {
        this.mergeMenuState({menu: this.menuFromConfig(this.side), side: this.side});

        if (this.isMobile) {
            this.collapseMenues();
        }
    },
    methods: {
        ...mapMutations("Menu", [
            "collapseMenues",
            "mergeMenuState"
        ])
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
        <div
            :id="'mp-header-' + side"
            class="mp-menu-header"
        >
            <button
                :id="'mp-menu-header-close-button-' + side"
                type="button"
                class="btn-close p-2 mp-menu-header-close-button"
                :aria-label="$t('common:menu.ariaLabelClose')"
                @click="toggleMenu(side)"
            />
        </div>

        <MenuContainerBody
            :side="side"
        />
        <ResizeHandle
            :id="'mp-resize-handle-' + side"
            class="mp-menu-container-handle"
            :handle-position="handlePosition"
            :min-width="0.1"
            :max-width="0.6"
            :min-height="1"
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

.mp-menu-header{
    display: flex;
}
.mp-menu-header-close-button {
    display: block;
    position: absolute;
    right: 10px;
    top: 10px;
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
        top: 0rem;
        font-size: 2rem;
    }
    .mp-menu-header-close-button {
        display: none;
    }
 }

.mp-menu-table {
    height: 200px;
    position: fixed;
    left: calc(50% - 200px);
    top: calc(100% - 250px);
}
</style>
