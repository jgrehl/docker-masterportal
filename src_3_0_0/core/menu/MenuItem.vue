<script>
import {mapMutations} from "vuex";
import SimpleButton from "../../sharedComponents/SimpleButton.vue";

export default {
    name: "MenuItem",
    components: {SimpleButton},
    props: {
        description: {
            type: String,
            default: ""
        },
        title: {
            type: String,
            default: "",
            validator: value => value !== ""
        },
        icon: {
            type: String,
            default: "",
            validator: value => value.startsWith("bi-")
        },
        showDescription: {
            type: Boolean,
            default: false
        },
        path: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        showIcon () {
            return typeof this.icon === "string" && this.icon.length > 0;
        }
    },
    methods: {
        ...mapMutations("MenuNavigation", {addNavigationEntry: "addEntry"})
    }
};
</script>

<template>
    <SimpleButton
        :interaction="() => addNavigationEntry(path)"
        :text="title"
        :icon="showIcon ? icon : null"
    />
    <!-- TODO(roehlipa): Properly add description -->
</template>

<style scoped>

</style>
