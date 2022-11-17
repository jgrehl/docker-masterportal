<script>
export default {
    name: "SimpleButton",
    props: {
        text: {
            type: String,
            required: true
        },
        interaction: {
            type: Function,
            required: true
        },
        icon: {
            type: String,
            default: null,
            required: false
        },
        customclass: {
            type: String,
            default: null,
            required: false
        }
    }
};
</script>

<template>
    <button
        class="btn btn-primary"
        :class="customclass"
        type="button"
        @click="interaction"
    >
        <i
            v-if="icon !== null"
            :class="icon"
            role="img"
        />
        {{ $t(text) }}
    </button>
</template>

<style lang="scss" scoped>
@import "~variables";
@import "~mixins";

.btn {
    display: flex;
    justify-content: center;
    white-space: nowrap;
    i {
        margin-right: 0.5rem;
    }
    &:focus, &:active, &:hover {
        /* TODO(roehlipa): Adjust colors */
        color: $primary;
        background-color: $white;
        border-color: $primary;
    }
}
</style>
