<script>
import LayerTree from "../../layerTree/components/LayerTree.vue";
import MenuContainerBodyItems from "./MenuContainerBodyItems.vue";
import {mapGetters} from "vuex";

export default {
    name: "MenuContainerBodyRoot",
    components: {
        LayerTree,
        MenuContainerBodyItems
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
            "secondaryMenu"
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
            console.log([this.side, "sections", sectionIndex]);
            return [this.side, "sections", sectionIndex];
        }
    }
};
</script>

<template>
    <div>
        <LayerTree v-if="side === 'mainMenu'" />
        <template
            v-for="(_, key) in menu.sections"
            :key="key"
        >
            <MenuContainerBodyItems
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
