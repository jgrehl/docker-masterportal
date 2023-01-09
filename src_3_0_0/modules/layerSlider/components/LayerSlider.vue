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
            "setSliderType",
            "setWindowsInterval"
        ]),
        ...mapActions("Modules/LayerSlider", [
            "addIndexToLayerIds",
            "checkIfAllLayersAvailable"
        ]),

        /**
         * Toogles the slider type.
         * @returns {void}
         */
        toggleSliderType () {
            if (this.sliderType === "player") {
                this.setSliderType("handle");
            }
            else if (this.sliderType === "handle") {
                this.setSliderType("player");
            }
        }
    }
};
</script>

<template lang="html">
    <div
        v-if="active"
        id="module-layer-slider"
    >
        <div class="d-flex flex-row justify-content-between form-switch ps-0">
            <label
                class="d-flex flex-column justify-content-center form-check-label"
                for="module-layer-slider-checkbox"
            >
                {{ $t(sliderType === "player" ? "common:modules.tools.layerSlider.changeSliderTypeToHandle" : "common:modules.tools.layerSlider.changeSliderTypeToPlayer") }}
            </label>
            <input
                id="module-layer-slider-checkbox"
                class="form-check-input"
                aria-checked="true"
                type="checkbox"
                role="switch"
                @change="toggleSliderType"
            >
        </div>
        <h5 class="my-4">
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

    #module-layer-slider {
        .form-check-input {
            max-width: 3.5rem;
            height: 2rem;
        }

        input {
            flex: 0 0 3.5rem;
            margin-inline-end: 1rem;
        }

        @include media-breakpoint-up(sm) {
            min-width: 350px;
        }
    }


</style>
