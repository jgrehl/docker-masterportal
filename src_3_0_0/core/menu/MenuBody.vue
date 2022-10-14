<script>
import MenuItems from "./MenuItems.vue";
import MenuNavigation from "./navigation/components/MenuNavigation.vue";
import {mapGetters} from "vuex";

export default {
    name: "MenuBody",
    components: {
        MenuItems,
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
    <div class="offcanvas-body">
        <MenuNavigation :side="side" />
        <component
            :is="componentFromPath(side)"
            v-bind="objectFromPath(side)"
            v-if="lastEntry(side)"
            :path="lastEntry(side)"
        />
        <div
            v-for="(_, key) in menu.sections"
            v-else
            :key="key"
        >
            <MenuItems
                :path="path(key)"
            />
        </div>
    </div>
</template>
