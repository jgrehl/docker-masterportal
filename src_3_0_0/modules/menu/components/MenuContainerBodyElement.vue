<script>
import {mapActions} from "vuex";
import SimpleButton from "../../../shared/components/SimpleButton.vue";

export default {
    name: "MenuContainerBodyElement",
    components: {SimpleButton},
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
        /**
         * @returns {boolean} Depending on whether the icon is given it is decided whether on is shown.
         */
        showIcon () {
            return typeof this.icon === "string" && this.icon.length > 0;
        }
    },
    methods: {
        ...mapActions("Menu", ["clickedMenuElement"])
    }
};
</script>

<template>
    <SimpleButton
        :interaction="() => clickedMenuElement(path)"
        :text="name"
        :icon="showIcon ? icon : null"
    />
    <!-- TODO(roehlipa): Properly add description -->
    <!-- TODO(roehlipa): Buttons should look differently when mobile -->
</template>

<style scoped>

</style>
