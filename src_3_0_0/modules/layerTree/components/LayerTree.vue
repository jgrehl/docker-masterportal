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
        ...mapGetters(["layerConfigsByMode"]),
        ...mapGetters("Maps", ["mode"])
    }
};
</script>

<template lang="html">
    <div
        id="layer-tree"
    >
        <div
            v-for="(layerConf) in layerConfigsByMode(mode)"
            :key="layerConf.id"
        >
            <Layer
                :layer-conf="layerConf"
            />
        </div>
    </div>
</template>
