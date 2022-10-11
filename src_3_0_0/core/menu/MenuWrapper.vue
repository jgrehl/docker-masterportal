<script>
import {mapGetters} from "vuex";
import MenuContainer from "./MenuContainer.vue";

export default {
    name: "MenuWrapper",
    components: {
        MenuContainer
    },
    computed: {
        ...mapGetters("Menu", ["mainMenu", "secondaryMenu"])
    }
};
</script>

<template>
    <div id="menu-offcanvas-wrapper">
        <MenuContainer
            v-if="mainMenu"
            :class="mainMenu.initiallyOpen ? 'show' : ''"
        />
        <MenuContainer
            v-if="secondaryMenu"
            side="secondary"
            :class="secondaryMenu.initiallyOpen ? 'show' : ''"
        />
    </div>
</template>

<style lang="scss" scoped>
</style>
