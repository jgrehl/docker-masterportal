<script>
import {mapGetters, mapMutations} from "vuex";

export default {
    name: "MenuNavigation",
    computed: {
        ...mapGetters("MenuNavigation", ["previousEntry", "lastEntry", "objectFromPath"])
    },
    methods: {
        ...mapMutations("MenuNavigation", ["removeLastEntry"])
    }
};
</script>

<template>
    <div>
        <a
            v-if="lastEntry"
            href="#"
            @click="removeLastEntry"
            @keypress="removeLastEntry"
        >
            <h5>
                &#60; {{ !previousEntry ? $t('common:menu.name') : objectFromPath.title }}
            </h5>
        </a>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
</style>
