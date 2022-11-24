<script>
import MenuContainerBodyItems from "./MenuContainerBodyItems.vue";
import MenuNavigation from "../navigation/components/MenuNavigation.vue";
import {mapGetters, mapMutations} from "vuex";

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
        ...mapGetters("Menu", [
            "componentsAlwaysActivated",
            "componentFromPath",
            "deactivateModule",
            "mainMenu",
            "objectFromPath",
            "secondaryMenu"
        ]),
        ...mapGetters("Menu/Navigation", ["lastEntry"]),

        /**
         * @returns {object} Menu configuration for the given menu.
         */
        menu () {
            return this.side === "mainMenu" ? this.mainMenu : this.secondaryMenu;
        }
    },
    watch: {
        /**
         * Watch on componentsAlwaysActivated and adds this components to menu section.
         * @param {Object[]} components The always active actions.
         * @returns {void}
         */
        componentsAlwaysActivated (components) {
            this.updateModuleInMenuSection(components);
        }
    },
    mounted () {
        this.updateModuleInMenuSection(this.componentsAlwaysActivated);
    },
    methods: {
        ...mapMutations("Menu", ["addModuleToMenuSection"]),

        /**
         * @param {Number} sectionIndex Index inside of a section of a menu.
         * @returns {Array} Returns the path for a section inside the menu this component is rendered in.
         */
        path (sectionIndex) {
            return [this.side, "sections", sectionIndex];
        },

        updateModuleInMenuSection (components) {
            components.forEach(component => {
                const name = component.module.name,
                    side = component.menuSide;

                if (this[side].sections[0]?.find(module => module.type === name) === undefined) {
                    this.addModuleToMenuSection({
                        module: {
                            type: name
                        },
                        side: side
                    });
                }
            });
        }
    }
};
</script>

<template>
    <div
        :id="'mp-body-' + side"
        class="mp-menu-body"
    >
        <MenuNavigation :side="side" />
        <template v-for="component in componentsAlwaysActivated">
            <component
                :is="component.module"
                v-if="side === component.menuSide && !deactivateModule(component.module.name)"
                :key="'module-' + component.module.name"
            />
        </template>
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

<style lang="scss" scoped>
@import "~variables";
    .mp-menu-body{
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: $padding;
        font-size: $font-size-base;
    }
</style>
