<script>
import {mapActions, mapGetters} from "vuex";
import isModuleVisible from "../../../shared/js/utils/isModuleVisible";
import SimpleButton from "../../../shared/modules/buttons/components/SimpleButton.vue";

export default {
    name: "MenuContainerBodyElement",
    components: {
        SimpleButton
    },
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
        }
    },
    computed: {
        ...mapGetters(["deviceMode", "portalConfig"]),
        ...mapGetters("Maps", ["mode"]),

        /**
         * @returns {boolean} Depending on whether the icon is given it is decided whether on is shown.
         */
        showIcon () {
            return typeof this.icon === "string" && this.icon.length > 0;
        }
    },
    mounted () {
        if (this.$attrs?.active) {
            this.clickedMenuElement(this.path);
        }
    },
    methods: {
        ...mapActions("Menu", ["clickedMenuElement"]),

        /**
         * Checks if the module is to be applied in the map- and device mode.
         * @returns {Boolean} The module is shown.
         */
        checkIsVisible () {
            const supportedMapModes = this.$attrs.supportedMapModes,
                supportedDevices = this.$attrs.supportedDevices,
                supportedTreeTypes = this.$attrs.supportedTreeTypes;

            return isModuleVisible(this.mode, this.deviceMode, this.portalConfig?.tree?.type, supportedMapModes, supportedDevices, supportedTreeTypes);
        }
    }

};
</script>

<template>
    <div>
        <SimpleButton
            v-if="checkIsVisible() && !($attrs.isVisibleInMenu === false)"
            :interaction="() => clickedMenuElement(path)"
            :text="name"
            :icon="showIcon ? icon : null"
            customclass="w-100 justify-content-start"
        />
        <!-- TODO(roehlipa): Properly add description -->
        <!-- TODO(roehlipa): Buttons should look differently when mobile -->
    </div>
</template>
