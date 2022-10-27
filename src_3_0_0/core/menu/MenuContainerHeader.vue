<script>
import {mapGetters} from "vuex";
import MenuContainerHeaderTitle from "./MenuContainerHeaderTitle.vue";

export default {
    name: "MenuContainerHeader",
    components: {
        MenuContainerHeaderTitle
    },
    props: {
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
