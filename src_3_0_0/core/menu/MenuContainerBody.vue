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
        side: {
            type: String,
            default: "mainMenu",
            validator: value => value === "mainMenu" || value === "secondaryMenu"
        }
    },
    computed: {
        ...mapGetters("Menu", ["mainMenu", "secondaryMenu"]),
        ...mapGetters("MenuNavigation", ["componentFromPath", "objectFromPath", "lastEntry"]),
        menu () {
            return this.side === "mainMenu" ? this.mainMenu : this.secondaryMenu;
        }
    },
    methods: {
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
            v-bind="objectFromPath(side)"
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
