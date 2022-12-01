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
        model: {
            type: String,
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
            :placeholder="placeholder"
            :value="value"
            :v-model="model"
        >
        <label :for="id">{{ $t(label) }}</label>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

.form-control:focus ~ label {
    color: $secondary;
}
</style>
