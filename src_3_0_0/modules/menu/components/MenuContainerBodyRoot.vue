<script>
import LayerTree from "../../layerTree/components/LayerTree.vue";
import MenuContainerBodyRootItems from "./MenuContainerBodyRootItems.vue";
import MenuContainerHeaderTitle from "./MenuContainerHeaderTitle.vue";
import {mapGetters} from "vuex";

export default {
    name: "MenuContainerBodyRoot",
    components: {
        LayerTree,
        MenuContainerBodyRootItems,
        MenuContainerHeaderTitle
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
         * @returns {object} Menu configuration for the given menu.
         */
        menu () {
            return this.side === "mainMenu" ? this.mainMenu : this.secondaryMenu;
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
    <div>
        <MenuContainerHeaderTitle
            v-if="titleBySide(side)"
            v-bind="titleBySide(side)"
        />
        <input
            v-if="side === 'mainMenu'"
            class="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search">
        <keep-alive>
            <LayerTree v-if="side === 'mainMenu'" />
        </keep-alive>
        <template
            v-for="(_, key) in menu.sections"
            :key="key"
        >
            <MenuContainerBodyRootItems
                :id-appendix="side"
                :path="path(key)"
            />
        </template>
        <hr>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

</style>
