<script>
import {mapMutations} from "vuex";

export default {
    name: "MenuItem",
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
    <button
        @click="addNavigationEntry(path)"
        @keypress="addNavigationEntry(path)"
    >
        <i
            v-if="showIcon"
            :class="icon"
        />
        {{ $t(title) }}
    </button>
    <!-- TODO(roehlipa): Properly add description -->
</template>

<style scoped>

</style>
