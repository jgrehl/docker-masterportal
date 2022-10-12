<script>
import {mapGetters} from "vuex";
import MenuItem from "./MenuItem.vue";

export default {
    name: "MenuItems",
    components: {MenuItem},
    props: {
        /** array of menu items to display */
        path: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        ...mapGetters("Menu", ["section"]),
        iconClass () {
            return this.iconName === "" || this.iconName.startsWith("bi-") ? this.iconName : `bi-${this.iconName}`;
        }
    }
};
</script>

<template>
    <div>
        <ul class="nav flex-column">
            <li
                v-for="(item, key) in section(path)"
                :key="key"
                class="nav-item"
            >
                <MenuItem
                    v-bind="item"
                    :path="[...path, key]"
                />
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
</style>
