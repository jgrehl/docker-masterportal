<script>
import LayerTreeNode from "./LayerTreeNode.vue";

/**
 * Module to display the layers in menu.
 */
export default {
    name: "LayerTree",
    components: {
        LayerTreeNode
    }
};
</script>

<template lang="html">
    <hr>
    <div
        id="layer-tree"
        class="layer-tree"
    >
        <LayerTreeNode />
    </div>
    <hr>
</template>

<style lang="scss" scoped>
@import "~variables";
    .layer-tree{
        padding-left: $padding;
        font-size: $font-size-base;
        overflow-y: auto;
        max-height: 350px;
    }

    @include media-breakpoint-up(sm)  {
        .layer-tree{
            max-width: 400px;
        }
    }
</style>
