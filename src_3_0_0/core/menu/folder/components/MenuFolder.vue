<script>
import MenuItems from "../../MenuItems.vue";

export default {
    name: "MenuFolder",
    components: {
        MenuItems
    },
    props: {
        /** title of the folder */
        title: {
            type: String,
            required: true
        },
        /** icon of the folder */
        icon: {
            type: String,
            default: ""
        },
        /** path of the actual element */
        path: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            isActive: false
        };
    }
};
</script>

<template>
    <div>
        <h4>{{ $t(title) }}</h4>
        <MenuItems
            :path="[...path, 'children']"
        />
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
</style>
