<script>
import MenuNavigation from "./navigation/components/MenuNavigation.vue";
import MenuSection from "./MenuSection.vue";
import {mapGetters} from "vuex";

export default {
    name: "MenuBody",
    components: {
        MenuNavigation,
        MenuSection
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
    }
};
</script>

<template>
    <div class="offcanvas-body">
        <MenuNavigation :side="side" />
        <component
            :is="componentFromPath(side)"
            v-bind="objectFromPath(side)"
            v-if="lastEntry(side)"
            :path="lastEntry(side)"
        />
        <MenuSection
            v-for="(_, key) in menu.sections"
            v-else
            :key="key"
            :section-index="key"
            :side="side"
        />
    </div>
</template>
