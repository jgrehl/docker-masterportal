<script>
import {mapGetters, mapMutations} from "vuex";

export default {
    name: "MenuToggleButton",
    props: {
        side: {
            type: String,
            default: "mainMenu",
            validator: value => value === "mainMenu" || value === "secondaryMenu"
        }
    },
    computed: {
        ...mapGetters("Menu", ["mainToggleButtonIcon", "secondaryToggleButtonIcon"]),
        /**
         * @returns {string} iconClass to be used depending on the side this button is used for.
         */
        iconClass () {
            return this.side === "mainMenu" ? this.mainToggleButtonIcon : this.secondaryToggleButtonIcon;
        }
    },
    methods: {
        ...mapMutations("Menu", ["toggleMenu"])
    }
};
</script>

<template>
    <button
        :id="side + '-toggle-button'"
        class="btn btn-primary bootstrap-icon menu-toggle-button"
        type="button"
        :aria-label="$t('common:menu.ariaLabelOpen')"
        @click="toggleMenu(side)"
    >
        <i :class="iconClass" />
    </button>
</template>

<style lang="scss" scoped>
@import "~variables";

.menu-toggle-button {
    position: absolute;
    top: 15px;
    left: 15px;
    font-size: calc(#{$icon_length} - 0.35 * #{$icon_length});
    height: $icon_length;
    width: $icon_length;
    z-index: 1;

    i {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        line-height: 0;
    }
}
#secondaryMenu-toggle-button {
    right: 15px;
    left: auto;
}
</style>
