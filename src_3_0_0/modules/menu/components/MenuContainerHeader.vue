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
        ...mapMutations("Menu", ["toggleMenu"])
    }
};
</script>

<template>
    <div
        :id="'mp-header-' + side"
        class="mp-menu-header"
    >
        <MenuContainerHeaderTitle
            v-if="titleBySide(side)"
            v-bind="titleBySide(side)"
        />

        <button
            :id="'mp-menu-header-close-button-' + side"
            type="button"
            class="btn-close mp-menu-header-close-button"
            :aria-label="$t('common:menu.ariaLabelClose')"
            @click="toggleMenu(side)"
        />
    </div>
</template>

<style scoped>
.mp-menu-header{
    display: flex;
    padding: 10px;
}
.mp-menu-header-close-button {
    display: none;
    position: absolute;
    right: 10px;
    top: 10px;
}

@media (max-width: 768px) {
    .mp-menu-header-close-button {
        display: block;
    }

}

</style>
