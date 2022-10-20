<script>
import {mapGetters} from "vuex";
import MenuContainerBodyElement from "./MenuContainerBodyElement.vue";

export default {
    name: "MenuContainerBodyItems",
    components: {
        MenuContainerBodyElement
    },
    props: {
        idAppendix: {
            type: String,
            required: true
        },
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
