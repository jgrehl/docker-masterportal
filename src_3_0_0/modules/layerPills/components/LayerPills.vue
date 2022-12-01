<script>
import {mapGetters, mapMutations} from "vuex";
import layerFactory from "../../../core/layers/js/layerFactory";
import {Tooltip} from "bootstrap";

export default {
    name: "LayerPills",
    computed: {
        ...mapGetters(["isMobile", "visibleSubjectDataLayerConfigs", "portalConfig"]),
        ...mapGetters("LayerPills", ["visibleSubjectDataLayers", "startIndex", "endIndex", "layerPillsAmount", "leftScrollDisabled", "rightScrollDisabled"]),
        ...mapGetters("Maps", ["mode"])
    },
    watch: {
        visibleSubjectDataLayerConfigs (value) {
            this.setVisibleLayers(value, this.mode);
        },
        visibleSubjectDataLayers (value) {
            this.setRightScrollDisabled(value.length <= this.layerPillsAmount);
        },
        mode (value) {
            this.setVisibleLayers(this.visibleSubjectDataLayerConfigs, value);
        },
        startIndex (value) {
            if (value > 0) {
                this.setLeftScrollDisabled(false);
            }
            else {
                this.setLeftScrollDisabled(true);
            }
        },
        endIndex (value) {
            if (value < this.visibleSubjectDataLayers.length) {
                this.setRightScrollDisabled(false);
            }
            else {
                this.setRightScrollDisabled(true);
            }
        }
    },
    created () {
        new Tooltip(document.body, {
            selector: "[data-bs-toggle='tooltip']"
        });
        this.setVisibleLayers(this.visibleSubjectDataLayerConfigs, this.mode);
        this.setEndIndex(this.portalConfig?.tree?.layerPillsAmount ? this.portalConfig?.tree?.layerPillsAmount : 0);
        this.setLayerPillsAmount(this.endIndex);
    },
    methods: {
        ...mapMutations("LayerPills", ["setVisibleSubjectDataLayers", "setStartIndex", "setEndIndex", "setLayerPillsAmount", "setRightScrollDisabled", "setLeftScrollDisabled"]),
        ...mapMutations(["replaceByIdInLayerConfig", "setVisibleSubjectDataLayerConfigs"]),

        setVisibleLayers (visibleLayers, mapMode) {
            if (visibleLayers) {
                if (mapMode === "2D") {
                    const layerTypes3d = layerFactory.getLayerTypes3d(),
                        visible2DLayers = visibleLayers.filter(layer => {
                            return !layerTypes3d.includes(layer.typ?.toUpperCase());
                        });

                    this.setVisibleSubjectDataLayers(visible2DLayers);
                }
                else {
                    this.setVisibleSubjectDataLayers(visibleLayers);
                }
            }
        },
        removeLayerFromVisibleLayers (layer) {
            const layerIndex = this.visibleSubjectDataLayers.indexOf(layer) + 1;

            if (layerIndex > this.layerPillsAmount) {
                this.setStartIndex(this.startIndex - 1);
                this.setEndIndex(this.endIndex - 1);
            }

            this.replaceByIdInLayerConfig({
                layerConfigs: [{
                    id: layer.id,
                    layer: {
                        id: layer.id,
                        visibility: false
                    }
                }]
            });

        },
        moveLayerPills (direction) {
            if (direction === "right") {
                this.setStartIndex(this.startIndex + 1);
                this.setEndIndex(this.endIndex + 1);
            }
            if (direction === "left") {
                this.setStartIndex(this.startIndex - 1);
                this.setEndIndex(this.endIndex - 1);
            }
        }
    }
};

</script>

<template>
    <div
        v-if="visibleSubjectDataLayers.length > 0 && layerPillsAmount > 0"
        id="layer-pills"
        class="layer-pills-container"
    >
        <ul
            class="nav nav-pills layerpills"
        >
            <li
                class="nav-item"
            >
                <button
                    id="layerpills-left-button"
                    type="button"
                    class="btn btn-customized"
                    :disabled="leftScrollDisabled"
                    aria-label="Scroll left button"
                    @click="moveLayerPills('left')"
                >
                    <i class="bi bi-chevron-left icn-customized" />
                </button>
            </li>
            <li
                v-for="(layer, index) in visibleSubjectDataLayers.slice(startIndex, endIndex)"
                :key="index"
                class="nav-item"
            >
                <a
                    class="nav-link"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    data-bs-custom-class="custom-tooltip"
                    :title="layer.name"
                >
                    {{ layer.name }}
                </a>
                <button
                    type="button"
                    class="btn btn-customized close-button"
                    aria-label="Close button"
                    @click="removeLayerFromVisibleLayers(layer)"
                >
                    <i class="bi bi-x-lg icn-customized" />
                </button>
            </li>
            <li
                class="nav-item"
            >
                <button
                    id="layerpills-right-button"
                    type="button"
                    class="btn btn-customized"
                    :disabled="rightScrollDisabled"
                    aria-label="Scroll right button"
                    @click="moveLayerPills('right')"
                >
                    <i class="bi bi-chevron-right icn-customized" />
                </button>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";

    .layer-pills-container {
        position: relative;
        top: 10px;
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .nav-item {
        background-color: $white;
        border-radius: 25px;
        margin: 2px 5px;
        display: flex;
        align-items: center;
        height: 40px;
    }

    .nav-link {
        color: $black;
        font-size: $font_size_big;
        margin: 5px;
        padding: 10px 0px 7px 15px;
        width: 110px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .btn-customized {
        background-color: $white;
        border-radius: 50px;
        padding: 10px 15px 6.5px 15px;
        border: 0;
        box-shadow: none;
    }

    .custom-tooltip {
        font-size: 20px;
    }
    .icn-customized {
        color: $black;
    }
    .btn-customized:hover {
        background-color: darken($primary, 10%);
        border-color: $white;
    }

    .layerpills {
        pointer-events: all;
    }

</style>
