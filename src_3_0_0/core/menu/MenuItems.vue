<script>
import {mapGetters} from "vuex";
import MenuItem from "./MenuItem.vue";

export default {
    name: "MenuItems",
    components: {MenuItem},
    props: {
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
    <ul class="nav flex-column">
        <li
            v-for="(item, key) in section(path)"
            :key="key"
        >
            <MenuItem
                v-bind="item"
                :path="[...path, key]"
            />
        </li>
    </ul>
</template>

<style lang="scss" scoped>
@import "~variables";
</style>
