<script>

import {mapMutations} from "vuex";

export default {
    name: "MenuItems",
    props: {
        /** array of menu items to display */
        items: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        iconClass () {
            return this.iconName === "" || this.iconName.startsWith("bi-") ? this.iconName : `bi-${this.iconName}`;
        }
    },
    methods: {
        ...mapMutations("MenuNavigation", {addNavigationEntry: "addEntry"})
    }
};
</script>

<template>
    <div>
        <ul class="nav flex-column">
            <li
                v-for="item in items"
                :key="item.key"
                class="nav-item"
                @click="addNavigationEntry(item)"
                @keypress="addNavigationEntry(item)"
            >
                <a
                    class="nav-link"
                    href="#"
                >
                    <i
                        v-if="item.props.icon !== ''"
                        :class="item.props.icon"
                    />
                    {{ item.props.name }}
                </a>
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
