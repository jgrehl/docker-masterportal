<script>
export default {
    name: "InputText",
    props: {
        id: {
            type: String,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        placeholder: {
            type: String,
            required: true
        },
        value: {
            type: String,
            default: null,
            required: false
        },
        type: {
            type: String,
            default: null,
            required: false
        },
        input: {
            type: Function,
            default: null,
            required: false
        },
        readonly: {
            type: Boolean,
            default: false,
            required: false
        },
        classObj: {
            type: Object,
            default: null,
            required: false
        }
    }
};
</script>

<template>
    <div class="form-floating mb-3">
        <input
            :id="id"
            :type="type"
            class="form-control"
            :class="classObj"
            :placeholder="placeholder"
            :value="value"
            :readonly="readonly"
            @input="event => input(event.target.value)"
        >
        <label :for="id">{{ $t(label) }}</label>
        <slot />
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

.form-control:focus ~ label {
    color: $secondary;
}
</style>
