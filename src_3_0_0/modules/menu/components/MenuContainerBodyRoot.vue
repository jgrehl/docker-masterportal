<script>
import LayerTree from "../../layerTree/components/LayerTree.vue";
import MenuContainerBodyRootItems from "./MenuContainerBodyRootItems.vue";
import MenuContainerBodyRootLogo from "./MenuContainerBodyRootLogo.vue";
import SearchBar from "../../searchBar/components/SearchBar.vue";
import {mapGetters} from "vuex";

export default {
    name: "MenuContainerBodyRoot",
    components: {
        LayerTree,
        MenuContainerBodyRootItems,
        MenuContainerBodyRootLogo,
        SearchBar
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
            "mainMenu",
            "secondaryMenu",
            "titleBySide"
        ]),

        /**
         * @returns {Object} Menu configuration for the given menu.
         */
        menu () {
            return this.side === "mainMenu" ? this.mainMenu : this.secondaryMenu;
        }
    },
    methods: {
        /**
         * Returns the path for a section inside the menu this component is rendered in.
         * @param {Number} sectionIndex Index inside of a section of a menu.
         * @returns {Array} Contains the path for a section.
         */
        path (sectionIndex) {
            return [this.side, "sections", sectionIndex];
        }
    }
};
</script>

<template>
    <div
        :id="'mp-body-root-'+side"
    >
        <MenuContainerBodyRootLogo
            v-if="titleBySide(side)"
            class="mb-2"
            v-bind="titleBySide(side)"
        />
        <SearchBar v-if="typeof menu.searchBar !== 'undefined'" />
        <LayerTree v-if="side === 'mainMenu'" />
        <template
            v-for="(_, key) in menu.sections"
            :key="key"
        >
            <MenuContainerBodyRootItems
                :id-appendix="side"
                :side="side"
                :path="path(key)"
            />
            <hr>
        </template>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

</style>
