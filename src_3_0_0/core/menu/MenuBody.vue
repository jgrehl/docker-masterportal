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
            default: "main",
            validator: value => value === "main" || value === "secondary"
        }
    },
    computed: {
        ...mapGetters("Menu", ["mainMenu", "secondaryMenu"]),
        ...mapGetters("MenuNavigation", ["componentFromPath", "objectFromPath", "lastEntry"]),
        menu () {
            return this.side === "main" ? this.mainMenu : this.secondaryMenu;
        }
    }
};
</script>

<template>
    <div class="offcanvas-body">
        <!-- TODO(rullkoma): Make navigation work for each side -->
        <MenuNavigation />
        <component
            :is="componentFromPath"
            v-bind="objectFromPath"
            v-if="lastEntry"
            :path="lastEntry"
        />
        <MenuSection
            v-for="(_, key) in menu.sections"
            v-else
            :key="key"
            :section-index="key"
            :side="side + 'Menu'"
        />
    </div>
</template>
