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
        <MenuContainer v-if="mainMenu" />
        <MenuContainer
            v-if="secondaryMenu"
            side="secondary"
        />
    </div>
</template>

<style lang="scss" scoped>
</style>
