<script>

export default {
    name: "MenuNavigation",
    data () {
        return {
            entries: []
        };
    },
    computed: {
    },
    mounted () {
    },
    methods: {
        addEntry (componenentKey) {
            console.log(componenentKey)
            this.entries.push(componenentKey);
        }
    }
};
</script>

<template>
    <div>
        <p v-if="entries">
            Nav: {{ entries[entries.length - 1] }}
        </p>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
</style>
