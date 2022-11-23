<script>
import {mapGetters} from "vuex";
import Layer from "./LayerComponent.vue";

/**
 * Module to display the layers in menu.
 */
export default {
    name: "LayerTree",
    components: {
        Layer
    },
    computed: {
        ...mapGetters(["inTreeVisibleLayerConfigsByMode"]),
        ...mapGetters("Maps", ["mode"])
    }
};
</script>

<template lang="html">
    <div
        id="layer-tree"
        class="layer-tree me-3"
    >
        <div
            v-for="(layerConf) in inTreeVisibleLayerConfigsByMode(mode)"
            :key="layerConf.id"
        >
            <Layer
                :layer-conf="layerConf"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";
    .layer-tree{
        padding: $padding;
        font-size: $font-size-base;
        overflow-y: auto;
        max-height: 500px;
    }

</style>
