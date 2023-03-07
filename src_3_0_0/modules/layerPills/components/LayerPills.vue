<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import layerFactory from "../../../core/layers/js/layerFactory";
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
        this.setVisibleLayers(this.visibleSubjectDataLayerConfigs, this.mode);
        this.setEndIndex(this.portalConfig?.tree?.layerPillsAmount ? this.portalConfig?.tree?.layerPillsAmount : 0);
        this.setLayerPillsAmount(this.endIndex);
    },
    methods: {
        ...mapMutations("Modules/LayerPills", ["setVisibleSubjectDataLayers", "setStartIndex", "setEndIndex", "setLayerPillsAmount", "setRightScrollDisabled", "setLeftScrollDisabled"]),
        ...mapMutations(["setVisibleSubjectDataLayerConfigs"]),
        ...mapActions(["replaceByIdInLayerConfig"]),
        ...mapActions("Modules/LayerInformation", [
            "startLayerInformation"
        ]),

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
        },
        showLayerInformationInMenu (layerConf) {
            if (layerConf.datasets) {
                this.startLayerInformation(layerConf);
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
            class="nav nav-pills"
        >
            <li
                v-if="!isMobile"
                class="nav-item shadow"
            >
                <IconButton
                    :id="'layerpills-left-button'"
                    :aria="$t('common:modules.layerPills.previous')"
                    :class-array="['btn-light', 'layerpillsbutton']"
                    :icon="'bi-chevron-left'"
                    :interaction="() => moveLayerPills('left')"
                    :disabled="leftScrollDisabled"
                />
            </li>
            <li
                v-for="(layer, index) in isMobile ? visibleSubjectDataLayers : visibleSubjectDataLayers.slice(startIndex, endIndex)"
                :key="index"
                class="nav-item shadow"
            >
                <a
                    class="nav-link"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    data-bs-custom-class="custom-tooltip"
                    :data-bs-original-title="layer.name"
                    :title="layer.name"
                    :class="layer.datasets ? 'nav-link-hover' : ''"
                    @click="showLayerInformationInMenu(layer)"
                    @keydown="showLayerInformationInMenu(layer)"
                >
                    {{ layer.name }}
                </a>
                <IconButton
                    :aria="$t('common:modules.layerPills.remove')"
                    :class-array="['btn-light', 'layerpillsbutton']"
                    class="close-button"
                    :icon="'bi-x-lg'"
                    :interaction="() => removeLayerFromVisibleLayers(layer)"
                />
            </li>
            <li
                v-if="!isMobile"
                class="nav-item shadow"
            >
                <IconButton
                    :id="'layerpills-right-button'"
                    :aria="$t('common:modules.layerPills.next')"
                    :class-array="['btn-light', 'layerpillsbutton']"
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
        pointer-events: all;
    }

    .nav-item {
        background-color: $white;
        border-radius: 25px;
        margin: 2px 5px;
        display: flex;
        align-items: center;
        max-height: fit-content;
    }

    .nav-link {
        color: $black;
        margin: 5px;
        padding: 0 0 0 1rem;
        width: 110px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
    }
    .nav-link-hover:hover {
        cursor: pointer;
    }

    .custom-tooltip {
        font-size: 20px;
    }

    .layerpillsbutton {
        width: 2rem;
        height: 2rem;
        font-size: 1.2rem;
    }

    @media (max-width: 767px) {
        .nav-pills {
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        scrollbar-width: none; /* for firefox */
    }
    .nav-pills::-webkit-scrollbar {
        display: none; /* for chrome */
    }

    }

</style>
