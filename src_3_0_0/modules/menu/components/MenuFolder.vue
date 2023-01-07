<script>
import {mapGetters} from "vuex";
import MenuContainerBodyRootItems from "./MenuContainerBodyRootItems.vue";

export default {
    name: "MenuFolder",
    components: {
        MenuContainerBodyRootItems
    },
    props: {
        /** Defines in which menu the component is being rendered */
        side: {
            type: String,
            default: "mainMenu",
            validator: value => value === "mainMenu" || value === "secondaryMenu"
        }
    },
    data () {
        return {
            isActive: false
        };
    },
    computed: {
        ...mapGetters("Menu", ["currentFolderName", "currentFolderPath"]),

        currentPath () {
            return this.currentFolderPath(this.side);
        }
    }
};
</script>

<template>
    <div>
        <!-- <MenuContainerBodyRootItems
            :id-appendix="idAppendix"
            :path="path"
        /> -->
        {{ currentFolderName(side) }}
        <MenuContainerBodyRootItems
            :key="currentFolderName(side)"
            :id-appendix="side"
            :path="currentPath"
        />
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
</style>
