<script>
export default {
    name: "FlatButton",
    props: {
        text: {
            type: String,
            required: true
        },
        interaction: {
            type: Function,
            required: false,
            default: () => {
                return true;
            }
        },
        icon: {
            type: String,
            default: null,
            required: false
        }
    }
};
</script>

<template>
    <button
        class="btn btn-secondary d-flex align-items-center mb-3"
        type="button"
        :aria-label="text"
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
    min-height: 2.5rem;
    max-width: fit-content;
    padding-right: 1.5rem;
    padding-left: 1rem;

    i {
        font-size: 1.125rem;
        padding-right: .5rem;
    }
    .btn-texts {
        text-align: left;
    }
}
</style>
