<script>

import {mapGetters} from "vuex";
import MenuItem from "../../MenuItem.vue";

export default {
    name: "MenuItems",
    components: {MenuItem},
    props: {
        // @Todo: check if items can be gotten via path
        /** array of menu items to display */
        items: {
            type: Array,
            default: () => []
        },
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
                v-for="(item, key) in items || section(path)"
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
@import "~/css/mixins.scss";
.tabable {
    text-decoration: none;
    cursor: pointer;
    &:hover {
        @include primary_action_hover;
    }
    &:focus {
        @include primary_action_focus;
    }
}
</style>
