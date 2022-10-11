<script>
import {mapGetters} from "vuex";
import MenuContainer from "./MenuContainer.vue";
import MenuNavigation from "./navigation/components/MenuNavigation.vue";
import PortalTitle from "./portalTitle/components/PortalTitle.vue";
import MenuSection from "./MenuSection.vue";


export default {
    name: "MenuWrapper",
    components: {
        MenuSection,
        MenuContainer,
        MenuNavigation,
        PortalTitle
    },
    data: () => ({additionalLeftNavigationPath: []}),
    computed: {
        ...mapGetters(["portalConfig"]),
        ...mapGetters("Menu", ["componentMap", "mainMenu", "secondaryMenu"]),
        ...mapGetters("MenuNavigation", {lastNavigationPath: "lastEntry"}) // @todo: make navigation work for each side
    },
    methods: {
        ...mapGetters("Menu", ["section"]),
        updateLeftNavigationPath (val) {
            this.additionalLeftNavigationPath.push(val);
        },
        getComponentFromPath () {
            return this.componentMap[this.getObjectFromPath().itemType];
        },
        getObjectFromPath () {
            return this.section()(this.lastNavigationPath);
        }
    }
};
</script>

<template>
    <div id="menu-offcanvas-wrapper">
        <MenuContainer
            v-if="mainMenu"
            :class="mainMenu.initiallyOpen ? 'show' : ''"
        >
            <template #header>
                <PortalTitle
                    v-if="mainMenu.title"
                    v-bind="mainMenu.title"
                />
            </template>
            <template #body>
                <!-- @Todo:Make navigation work for each side-->
                <MenuNavigation />
                <component
                    :is="getComponentFromPath()"
                    v-bind="getObjectFromPath()"
                    v-if="lastNavigationPath"
                    :path="lastNavigationPath"
                />
                <MenuSection
                    v-for="(_,key) in mainMenu.sections"
                    v-else
                    :key="key"
                    :section-index="key"
                    :side="'mainMenu'"
                />
            </template>
        </MenuContainer>
        <MenuContainer
            v-if="secondaryMenu"
            side="end"
            :class="secondaryMenu.initiallyOpen ? 'show' : ''"
        />
    </div>
</template>

<style lang="scss" scoped>
</style>
