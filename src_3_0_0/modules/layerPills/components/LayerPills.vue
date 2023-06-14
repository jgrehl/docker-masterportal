<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import layerFactory from "../../../core/layers/js/layerFactory";
import IconButton from "../../../shared/modules/buttons/components/IconButton.vue";

export default {
    name: "LayerPills",
    components: {IconButton},
    data () {
        return {
            scrolled: 0,
            scrollEnd: false
        };
    },
    computed: {
        ...mapGetters(["isMobile", "visibleSubjectDataLayerConfigs"]),
        ...mapGetters("Modules/LayerPills", [
            "active",
            "amount",
            "configPaths",
            "type",
            "visibleSubjectDataLayers"
        ]),
        ...mapGetters("Maps", ["mode"]),
        containerWidth () {
            return this.isMobile ? 320 : this.amount * 158 + 70;
        }
    },
    watch: {
        visibleSubjectDataLayerConfigs: {
            handler (newVal, oldVal) {
                let newValue = {},
                    oldValue = {};

                if (oldVal.length !== newVal.length) {
                    newValue = newVal.filter(x => !oldVal.includes(x));
                    if (newValue.length === 0) {
                        oldValue = oldVal.filter(x => !newVal.includes(x));
                    }
                }

                if (Object.keys(newValue).length > 0) {
                    this.setVisibleLayers(newVal, this.mode, newValue);
                }
                if (Object.keys(oldValue).length > 0) {
                    this.setVisibleLayers(newVal, this.mode, newValue);
                }
            },
            deep: true
        },
        mode (value) {
            this.setVisibleLayers(this.visibleSubjectDataLayerConfigs, value);
        }
    },
    created () {
        this.initializeModule({configPaths: this.configPaths, type: this.type});
        this.setVisibleLayers(this.visibleSubjectDataLayerConfigs, this.mode);
    },
    methods: {
        ...mapMutations("Modules/LayerPills", ["setVisibleSubjectDataLayers", "setAmount", "setActive"]),
        ...mapMutations(["setVisibleSubjectDataLayerConfigs"]),
        ...mapActions(["initializeModule", "replaceByIdInLayerConfig"]),
        ...mapActions("Modules/LayerInformation", ["startLayerInformation"]),

        setVisibleLayers (visibleLayers, mapMode, newValues = []) {
            if (visibleLayers) {
                if (mapMode === "2D") {
                    const layerTypes3d = layerFactory.getLayerTypes3d(),
                        visible2DLayers = visibleLayers.filter(layer => {
                            return !layerTypes3d.includes(layer.typ?.toUpperCase());
                        });

                    if (Object.keys(newValues).length !== 0) {
                        const layers = this.visibleSubjectDataLayers;

                        newValues.forEach((val) => {
                            layers.unshift(val);
                        });

                        this.setVisibleSubjectDataLayers(layers);
                        this.setScrollEnd(layers);
                    }
                    else {
                        this.setVisibleSubjectDataLayers(visible2DLayers);
                        this.setScrollEnd(visible2DLayers);
                    }
                }
                else {
                    this.setVisibleSubjectDataLayers(visibleLayers);
                    this.setScrollEnd(visibleLayers);
                }
            }
        },
        removeLayerFromVisibleLayers (layer) {
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
            const value = direction === "right" ? 158 : -158;

            this.scrolled = this.$el.scrollLeft;
            if (!(this.scrolled === 0 && direction === "left") || !(this.scrollEnd && direction === "right")) {
                this.$el.scrollBy({
                    left: value,
                    behavior: "smooth"
                });

                this.scrolled = this.scrolled + value < 0 ? 0 : this.scrolled + value;
                this.scrollEnd = this.$el.scrollWidth - this.containerWidth <= this.scrolled;
            }

        },
        setScrollEnd (layers) {
            if (this.amount >= layers.length) {
                this.scrolled = 0;
            }
            this.scrollEnd = this.amount >= layers.length;
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
        v-if="visibleSubjectDataLayers.length > 0 && active && amount > 0"
        id="layer-pills"
        class="layer-pills-container"
        :style="'width:' + containerWidth + 'px'"
    >
        <IconButton
            v-if="!isMobile"
            :id="'layerpills-left-button'"
            :aria="$t('modules.layerPill.previous')"
            :class-array="['btn-primary', 'layerpills-left-button', 'shadow']"
            :icon="'bi-chevron-left'"
            :style="scrolled !== 0 ? '' : 'visibility:hidden'"
            :interaction="() => moveLayerPills('left')"
        />
        <TransitionGroup
            name="list"
            tag="ul"
            class="nav nav-pills"
        >
            <li
                v-for="(layer) in visibleSubjectDataLayers"
                :key="layer.id"
                class="nav-item shadow"
            >
                <a
                    class="nav-link"
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    data-bs-custom-class="custom-tooltip"
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
        </TransitionGroup>
        <IconButton
            v-if="!isMobile"
            :id="'layerpills-right-button'"
            :aria="$t('modules.layerPill.next')"
            :class-array="['btn-primary', 'layerpills-right-button', 'shadow']"
            :icon="'bi-chevron-right'"
            :style="scrollEnd ? 'visibility:hidden' : ''"
            :interaction="() => moveLayerPills('right')"
        />
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";
    .layer-pills-container {
        position: relative;
        top: 15px;
        display: flex;
        justify-content: left;
        pointer-events: all;
        overflow: hidden;
        margin: 0 auto 0 auto;
        border-radius: 19px;
    }

    .nav-pills {
        display: flex;
        flex-wrap: nowrap;
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

    .list-enter-active, .list-leave-active {
      transition: width 0.3s ease;
    }
    .list-enter-to, .list-leave-from {
        width: 100%;
        transition: width 0.3s ease;
    }
    .list-enter-from, .list-leave-to{
        width: 0%;
    }

    .custom-tooltip {
        font-size: 20px;
    }

    .layerpillsbutton {
        width: 2rem;
        height: 2rem;
        font-size: 1.2rem;
        position: relative;
    }

    .layerpills-right-button {
        flex-shrink: 0;
        z-index: 3;
        right: 0px;
    }

    .layerpills-left-button {
        flex-shrink: 0;
        z-index: 3;
        left: 0px;
    }

    .visibility {
        visibility: hidden;
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
