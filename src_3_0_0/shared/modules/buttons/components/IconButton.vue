<script>
export default {
    name: "IconButton",
    props: {
        interaction: {
            type: Function,
            required: false,
            default: () => {
                return true;
            }
        },
        aria: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            default: null,
            required: false
        },
        classArray: {
            type: Array,
            default: null,
            required: false
        }
    }
};
</script>

<template>
    <button
        tabindex="0"
        class="btn btn-primary d-flex align-items-center my-auto"
        type="button"
        :aria-label="aria"
        :class="classArray"
        @click="interaction"
        @keydown.enter="interaction"
    >
        <i
            :class="icon"
            role="img"
        />
    </button>
</template>

<style lang="scss" scoped>
@import "~variables";
@import "~mixins";

.btn {
    width: fit-content;
    border: solid $white 1px;
    border-radius: 50%;
    > i {
        font-size: 1.125rem;
    }
}
</style>
