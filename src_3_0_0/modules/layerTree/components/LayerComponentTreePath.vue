<script>

/**
 * Layer Component Sub Menu to show the folder path.
 * @module modules/layerTree/components/LayerComponentTreePath
 * @vue-prop {String} path - The path of the current layer configuration.
 * @vue-prop {String} confId - The id of the current layer configuration.
 */
export default {
    name: "LayerComponentTreePath",
    props: {
        /** path of the current layer configuration */
        path: {
            type: String,
            required: true
        },
        /** id of the current layer configuration */
        confId: {
            type: String,
            required: true
        }
    }
};
</script>

<template lang="html">
    <div
        :id="'layer-component-tree-path-' + confId.split('.').join('_')"
        class="d-flex flex-column layer-component-sub-menu ms-2 mt-2"
    >
        <span
            class="path"
        >
            {{ path }}
        </span>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";

    .path{
        font-size: $font-size-sm;
        color: $dark_grey;
        width: 100%;
        text-align: start;
    }
</style>
