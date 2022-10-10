<script>

import {mapMutations} from "vuex";
import MenuItems from "../../menuItems/components/MenuItems.vue";

export default {
    name: "MenuFolder",
    components: {
        MenuItems
    },
    props: {
        /** name of the folder */
        name: {
            type: String,
            required: true
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
        <h4>{{ name }}</h4>
        <MenuItems :items="children" />
        <div>
            {{ name }} in da house!
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
</style>
