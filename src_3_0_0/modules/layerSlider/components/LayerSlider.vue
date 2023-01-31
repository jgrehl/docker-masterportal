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
        id="module-layer-slider"
    >
        <h5 class="my-4">
            {{ $t(title) }}
        </h5>
        <ul
            id="layer-slider-tabs"
            class="nav nav-tabs nav-justified"
            role="tablist"
        >
            <li
                class="nav-item"
                role="presentation"
            >
                <button
                    id="handle-tab"
                    class="nav-link active"
                    data-bs-toggle="tab"
                    data-bs-target="#handle-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="handle-tab-pane"
                    aria-selected="true"
                >
                    {{ $t("modules.tools.layerSlider.sliderTypeHandle") }}
                </button>
            </li>
            <li
                class="nav-item"
                role="presentation"
            >
                <button
                    id="player-tab"
                    class="nav-link"
                    data-bs-toggle="tab"
                    data-bs-target="#player-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="player-tab-pane"
                    aria-selected="false"
                >
                    {{ $t("modules.tools.layerSlider.sliderTypePlayer") }}
                </button>
            </li>
        </ul>
        <div
            id="myTabContent"
            class="tab-content"
        >
            <div
                id="handle-tab-pane"
                class="tab-pane fade show active"
                role="tabpanel"
                aria-labelledby="handle-tab"
                tabindex="0"
            >
                <LayerSliderPlayer />
            </div>
            <div
                id="player-tab-pane"
                class="tab-pane fade"
                role="tabpanel"
                aria-labelledby="player-tab"
                tabindex="0"
            >
                <LayerSliderHandle />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";

    #module-layer-slider {
        .form-check-input {
            width: 2.5rem;
            height: 1.5rem;
        }
    }
    .nav-tabs {
        border: none;
        .nav-link.active {
            border-top: none;
            border-left: none;
            border-right: none;
            border-bottom: 3px solid $dark_blue;
            font-family: $font_family_accent;
        }
        .nav-link {
            color: $black;
            border: none;
        }
        .nav-link:hover {
            border-radius: 0;
            background-color: $light_blue;
        }
    }


</style>
