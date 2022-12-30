<script>
import {mapMutations} from "vuex";

export default {
    name: "MenuContainerHeader",
    props: {
        /** Defines in which menu the component is being rendered */
        side: {
            type: String,
            default: "mainMenu",
            validator: value => value === "mainMenu" || value === "secondaryMenu"
        }
    },
    methods: {
        ...mapMutations("Menu", ["toggleMenu"])
    }
};
</script>

<template>
    <div
        :id="'mp-header-' + side"
        class="mp-menu-header"
    >
        <button
            :id="'mp-menu-header-close-button-' + side"
            type="button"
            class="btn-close p-2 mp-menu-header-close-button"
            :aria-label="$t('common:menu.ariaLabelClose')"
            @click="toggleMenu(side)"
        />
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
.mp-menu-header{
    display: flex;
}
.mp-menu-header-close-button {
    display: block;
    position: absolute;
    right: 10px;
    top: 10px;
}


@include media-breakpoint-up(sm) {
    .mp-menu-header-close-button {
        display: none;
    }
}

</style>
