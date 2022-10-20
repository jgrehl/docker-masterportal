<script>
import MenuContainerBodyItems from "./MenuContainerBodyItems.vue";
import MenuNavigation from "./navigation/components/MenuNavigation.vue";
import {mapGetters} from "vuex";

export default {
    name: "MenuContainerBody",
    components: {
        MenuContainerBodyItems,
        MenuNavigation
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
        ...mapGetters("Menu", ["componentFromPath", "mainMenu", "objectFromPath", "secondaryMenu"]),
        ...mapGetters("MenuNavigation", ["lastEntry"]),
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
    <div
        :id="'menu-offcanvas-body-' + side"
        class="offcanvas-body"
    >
        <MenuNavigation :side="side" />
        <component
            :is="componentFromPath(side)"
            v-bind="{idAppendix: side, ...objectFromPath(side, 'last')}"
            v-if="lastEntry(side)"
            :path="lastEntry(side)"
        />
        <template
            v-for="(_, key) in menu.sections"
            v-else
        >
            <MenuContainerBodyItems
                :key="key"
                :id-appendix="side"
                :path="path(key)"
            />
        </template>
    </div>
</template>
