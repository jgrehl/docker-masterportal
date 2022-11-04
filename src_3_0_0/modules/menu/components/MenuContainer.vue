<script>
import {mapActions, mapGetters} from "vuex";
import MenuContainerBody from "./MenuContainerBody.vue";
import MenuContainerHeader from "./MenuContainerHeader.vue";

export default {
    name: "MenuContainer",
    components: {
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
}


@media (min-width: 768px) {
    .mp-menu {
        width: 400px;
        top: 0px;
    }

    .mp-menu-main {
        left: 0px;
    }

    .mp-menu-secondary {
        right: 0px;
    }
 }

.mp-menu-table {
    height: 200px;
    position: fixed;
    left: calc(50% - 200px);
    top: calc(100% - 250px);
}
</style>
