<script>
import {mapGetters, mapMutations} from "vuex";
import MenuContainerHeaderTitle from "./MenuContainerHeaderTitle.vue";

export default {
    name: "MenuContainerHeader",
    components: {
        MenuContainerHeaderTitle
    },
    props: {
        /** Defines in which menu the component is being rendered */
        side: {
            type: String,
            default: "mainMenu",
            validator: value => value === "mainMenu" || value === "secondaryMenu"
        }
    },
    computed: {
        ...mapGetters("Menu", ["titleBySide"])
    },
    methods: {

        /**
         * Toggles Menu
         * @returns {void}
         */
        ...mapMutations("Menu", ["toggleMenu"])
    }
};
</script>

<template>
    <div
        :id="'menu-header-' + side"
        class="menu-header"
    >
        <MenuContainerHeaderTitle
            v-if="titleBySide(side)"
            v-bind="titleBySide(side)"
        />
        <button
            :id="'menu-header-close-button-' + side"
            type="button"
            class="btn-close text-reset menu-header-close-button"
            :aria-label="$t('common:menu.ariaLabelClose')"
            @click="toggleMenu(side)"
        />
    </div>
</template>

<style scoped>
.menu-header-close-button {
    position: absolute;
    right: 10px;
}

</style>
