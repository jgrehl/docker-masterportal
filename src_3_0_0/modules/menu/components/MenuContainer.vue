<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
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
            "currentMenuWidth",
            "mainExpanded",
            "secondaryExpanded",
            "titleBySide"
        ]),

        /**
         * @returns {String} Defines whether the ResizeHandle should be displayed on the right or left side depending on the menu this component is rendered in.
         */
        handlePosition () {
            return this.side === "mainMenu" ? "right" : "left";
        },

        expanded () {
            return this.side === "mainMenu" ? this.mainExpanded : this.secondaryExpanded;
        }
    },
    watch: {
        mainMenu (mainMenu) {
            this.mergeMenuState({menu: mainMenu, side: "mainMenu"});
        },
        secondaryMenu (secondaryMenu) {
            this.mergeMenuState({menu: secondaryMenu, side: "secondaryMenu"});
        },
        isMobile (isMobile) {
            if (isMobile) {
                this.collapseMenues();
                this.setCurrentMenuWidth({side: this.side, width: "100%"});
            }
            else {
                this.setCurrentMenuWidth({side: this.side, width: "25%"});
            }
        }
    },
    created () {
        this.mergeMenuState({menu: this.menuFromConfig(this.side), side: this.side});

        if (this.isMobile) {
            this.collapseMenues();
            this.setCurrentMenuWidth({side: this.side, width: "100%"});
        }

    },
    methods: {
        ...mapMutations("Menu", [
            "collapseMenues",
            "mergeMenuState",
            "setCurrentMenuWidth"
        ]),
        ...mapActions("Menu", [
            "toggleMenu",
            "closeMenu"
        ])
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
        :style="expanded ? 'width:' + currentMenuWidth(side) : 'width:0'"
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
                :aria-label="$t('common:modules.menu.ariaLabelClose')"
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
            :mutation="setCurrentMenuWidth"
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
    transition: top 0.3s ease;
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
