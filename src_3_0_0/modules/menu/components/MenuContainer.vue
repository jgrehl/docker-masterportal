<script>
import {mapGetters, mapActions} from "vuex";
import MenuContainerBody from "./MenuContainerBody.vue";
import MenuContainerHeader from "./MenuContainerHeader.vue";
import ResizeHandle from "../../../shared/components/ResizeHandle.vue";


export default {
    name: "MenuContainer",
    components: {
        ResizeHandle,
        MenuContainerBody,
        MenuContainerHeader
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
        ...mapGetters(["uiStyle"]),
        ...mapGetters("Menu", ["mainMenuExpanded", "secondaryMenuExpanded", "titleBySide"]),
        /**
         * @returns {boolean} Whether the menu should be initially open.
         */
        initiallyOpen () {
            return this.side === "mainMenu" ? this.mainInitiallyOpen : this.secondaryInitiallyOpen;
        },
        /**
         * @returns {string} Defines whether the ResizeHandle should be displayed on the right or left side depending on the menu this component is rendered in.
         */
        handlePosition () {
            return this.side === "mainMenu" ? "right" : "left";
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
        v-if="uiStyle !== 'SIMPLE'"
        :id="'mp-menu-' + side"
        class="mp-menu collapse"
        :class="{
            'mp-menu-main': side === 'mainMenu',
            'mp-menu-secondary': side === 'secondaryMenu',
            'mp-menu-table': uiStyle === 'TABLE',
            'show': mainMenuExpanded && side === 'mainMenu' || secondaryMenuExpanded && side === 'secondaryMenu'
        }"
        tabindex="-1"
        :aria-label="titleBySide(side) ? titleBySide(side).text : false"
    >
        <MenuContainerHeader
            :side="side"
        />
        <MenuContainerBody
            :side="side"
        />
        <ResizeHandle
            :id="'menu-offcanvas-resize-handle-' + side"
            class="menu-container-handle"
            :handle-position="handlePosition"
            :min-width="0.1"
            :max-width="0.5"
        >
            &#8942;
        </ResizeHandle>
    </div>
</template>

<style lang="scss" scoped>
.mp-menu {
    height: 100%;
    width: 100%;
    position: fixed;
    background-color: white;
    z-index: 1;
}

.mp-menu-main {
    left: 0px;
}

.mp-menu-secondary {
    top: 80%;
    position: absolute;
}

.menu-container-handle {
    display: none;
}


@media (min-width: 768px) {
    .mp-menu {
        top: 0px;
        width: 400px;
        position: relative;
        flex-grow: 0;
        flex-shrink: 0;
    }

    .mp-menu-main {
        left: 0px;
    }

    .mp-menu-secondary {
       right:0em;
       position: relative;
    }

    .menu-container-handle {
        display: flex;
        width: 6px;
        align-items: center;
        justify-content: center;
        top: 0em;
    }
 }


.mp-menu-table {
    height: 200px;
    position: fixed;
    left: calc(50% - 200px);
    top: calc(100% - 250px);
}
</style>
