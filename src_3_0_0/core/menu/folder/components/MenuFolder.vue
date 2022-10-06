<script>

import {mapMutations} from "vuex";
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
        /** child elements within the folder */
        children: {
            type: Array,
            default: () => []
        }
    },
    data () {
        return {
            isActive: false
        };
    },
    computed: {
    },
    methods: {
        ...mapMutations("MenuNavigation", {addNavigationEntry: "addEntry"})
    }
};
</script>

<template>
    <div>
        <h4>{{ title }}</h4>
        <MenuItems :items="children" />
        <div>
            {{ title }} in da house!
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
</style>
