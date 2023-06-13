<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import LayerPreview from "../../../shared/modules/layerPreview/components/LayerPreview.vue";

export default {
    name: "BasemapSwitcher",
    components: {
        LayerPreview
    },
    computed: {
        ...mapGetters([
            "isMobile",
            "visibleBackgroundLayerConfigs",
            "allBackgroundLayerConfigs",
            "layerConfigsByAttributes"
        ]),
        ...mapGetters("Modules/BasemapSwitcher", [
            "activatedExpandable",
            "backgroundLayerIds",
            "topBackgroundLayerId"
        ])
    },
    watch: {
        visibleBackgroundLayerConfigs: {
            handler (newVal, oldVal) {
                const allBackgroundLayerIds = this.backgroundLayerIds,
                    zIndex = [];
                let maxZIndex = null,
                    topLayer = null;

                if (newVal.length === 0) {
                    if (!allBackgroundLayerIds.includes(oldVal[0].id)) {
                        allBackgroundLayerIds.push(oldVal[0].id);
                    }
                    this.setBackgroundLayerIds(allBackgroundLayerIds);
                }

                newVal.forEach((val) => {
                    zIndex.push(val.zIndex);
                });

                maxZIndex = Math.max(...zIndex);
                topLayer = newVal.filter(layer =>layer.zIndex === maxZIndex);

                if (topLayer[0]?.id !== undefined) {
                    this.setTopBackgroundLayerId(topLayer[0]?.id);
                }
                else {
                    this.setTopBackgroundLayerId();
                }
                this.setActivatedExpandable(false);
            },
            deep: true
        }
    },
    created () {
        const backgroundLayerConfigIds = [],
            backgroundLayers = this.layerConfigsByAttributes({
                backgroundLayer: true,
                showInLayerTree: true
            });

        if (backgroundLayers.length > 1) {
            const layerWithMaxZIndex = backgroundLayers.filter(layer => {
                return Math.max(layer.zIndex);
            });

            this.setTopBackgroundLayerId(layerWithMaxZIndex[0]?.id);
        }
        else {
            this.setTopBackgroundLayerId(backgroundLayers[0]?.id);
        }

        Object.values(this.allBackgroundLayerConfigs).forEach(layer => {
            if (layer.id !== this.topBackgroundLayerId) {
                backgroundLayerConfigIds.push(layer.id);
            }
        });
        this.setBackgroundLayerIds(backgroundLayerConfigIds);

        document.addEventListener("click", event => {
            const backroundSwitcher = document.getElementById("basemap-switcher"),
                isClickInside = backroundSwitcher.contains(event.target);

            if (!isClickInside) {
                this.setActivatedExpandable(false);
            }
        });
    },
    methods: {
        ...mapMutations("Modules/BasemapSwitcher", [
            "setActivatedExpandable",
            "setBackgroundLayerIds",
            "setTopBackgroundLayerId"
        ]),
        ...mapMutations(["setBackgroundLayerVisibility"]),
        ...mapActions(["replaceByIdInLayerConfig"]),
        ...mapActions("Modules/BasemapSwitcher", ["updateLayerVisibilityAndZIndex"]),


        switchActiveBackgroundLayer (layerId) {
            this.updateLayerVisibilityAndZIndex(layerId);

            const selectableBackroundLayerIds = this.backgroundLayerIds,
                index = selectableBackroundLayerIds.map(id => {
                    return id;
                }).indexOf(layerId);

            selectableBackroundLayerIds.splice(index, 1);
            if (this.topBackgroundLayerId !== undefined) {
                selectableBackroundLayerIds.push(this.topBackgroundLayerId);
            }
            this.setBackgroundLayerIds(selectableBackroundLayerIds);

            this.setTopBackgroundLayerId([]);
            this.setTopBackgroundLayerId(layerId);
            this.setActivatedExpandable(false);
        }
    }
};

</script>

<template>
    <div
        v-if="backgroundLayerIds.length > 1"
        id="basemap-switcher"
        class="btn-group-vertical my-5 btn-group-background-switcher shadow"
        role="group"
    >
        <ul>
            <li
                v-for="(layerId) in backgroundLayerIds"
                :key="layerId"
            >
                <button
                    v-if="activatedExpandable === true"
                    id="bs-expanded"
                    class="btn btn-light preview"
                    @click="switchActiveBackgroundLayer(layerId)"
                >
                    <LayerPreview
                        :id="'layer-tree-layer-preview-' + layerId"
                        :layer-id="layerId"
                    />
                </button>
            </li>
            <button
                v-if="topBackgroundLayerId === undefined"
                id="bs-placeholder"
                class="btn btn-light preview"
                @click="setActivatedExpandable(!activatedExpandable)"
            >
                Choose Map
            </button>
            <button
                v-else
                id="bs-topBackgroundLayer"
                class="btn btn-light preview"
                @click="setActivatedExpandable(!activatedExpandable)"
            >
                <LayerPreview
                    :id="'layer-tree-layer-preview-' + topBackgroundLayerId"
                    :layer-id="topBackgroundLayerId"
                />
            </button>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";

    #basemap-switcher {
        pointer-events: all;
    }
    .btn-group-background-switcher {
        background-color: $white;
        border: solid $white 1px;
        border-radius: 25px;
        position: absolute;
        bottom: 0;
        align-self: start;
    }

    ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
    }
    .preview {
        padding: 0px;
        margin: 5px;
    }
</style>
