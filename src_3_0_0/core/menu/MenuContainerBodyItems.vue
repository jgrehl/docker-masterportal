<script>
import {mapGetters} from "vuex";
import MenuContainerBodyElement from "./MenuContainerBodyElement.vue";

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
    }
};
</script>

<template>
    <ul
        :id="'menu-offcanvas-body-items-' + idAppendix"
        class="nav flex-column"
    >
        <li
            v-for="(item, key) in section(path)"
            :key="key"
        >
            <MenuContainerBodyElement
                :id="'menu-offcanvas-body-items-element-' + key + '-' + idAppendix"
                v-bind="item"
                :path="[...path, key]"
            />
        </li>
    </ul>
</template>

<style lang="scss" scoped>
@import "~variables";
</style>
