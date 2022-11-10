<script>
import {mapMutations} from "vuex";

/**
 *
 */
export default {
    name: "Layer",
    props: {
        layerConf: {
            type: Object,
            required: true
        }
    },
    methods: {
        ...mapMutations(["replaceByIdInLayerConfig"]),
        // Sven: selected <-> visibility, nicht alle Layer haben das Attribut selected (z.B. OAF)
        selectedChanged (value) {
            this.replaceByIdInLayerConfig(
                {
                    layerConfigs: [{
                        id: this.layerConf.id,
                        layer: {
                            id: this.layerConf.id,
                            selected: value,
                            visibility: value
                        }
                    }]
                }
            );
        }


    }
};
</script>

<template lang="html">
    <div
        id="layerConf.id"
        class="form-check"
    >
        <input
            v-model="layerConf.visibility"
            type="checkbox"
            class="form-check-input"
            @click="selectedChanged(!layerConf.visibility)"
        >
        <h5>{{ layerConf.name }}</h5>
    </div>
</template>

<style lang="scss" scoped>

</style>
