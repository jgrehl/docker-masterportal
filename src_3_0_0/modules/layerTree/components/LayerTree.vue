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
        ...mapGetters(["layerConfig"]),
        confs () {
            const configs = [];

            Object.keys(this.layerConfig).forEach(layerConfigKey => {
                Object.keys(this.layerConfig[layerConfigKey]).forEach(subKey => {
                    if (Array.isArray(this.layerConfig[layerConfigKey][subKey])) {
                        this.layerConfig[layerConfigKey][subKey].forEach(conf => {
                            configs.push(conf);
                        });
                    }
                });
            });
            return configs;
        }
    }
};
</script>

<template lang="html">
    <hr>
    <div
        id="layer-tree"
        class="layer-tree me-3"
    >
        <template
            v-for="(conf, index) in confs"
            :key="index"
        >
            <LayerTreeNode
                v-if="typeof conf !== 'string'"
                :id="conf.id"
                :conf="conf"
            />
        </template>
    </div>
    <hr>
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
