<script>
import LayerTree from "../../layerTree/components/LayerTree.vue";
import MenuContainerBodyRoot from "./MenuContainerBodyRoot.vue";
import MenuNavigation from "./MenuNavigation.vue";
import {mapGetters, mapMutations} from "vuex";

export default {
    name: "MenuContainerBody",
    components: {
        LayerTree,
        MenuContainerBodyRoot,
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
        ...mapGetters("Modules", ["componentMap"]),

        /**
         * @returns {object} Menu configuration for the given menu.
         */
        menu () {
            return this.side === "mainMenu" ? this.mainMenu : this.secondaryMenu;
        },

        /**
         * @returns {object} Returns the currently visible Component.
         */
        currentComponent () {
            let current = this.menu.navigation.currentComponent;

            if (current !== "root") {
                current = this.componentMap[current];

            }

            return current;
        }
    },
    watch: {
        /**
         * Watch on componentsAlwaysActivated and adds this components to menu section.
         * @param {Object[]} components The always active actions.
         * @returns {void}
         */
        componentsAlwaysActivated: {
            handler (components) {
                this.updateModuleInMenuSection(components);
            },
            deep: true
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
                const typeName = component.module.name.charAt(0).toLowerCase() + component.module.name.substring(1),
                    side = component.menuSide;

                if (this[side].sections[0]?.find(module => module.type === typeName) === undefined) {
                    this.addModuleToMenuSection({
                        module: {
                            type: typeName
                        },
                        side: side
                    });
                }
            });
        },
        // @ todo remove if menu is new refactored
        doNotCreate (name = "") {
            return !["LayerSelection"].includes(name);
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
        <component
            :is="currentComponent"
            v-if="currentComponent !== 'root'"
        />

        <MenuContainerBodyRoot
            v-else
            :side="side"
        />
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
    .mp-menu-body {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        padding: $padding;
        font-size: $font-size-base;
        overflow-y: auto;
        max-height: 100%;
    }
</style>
