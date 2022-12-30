<script>
import MenuContainerBodyRootItems from "./MenuContainerBodyRootItems.vue";

export default {
    name: "MenuFolder",
    components: {
        MenuContainerBodyRootItems
    },
    props: {
        /** Appendix set on the id to make it unique. Needed, as the menu can be rendered multiple times. */
        idAppendix: {
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
        },
        /** name of the folder */
        name: {
            type: String,
            required: true
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
        <h4>{{ $t(name) }}</h4>
        <MenuContainerBodyRootItems
            :id-appendix="idAppendix"
            :path="path"
        />
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
</style>
