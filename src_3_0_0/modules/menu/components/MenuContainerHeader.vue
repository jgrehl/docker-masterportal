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
    </div>
</template>

<style scoped>
.menu-header-close-button {
    position: absolute;
    right: 10px;
}

</style>
