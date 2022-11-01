<script>
import MenuContainerBodyItems from "./MenuContainerBodyItems.vue";

export default {
    name: "MenuFolder",
    components: {
        MenuContainerBodyItems
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
        /** title of the folder */
        title: {
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
        <h4>{{ $t(title) }}</h4>
        <MenuContainerBodyItems
            :id-appendix="idAppendix"
            :path="[...path, 'children']"
        />
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
</style>
