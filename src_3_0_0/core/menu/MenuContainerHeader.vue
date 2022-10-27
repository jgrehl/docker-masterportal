<script>
import {mapGetters} from "vuex";
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
         * Removes the class "show", which is used when displaying a menu, from the menu this
         * component is rendered in.
         * @returns {void}
         */
        removeShowClass () {
            document.getElementById(`menu-offcanvas-${this.side}`)?.classList.remove("show");
        }
    }
};
</script>

<template>
    <div
        :id="'menu-offcanvas-header-' + side"
        class="offcanvas-header"
    >
        <MenuContainerHeaderTitle
            v-if="titleBySide(side)"
            v-bind="titleBySide(side)"
        />
        <button
            :id="'menu-offcanvas-header-close-button-' + side"
            type="button"
            class="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            :aria-label="$t('common:menu.ariaLabelClose')"
            @click="removeShowClass"
        />
    </div>
</template>

<style scoped>

</style>
