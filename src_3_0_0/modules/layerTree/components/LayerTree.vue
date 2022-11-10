<script>
import {mapGetters} from "vuex";
import Layer from "./Layer.vue";

/**
 * Module to switch the scale of the map. Listens to changes of the map's scale and sets the scale to this value.
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
