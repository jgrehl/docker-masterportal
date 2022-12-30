<script>
import {mapActions, mapGetters} from "vuex";

export default {
    name: "MenuNavigation",
    props: {
        /** Defines in which menu the component is being rendered */
        side: {
            type: String,
            required: true,
            validator: value => value === "mainMenu" || value === "secondaryMenu"
        }
    },
    computed: {
        ...mapGetters("Menu", ["objectFromPath"]),
        ...mapGetters("Menu", ["previuosNavigationEntry", "currentComponent"]),

        currentModuleTitle () {

            const pascalCaseModuleName = this.currentComponent(this.side).charAt(0).toUpperCase() + this.currentComponent(this.side).slice(1),
                moduleNamePath = "Modules/" + pascalCaseModuleName + "/name",
                currentComponentName = this.$store.getters[moduleNamePath] ? this.$store.getters[moduleNamePath] : this.currentComponent(this.side);

            return this.currentComponent(this.side) === "root" ? this.$t("common:menu.name") : this.$t(currentComponentName);
        },

        /**
         * If no previousEntry besides the menu is present, show the menu String.
         * Otherwise, show the name of the folder.
         * TODO: Folder!!!
         * @returns {String} Value to be displayed.
         */
        previousEntry () {
            const pascalCaseModuleName = this.previuosNavigationEntry(this.side).charAt(0).toUpperCase() + this.previuosNavigationEntry(this.side).slice(1),
                moduleNamePath = "Modules/" + pascalCaseModuleName + "/name",
                lastComponentName = this.$store.getters[moduleNamePath] ? this.$store.getters[moduleNamePath] : this.previuosNavigationEntry(this.side);

            return this.previuosNavigationEntry(this.side) === "root" ? this.$t("common:menu.name") : this.$t(lastComponentName);
        }
    },
    methods: {
        ...mapActions("Menu", ["navigateBack"])
    }
};
</script>

<template>
    <a
        v-if="previuosNavigationEntry(side)"
        :id="'mp-navigation-' + side"
        class="p-2 mp-menu-navigation"
        href="#"
        @click="navigateBack(side)"
        @keypress="navigateBack(side)"
    >
        <h6 class="mp-menu-navigation-link mb-3"><p class="bi-chevron-left" />{{ previousEntry }}</h6>
    </a>
    <h5
        v-if="previuosNavigationEntry(side)"
        class="mp-menu-navigation-moduletitle mb-4"
    >
        {{ currentModuleTitle }}
    </h5>
</template>

<style lang="scss" scoped>
@import "~variables";

.mp-menu-navigation{
    color: $black;
    display: flex;
}

.mp-menu-navigation-link{
    display: flex;
}

.mp-menu-navigation-moduletitle{
    display: flex;
}

</style>
