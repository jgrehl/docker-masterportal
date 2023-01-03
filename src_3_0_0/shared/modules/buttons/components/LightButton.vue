<script>
export default {
    name: "LightButton",
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
        iconEnd: {
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
        class="btn btn-light btn-description d-flex align-items-center row py-3"
        type="button"
        :aria-label="text"
        :class="customclass"
        @click="interaction"
        @keydown.enter="interaction"
    >
        <i
            v-if="icon !== null"
            :class="icon"
            role="img"
            class="col"
        />
        <span class="col-10 lh-1 btn-texts row">
            <span class="btn-title">
                {{ $t(text) }}
            </span>
            <span class="btn-description text-wrap col-12 pt-2">
                {{ $t(description) }}
            </span>
        </span>
        <i
            v-if="iconEnd !== null"
            :class="iconEnd"
            class="align-self-end flex-direction"
            role="img"
        />
    </button>
    <button
        v-else
        class="btn btn-light d-flex align-items-center"
        type="button"
        :class="customclass"
        @click="interaction"
        @keydown.enter="interaction"
    >
        <i
            v-if="icon !== null"
            :class="icon"
            role="img"
        />
        <span class="btn-title">
            {{ $t(text) }}
        </span>
        <i
            v-if="iconEnd !== null"
            :class="iconEnd"
            class="ms-auto"
            role="img"
        />
    </button>
</template>

<style lang="scss" scoped>
@import "~variables";

.btn {
    display: flex;
    justify-content: center;
    white-space: nowrap;
    min-height: 2.5rem;
    padding-right: 1rem;
    padding-left: 1rem;
    max-width: 100%;

    i {
        padding-right: .5rem;
    }
    i:last-child {
        padding-left: .5rem;
        padding-right: 0;
    }
    .btn-texts {
        text-align: left;
        .btn-description {
            font-size: $font-size-sm;
        }
    }
    .btn-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
.btn-description {
    border-radius: 25px;
}
</style>
