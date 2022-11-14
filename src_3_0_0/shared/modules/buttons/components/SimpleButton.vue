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
        },
        description: {
            type: String,
            default: null,
            required: false
        }
    }
};
</script>

<template>
    <button
        v-if="description"
        class="btn btn-secondary btn-description d-flex align-items-center row py-3"
        type="button"
        :class="customclass"
        @click="interaction"
    >
        <i
            v-if="icon !== null"
            :class="icon"
            role="img"
            class="col"
        />
        <span class="col-10 lh-1 btn-texts row">
            <span>
                {{ $t(text) }}
            </span>
            <span class="btn-description text-wrap col-12 pt-2">
                {{ $t(description) }}
            </span>
        </span>
    </button>
    <button
        v-else
        class="btn btn-secondary d-flex align-items-center"
        type="button"
        :class="customclass"
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
    padding-right: 1.5rem;

    i {
        font-size: 1.125rem;
        padding-left: 1rem;
        padding-right: .5rem;
    }
    .btn-texts {
        text-align: left;
        .btn-description {
            font-size: $font-size-sm;
        }
    }
}
.btn-description {
    border-radius: 25px;
}
</style>
