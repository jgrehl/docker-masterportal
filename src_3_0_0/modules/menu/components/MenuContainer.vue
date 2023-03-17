<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import MenuContainerBody from "./MenuContainerBody.vue";
import ResizeHandle from "../../../shared/modules/resize/components/ResizeHandle.vue";

let lastMainMenuWidth = "",
    lastSecondaryMenuWidth = "10%";

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
            "titleBySide"
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
        },
        mainExpanded () {
            this.setWidth("mainMenu");
        },
        secondaryExpanded () {
            if (!this.isMobile) {
                this.setWidth("secondaryMenu");
            }
        }
    },
    created () {
        this.mergeMenuState({menu: this.menuFromConfig(this.side), side: this.side});

        if (this.isMobile) {
            this.collapseMenues();
        }

    },
    mounted () {
        if (!this.isMobile && this.side === "secondaryMenu") {
            this.setWidth(this.side);
        }
    },
    methods: {
        ...mapMutations("Menu", [
            "collapseMenues",
            "mergeMenuState"
        ]),
        ...mapActions("Menu", [
            "toggleMenu",
            "closeMenu"
        ]),
        setWidth (side) {
            const menu = side === "mainMenu" ? document.getElementById("mp-menu-mainMenu") : document.getElementById("mp-menu-secondaryMenu"),
                expanded = side === "mainMenu" ? this.mainExpanded : this.secondaryExpanded;

            let lastWidth = side === "mainMenu" ? lastMainMenuWidth : lastSecondaryMenuWidth;

            if (this.isMobile) {
                lastWidth = "100%";
            }

            if (expanded && menu && menu.style.width) {
                if (lastWidth !== "") {
                    menu.style.width = lastWidth;
                }
            }
            else if (!expanded && menu && menu.style.width !== "0px") {
                if (side === "mainMenu") {
                    lastMainMenuWidth = menu.style.width;
                }
                else if (side === "secondaryMenu") {
                    lastSecondaryMenuWidth = menu.style.width;
                }
                menu.style.width = 0;
            }
        }
    }
};
</script>

<template>
    <div
        :id="'mp-menu-' + side"
        class="mp-menu shadow"
        :class="[
            'mp-' + side,
            {
                'mp-menu-table': uiStyle === 'TABLE',
                'mp-secondaryMenu-expanded': secondaryExpanded && side === 'secondaryMenu'
            }
        ]"
        tabindex="-1"
        :aria-label="titleBySide(side) ? titleBySide(side).text : null"
    >
        <div
            :id="'mp-header-' + side"
            class="mp-menu-header"
            :class="
                {'mp-menu-header-collapsed': !mainExpanded && side === 'mainMenu' || !secondaryExpanded && side === 'secondaryMenu'}
            "
        >
            <button
                :id="'mp-menu-header-close-button-' + side"
                type="button"
                class="btn-close p-2 mp-menu-header-close-button"
                :aria-label="$t('common:menu.ariaLabelClose')"
                @click="closeMenu(side)"
            />
        </div>

        <MenuContainerBody
            :side="side"
        />
        <ResizeHandle
            v-if="!isMobile"
            :id="'mp-resize-handle-' + side"
            class="mp-menu-container-handle"
            :handle-position="handlePosition"
            :min-width="0"
            :max-width="0.6"
            :min-height="1"
        >
            &#8942;
        </ResizeHandle>
    </div>
</template>

<style lang="scss">
@import "~variables";
.mp-menu {
    height: 100%;
    position: fixed;
    background-color: $menu-background-color;
    transition: width 0.3s ease;
    z-index: 2;
}

.mp-mainMenu {
    left: 0px;
}

.mp-secondaryMenu {
    border-radius: 15px 15px 0 0;
    height: 0;
    position: absolute;
    top: 100%;
    transition: all 0.3s ease;
    width: 100%;
    &-expanded {
        height: 100%;
        top: 70%;
    }
}


.mp-menu-header{
    display: flex;
    &-collapsed {
        padding: 0;
        display: none;
    }
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
        min-width: 0%;
        flex-grow: 0;
        flex-shrink: 0;
        position: relative;
    }

    .mp-mainMenu {
        left: 0;
    }

    .mp-secondaryMenu {
       border-radius: 0;
       right:0;
       width: unset;
       transition: width 0.3s ease;
    }

    .mp-menu-container-handle {
        display: flex;
        width: 9px;
        align-items: center;
        justify-content: center;
        top: 0rem;
        font-size: 2rem;

        &:hover {
            background-color: $light_grey_active;
        }
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
