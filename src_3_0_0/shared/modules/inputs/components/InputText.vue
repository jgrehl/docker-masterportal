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
        type: {
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
        >
        <label :for="id">{{ $t(label) }}</label>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

</style>
