<script>
import MenuItems from "./MenuItems.vue";

export default {
    name: "MenuSection",
    components: {MenuItems},
    props: {
        side: {
            type: String,
            required: true,
            validator: value => value === "mainMenu" || value === "secondaryMenu"
        },
        sectionIndex: {
            type: Number,
            required: true
        },
        additionalPath: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        path () {
            return [this.side, "sections", this.sectionIndex, ...this.additionalPath];
        }
    }
};
</script>

<template>
    <div>
        <MenuItems
            :path="path"
        />
    </div>
</template>

<style scoped>

</style>
