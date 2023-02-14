<script>
import {mapGetters} from "vuex";
import MenuContainerBodyRootItemElement from "./MenuContainerBodyRootItemElement.vue";
import upperFirst from "../../../shared/js/utils/upperFirst";

export default {
    name: "MenuContainerBodyRootItems",
    components: {
        MenuContainerBodyRootItemElement
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
        },
        side: {
            type: String,
            default: "mainMenu",
            validator: value => value === "mainMenu" || value === "secondaryMenu"
        }
    },
    computed: {
        ...mapGetters("Menu", ["customMenuElementIcon", "section"])
    },
    created () {
        this.prepareItemProps();
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

            if ("type" in item) {
                const stateProperties = this.$store.state.Modules[upperFirst(item.type)];

                if (item.type === "customMenuElement" && !Object.prototype.hasOwnProperty.call(properties, "icon")) {
                    properties.icon = this.customMenuElementIcon;
                }
                if (typeof stateProperties === "object") {
                    properties = stateProperties;
                }
            }
            return properties;
        },

        prepareItemProps () {
            this.itemProps = [];
            const items = this.section(this.path);

            if (items) {
                if (Array.isArray(items)) {
                    this.section(this.path).forEach(item => {
                        const props = this.chooseProperties(item);

                        if (props) {
                            this.itemProps.push(props);
                        }
                    });
                }
                else {
                    items.elements.forEach(element => {
                        const props = this.chooseProperties(element);

                        if (props) {
                            this.itemProps.push(props);
                        }
                    });
                }
            }
        }
    }
};
</script>

<template>
    <ul
        :id="'mp-menu-body-items-' + idAppendix"
        class="nav flex-column ms-2"
    >
        <li
            v-for="(props, key) in itemProps"
            :key="key"
        >
            <MenuContainerBodyRootItemElement
                :id="'mp-menu-body-items-element-' + key + '-' + idAppendix"
                :properties="props"
                :name="props.name"
                :icon="props.icon"
                :description="props.description"
                :show-description="props.showDescription"
                :path="[...path, key]"
            />
        </li>
    </ul>
</template>

<style lang="scss" scoped>
@import "~variables";
</style>
