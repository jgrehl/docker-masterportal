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
        :class="[
            'toggle-button-' + side,
            {'expanded': mainMenuExpanded && side === 'mainMenu' || secondaryMenuExpanded && side === 'secondaryMenu'}
        ]
        "
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
    flex-grow: 0;
    flex-shrink: 0;

    i {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        line-height: 0;
    }
}

.expanded {
    border-width: 1px;
    border-color: $light-grey;
    z-index: 5;
}
.toggle-button-mainMenu {
    left: 0px;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    &.expanded {
        left: -13px;
        border-radius: 50%;
    }
}


.toggle-button-secondaryMenu {
    right: 0px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    &.expanded {
        right: -13px;
        border-radius: 50%;
    }
}

@media (max-width: 768px) {
    .menu-toggle-button {
        border-radius: 20px;
        right: 20px;
        position: fixed;
        font-size: $icon_length;
        height: calc(#{$icon_length} * 1.75);
        width: calc(#{$icon_length} * 1.75);
        border-radius: 50%;
    }
    .toggle-button-mainMenu {
        top:60%;
        left: auto;
    }

    .toggle-button-secondaryMenu {
        top:calc(60% + #{$icon_length} * 1.75 + 10px);
    }

    .expanded {
        display: none;
    }

}
</style>
