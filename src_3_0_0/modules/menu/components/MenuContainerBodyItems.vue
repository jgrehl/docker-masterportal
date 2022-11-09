<script>
import {mapGetters} from "vuex";
import MenuContainerBodyElement from "./MenuContainerBodyElement.vue";
import upperFirst from "../../../shared/js/utils/upperFirst";

export default {
    name: "MenuContainerBodyItems",
    components: {
        MenuContainerBodyElement
    },
    props: {
        /** Appendix set on the id to make it unique. Needed, as the menu can be rendered multiple times. */
        idAppendix: {
            type: String,
            required: true
        },
        /** Path to find the MenuContainerBodyElement inside the store structure. */
        path: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        ...mapGetters("Menu", ["section"])
    },
    methods: {
        /**
         * Returns the properties from the state, if available.
         * Otherwise the item (properties from config.json) is returned.
         * @param {Object} item The menu item.
         * @returns {Object} The properties from state or config.json.
         */
        chooseProperties (item) {
            let properties = item;

            if (Object.hasOwn(item, "type")) {
                const stateProperties = this.$store.state.Modules[upperFirst(item.type)];

                if (typeof stateProperties === "object") {
                    properties = stateProperties;
                }
            }

            return properties;
        }
    }
};
</script>

<template>
    <ul
        :id="'mp-menu-body-items-' + idAppendix"
        class="nav flex-column"
    >
        <li
            v-for="(item, key) in section(path)"
            :key="key"
        >
            <MenuContainerBodyElement
                :id="'mp-menu-body-items-element-' + key + '-' + idAppendix"
                v-bind="item"
                :path="[...path, key]"
            />
        </li>
    </ul>
</template>

<style lang="scss" scoped>
@import "~variables";
</style>
