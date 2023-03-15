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
        },
        spinnerTrigger: {
            type: Boolean,
            default: false,
            required: false
        }
    }
};
</script>

<template>
    <button
        class="flat-button btn btn-secondary d-flex align-items-center mb-3"
        type="button"
        :aria-label="text"
        @click="interaction"
        @keydown.enter="interaction"
    >
        <i
            v-if="icon !== null && !spinnerTrigger "
            :class="icon"
            role="img"
        />
        <div
            v-if="spinnerTrigger"
            class="spinner-border mb-1"
        />
        <span class="btn-texts">
            {{ $t(text) }}
        </span>
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
        white-space: normal;
    }
}
.spinner-border {
    border: 4px solid $dark_blue;
    border-radius: 50%;
    border-top: 4px solid $primary;
    width: 20px;
    height: 20px;
}
</style>
