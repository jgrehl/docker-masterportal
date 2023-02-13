<script>
import {mapActions, mapGetters} from "vuex";
import isModuleVisible from "../../../shared/js/utils/isModuleVisible";
import LightButton from "../../../shared/modules/buttons/components/LightButton.vue";

export default {
    name: "MenuContainerBodyRootItemElement",
    components: {LightButton},
    props: {
        /** Text displayed inside the element. */
        name: {
            type: String,
            required: true,
            validator: value => value !== ""
        },
        /** Description used as it's name and aria-label. May be displayed alongside the element. */
        description: {
            type: String,
            default: ""
        },
        /** Icon displayed inside the element*/
        icon: {
            type: String,
            default: "",
            validator: value => value.startsWith("bi-")
        },
        /** Whether the description should be displayed alongside the element. */
        showDescription: {
            type: Boolean,
            default: false
        },
        /** Path to find the element inside the store structure. */
        path: {
            type: Array,
            default: () => []
        },
        /** All properties of the module to show in menu. */
        properties: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters(["deviceMode", "portalConfig"]),
        ...mapGetters("Maps", ["mode"]),
        ...mapGetters("Menu", [
            "mainMenu",
            "secondaryMenu"
        ]),

        /**
         * @returns {Object} Menu configuration for the given menu.
         */
        menu () {
            return this.side === "mainMenu" ? this.mainMenu : this.secondaryMenu;
        },

        /**
         * @returns {Boolean} Depending on whether the icon is given it is decided whether on is shown.
         */
        showIcon () {
            return typeof this.icon === "string" && this.icon.length > 0;
        },

        /**
         * @returns {String} The menu side.
         */
        side () {
            return this.path[0];
        },

        /**
         * @returns {String} The type of the component.
         */
        type () {
            return this.properties.type;
        }
    },
    /**
     * Lifecycle-Hook: Sets the configured current component.
     * @returns {void}
     */
    created () {
        if (this.type === this.menu.currentComponent && this.type !== "folder") {
            this.clickedMenuElement({
                name: this.name,
                path: this.path,
                side: this.side,
                type: this.type
            });
        }
    },
    methods: {
        ...mapActions("Menu", ["clickedMenuElement"]),

        /**
         * Checks if the module is to be applied in the map- and device mode.
         * @returns {Boolean} The module is shown.
         */
        checkIsVisible () {
            const supportedMapModes = this.properties.supportedMapModes,
                supportedDevices = this.properties.supportedDevices,
                supportedTreeTypes = this.properties.supportedTreeTypes;

            return isModuleVisible(this.mode, this.deviceMode, this.portalConfig?.tree?.type, supportedMapModes, supportedDevices, supportedTreeTypes);
        }
    }

};
</script>

<template>
    <div>
        <LightButton
            v-if="checkIsVisible()"
            :interaction="() => clickedMenuElement({name, path, side, type})"
            :text="name"
            :icon="showIcon ? icon : null"
            :description="showDescription ? description : null"
            customclass="w-100 justify-content-start mp-menu-root-element"
        />
        <!-- TODO(roehlipa): Properly add description -->
        <!-- TODO(roehlipa): Buttons should look differently when mobile -->
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

.mp-menu-root-element {
    font-size: 0.9375rem;
    min-height: 2.3rem;
}

</style>
