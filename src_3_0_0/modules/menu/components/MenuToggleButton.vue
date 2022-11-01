<script>
import {mapGetters} from "vuex";

export default {
    name: "MenuToggleButton",
    props: {
        side: {
            type: String,
            default: "main",
            validator: value => value === "main" || value === "secondary"
        }
    },
    computed: {
        ...mapGetters("Menu", ["mainToggleButtonIcon", "secondaryToggleButtonIcon"]),
        /**
         * @returns {string} iconClass to be used depending on the side this button is used for.
         */
        iconClass () {
            return this.side === "main" ? this.mainToggleButtonIcon : this.secondaryToggleButtonIcon;
        }
    }
};
</script>

<template>
    <!--
        TODO(roehlipa): Toggle buttons currently don't work when a menu is initially opened -> gotta close the menu first
            Should be fixed when using own css rules and functionality
    -->
    <button
        :id="side + '-menu-toggle-button'"
        class="btn btn-primary bootstrap-icon menu-toggle-button"
        type="button"
        data-bs-toggle="offcanvas"
        :data-bs-target="`#menu-offcanvas-${side}Menu`"
        :aria-label="$t('common:menu.ariaLabelOpen')"
    >
        <i :class="iconClass" />
    </button>
</template>

<style lang="scss" scoped>
@import "~variables";

.menu-toggle-button {
    // TODO(roehlipa): Use same styling as ControlIcons?
    position: absolute;
    top: 15px;
    left: 15px;
    font-size: calc(#{$icon_length} - 0.35 * #{$icon_length});
    height: $icon_length;
    width: $icon_length;

    i {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        line-height: 0;
    }
}
#secondary-menu-toggle-button {
    right: 15px;
    left: auto;
}
</style>
