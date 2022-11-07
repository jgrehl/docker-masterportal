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
        ...mapGetters("Menu", ["mainMenuExpanded", "secondaryMenuExpanded", "mainToggleButtonIcon", "secondaryToggleButtonIcon"]),
        /**
         * @returns {string} iconClass to be used depending on the side this button is used for.
         */
        iconClass () {
            let icon;

            if (this.side === "mainMenu") {
                icon = this.mainMenuExpanded ? "bi-chevron-left" : this.mainToggleButtonIcon;
            }
            else {
                icon = this.secondaryMenuExpanded ? "bi-chevron-right" : this.secondaryToggleButtonIcon;
            }

            return icon;
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
        :class="{
            'menu-toggle-button-main': side === 'mainMenu',
            'menu-toggle-button-secondary': side === 'secondaryMenu'
        }"
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
    top: 15px;
    font-size: calc(#{$icon_length} - 0.35 * #{$icon_length});
    height: $icon_length;
    width: $icon_length;
    z-index: 1;
    position: relative;

    i {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        line-height: 0;
    }
}
.menu-toggle-button-main {
    left: 0px;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
}


.menu-toggle-button-secondary {
    right: 0px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
}
</style>
