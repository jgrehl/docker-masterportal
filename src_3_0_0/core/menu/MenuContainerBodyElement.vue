<script>
import {mapActions} from "vuex";
import SimpleButton from "../../sharedComponents/SimpleButton.vue";

export default {
    name: "MenuContainerBodyElement",
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
        ...mapActions("Menu", ["clickedMenuElement"])
    }
};
</script>

<template>
    <SimpleButton
        :interaction="() => clickedMenuElement(path)"
        :text="title"
        :icon="showIcon ? icon : null"
    />
    <!-- TODO(roehlipa): Properly add description -->
    <!-- TODO(roehlipa): Buttons should look differently when mobile -->
</template>

<style scoped>

</style>
