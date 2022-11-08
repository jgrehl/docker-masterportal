<script>
import {mapActions, mapGetters} from "vuex";
import MenuContainerBody from "./MenuContainerBody.vue";
import MenuContainerHeader from "./MenuContainerHeader.vue";
import ResizeHandle from "../../../shared/components/ResizeHandle.vue";

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
        ...mapGetters(["isMobile", "mainMenu", "secondaryMenu"]),
        ...mapGetters("Menu", ["mainInitiallyOpen", "secondaryInitiallyOpen", "titleBySide"]),
        /**
         * @returns {string} Defines whether the ResizeHandle should be displayed on the right or left side depending on the menu this component is rendered in.
         */
        handlePosition () {
            return this.side === "mainMenu" ? "right" : "left";
        },
        /**
         * @returns {boolean} Whether the menu should be initially open.
         */
        initiallyOpen () {
            return this.side === "mainMenu" ? this.mainInitiallyOpen : this.secondaryInitiallyOpen;
        }
    },
    watch: {
        mainMenu (mainMenu) {
            this.mergeMenuState({mainMenu: mainMenu, secondaryMenu: this.secondaryMenu});
        },
        secondaryMenu (secondaryMenu) {
            this.mergeMenuState({mainMenu: this.mainMenu, secondaryMenu: secondaryMenu});
        }
    },
    created () {
        this.mergeMenuState({mainMenu: this.mainMenu, secondaryMenu: this.secondaryMenu});
    },
    methods: {
        ...mapActions("Menu", ["mergeMenuState"])
    }
};
</script>

<template>
    <div
        :id="'menu-offcanvas-' + side"
        class="offcanvas"
        :class="{
            'offcanvas-start': !isMobile && side === 'mainMenu',
            'offcanvas-end': !isMobile && side === 'secondaryMenu',
            'offcanvas-bottom': isMobile,
            'show': initiallyOpen,
            mobileOffCanvas: isMobile
        }"
        tabindex="-1"
        :aria-label="titleBySide(side) ? titleBySide(side).text : false"
        data-bs-scroll="true"
        data-bs-backdrop="false"
    >
        <template v-if="isMobile">
            <ResizeHandle
                :id="'menu-offcanvas-resize-handle-header-' + side"
                class="mobile-container-handle"
                handle-position="top"
                :min-height="0.1"
                :max-height="0.5"
            >
                <MenuContainerHeader :side="side" />
            </ResizeHandle>
            <ResizeHandle
                :id="'menu-offcanvas-resize-handle-body-' + side"
                class="mobile-container-handle"
                handle-position="top"
                :min-height="0.1"
                :max-height="0.5"
            >
                <MenuContainerBody :side="side" />
            </ResizeHandle>
        </template>
        <template v-else>
            <MenuContainerHeader :side="side" />
            <MenuContainerBody :side="side" />
            <ResizeHandle
                :id="'menu-offcanvas-resize-handle-' + side"
                class="menu-container-handle"
                :handle-position="handlePosition"
                :min-width="0.1"
                :max-width="0.5"
            >
                &#8942;
            </ResizeHandle>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.menu-container-handle {
    display: flex;
    width: 12px;
    align-items: center;
    justify-content: center;
}
.mobile-container-handle {
    position: static;
    width: auto;
    height: auto;
    background-color: transparent;
}
.mobileOffCanvas {
    height: 20%;
    width: 100%;
}
</style>
