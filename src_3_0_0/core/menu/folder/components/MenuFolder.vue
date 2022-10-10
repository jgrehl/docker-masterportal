<script>
import MenuItems from "../../menuItems/components/MenuItems.vue";

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
        // @Todo: check if children can be gotten via path
        /** child elements within the folder */
        children: {
            type: Array,
            default: () => []
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
        <h4>{{ title }}</h4>
        <MenuItems
            :items="children"
            :path="[...path, 'children']"
        />
        <div>
            {{ title }} in da house!
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
</style>
