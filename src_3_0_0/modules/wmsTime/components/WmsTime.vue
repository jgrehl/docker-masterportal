<script>
import {mapActions, mapGetters} from "vuex";
import LayerSwiper from "./LayerSwiper.vue";
import TimeSlider from "./TimeSlider.vue";

export default {
    name: "WmsTime",
    components: {
        LayerSwiper,
        TimeSlider
    },
    data: () => ({activeLayers: []}),
    computed: {
        ...mapGetters("Modules/WmsTime", ["currentTimeSliderObject", "layerAppendix", "layerSwiper", "minWidth", "timeSlider", "visibility"])
    },
    watch: {
        currentTimeSliderObject () {
            if (this.currentTimeSliderObject.layerId) {
                this.activeLayers.push(this.currentTimeSliderObject.layerId);
            }
        }
    },
    created () {
        window.addEventListener("resize", this.windowWidthChanged);
    },
    beforeUnmount () {
        window.removeEventListener("resize", this.windowWidthChanged);
    },
    methods: {
        ...mapActions("Modules/WmsTime", ["windowWidthChanged"])
    }
};
</script>

<template>
    <div
        id="wmsTime"
    >
        <TimeSlider
            v-if="timeSlider.active"
            :class="{'moveLeft': layerSwiper.active && minWidth}"
            :layer-id="activeLayers[0]"
        />
        <TimeSlider
            v-if="timeSlider.active && layerSwiper.active && minWidth"
            :class="{'moveRight': layerSwiper.active}"
            :layer-id="activeLayers[1]"
        />
        <LayerSwiper v-if="layerSwiper.active && minWidth" />
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";

    @mixin transform($value) {
        transform: translateX($value);
        transition: ease transform 250ms;
    }
    .timeSlider-wrapper {
        @include transform(-50%);
    }
    .moveLeft {
        @include transform(-110%);
    }
    .moveRight {
        @include transform(10%);
    }

    @include media-breakpoint-up(lg) {
        .moveLeft {
            @include transform(-150%);
        }
        .moveRight {
            @include transform(50%);
        }
    }
</style>
