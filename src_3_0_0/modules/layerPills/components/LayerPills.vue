<script>
import {mapGetters, mapMutations} from "vuex";
import layerFactory from "../../../core/layers/js/layerFactory";
import {Tooltip} from "bootstrap";
import IconButton from "../../../shared/modules/buttons/components/IconButton.vue";

export default {
    name: "LayerPills",
    components: {IconButton},
    computed: {
        ...mapGetters(["isMobile", "visibleSubjectDataLayerConfigs", "portalConfig"]),
        ...mapGetters("Modules/LayerPills", ["visibleSubjectDataLayers", "startIndex", "endIndex", "layerPillsAmount", "leftScrollDisabled", "rightScrollDisabled"]),
        ...mapGetters("Maps", ["mode"])
    },
    watch: {
        visibleSubjectDataLayerConfigs: {
            handler (value) {
                this.setVisibleLayers(value, this.mode);
            },
            deep: true
        },
        visibleSubjectDataLayers: {
            handler (value) {
                this.setRightScrollDisabled(value.length <= this.layerPillsAmount);
            },
            deep: true
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
        ...mapMutations("Modules/LayerPills", ["setVisibleSubjectDataLayers", "setStartIndex", "setEndIndex", "setLayerPillsAmount", "setRightScrollDisabled", "setLeftScrollDisabled"]),
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
                class="nav-item shadow"
            >
                <IconButton
                    :id="'layerpills-left-button'"
                    :aria="$t('modules.layerPill.previous')"
                    :class-array="['btn-light, layerpillsbutton']"
                    :icon="'bi-chevron-left'"
                    :interaction="() => moveLayerPills('left')"
                    :disabled="leftScrollDisabled"
                />
            </li>
            <li
                v-for="(layer, index) in visibleSubjectDataLayers.slice(startIndex, endIndex)"
                :key="index"
                class="nav-item shadow"
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
                <IconButton
                    :aria="$t('modules.layerPill.remove')"
                    :class-array="['btn-light, layerpillsbutton']"
                    class="close-button"
                    :icon="'bi-x-lg'"
                    :interaction="() => removeLayerFromVisibleLayers(layer)"
                />
            </li>
            <li
                class="nav-item shadow"
            >
                <IconButton
                    :id="'layerpills-right-button'"
                    :aria="$t('modules.layerPill.next')"
                    :class-array="['btn-light, layerpillsbutton']"
                    :icon="'bi-chevron-right'"
                    :interaction="() => moveLayerPills('right')"
                    :disabled="rightScrollDisabled"
                />
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
        height: 32px;
    }

    .nav-link {
        color: $black;
        margin: 5px;
        padding: 10px 0px 7px 15px;
        width: 110px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
    }

    .custom-tooltip {
        font-size: 20px;
    }

    .layerpills {
        pointer-events: all;
    }

    .layerpillsbutton {
        width: 2rem;
        height: 2rem;
        font-size: 1.2rem;
    }

</style>
