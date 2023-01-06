<script>
export default {
    name: "ShadowToolSliderInput",
    props: {
        label: {
            type: String,
            required: false,
            default: ""
        },
        valuelabel: {
            type: String,
            required: true
        },
        value: {
            type: Number,
            required: true
        },
        min: {
            type: Number,
            required: true
        },
        max: {
            type: Number,
            required: true
        },
        step: {
            type: Number,
            required: false,
            default: 1
        },
        unit: {
            type: String,
            required: false,
            default: ""
        },
        disabled: {
            type: Boolean,
            required: true
        }
    },
    emits: ["input"]
};
</script>

<template>
    <div
        class="d-flex flex-column mt-2 slider-input"
    >
        <label :for="'shadow-slider-input-' + label">
            <h6>{{ label }}</h6>
        </label>
        <div class="d-flex justify-content-end">
            <span>{{ valuelabel }}</span>
        </div>
        <input
            :id="'shadow-slider-input-' + label"
            :value="value"
            type="range"
            :min="min"
            :max="max"
            :step="step"
            :disabled="disabled"
            @input="$emit('input', Number($event.target.value))"
        >
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";

    .slider-input {
        accent-color: $secondary;
    }

    h6 {
        font-size: $font-size-base;
}
</style>
