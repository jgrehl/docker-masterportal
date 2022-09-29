<script>

export default {
    name: "MenuFolder",
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
    }
};
</script>

<template>
    <div>
        <p>{{ title }}</p>
        <div>
            Hi, ich bin Aktiv!
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
</style>
