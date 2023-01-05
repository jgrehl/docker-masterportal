<script>
import {mapGetters, mapMutations, mapActions} from "vuex";
import LayerSliderHandle from "./LayerSliderHandle.vue";
import LayerSliderPlayer from "./LayerSliderPlayer.vue";

export default {
    name: "LayerSlider",
    components: {
        LayerSliderHandle,
        LayerSliderPlayer
    },
    computed: {
        ...mapGetters("Modules/LayerSlider", [
            "active",
            "layerIds",
            "sliderType",
            "title"
        ])
    },
    watch: {
        active (isActive) {
            if (!isActive) {
                this.setWindowsInterval(null);
                this.resetActiveLayer();
            }
        }
    },
    mounted () {
        this.checkIfAllLayersAvailable(this.layerIds);
        this.addIndexToLayerIds(this.layerIds);
    },
    methods: {
        ...mapMutations("Modules/LayerSlider", [
            "resetActiveLayer",
            "setWindowsInterval"
        ]),
        ...mapActions("Modules/LayerSlider", [
            "addIndexToLayerIds",
            "checkIfAllLayersAvailable"
        ])
    }
};
</script>

<template lang="html">
    <div
        v-if="active"
        id="tool-layer-slider"
    >
        <h5>
            {{ $t(title) }}
        </h5>
        <LayerSliderPlayer
            v-if="sliderType === 'player'"
        />
        <LayerSliderHandle
            v-else-if="sliderType === 'handle'"
        />
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";

    #tool-layer-slider {
        @include media-breakpoint-up(sm) {
            min-width: 350px;
        }
    }

</style>
