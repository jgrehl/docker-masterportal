<script>
import {mapGetters} from "vuex";
import LayerTreeNode from "./LayerTreeNode.vue";

/**
 * Module to display the layers in menu.
 */
export default {
    name: "LayerTree",
    components: {
        LayerTreeNode
    },
    computed: {
        ...mapGetters(["layerConfig"])
    }
};
</script>

<template lang="html">
    <div
        id="layer-tree"
        class="layer-tree me-3"
    >
        <div
            v-for="(layerConfigKey, i) in Object.keys(layerConfig)"
            :key="i"
        >
            <div
                v-for="(subKey, ii) in Object.keys(layerConfig[layerConfigKey])"
                :key="ii"
            >
                <div
                    v-for="(conf, iii) in layerConfig[layerConfigKey][subKey]"
                    :key="iii"
                >
                    <LayerTreeNode
                        :conf="conf"
                    />
                </div>
            </div>
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
