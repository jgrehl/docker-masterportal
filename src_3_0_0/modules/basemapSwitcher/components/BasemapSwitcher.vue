<script>
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
    name: "BasemapSwitcher",
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
            handler (newVal) {
                const zIndex = [];
                let maxZIndex = null,
                    topLayer = null;

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
        const backgroundLayerConfigIds = [];

        Math.max(this.layerConfigsByAttributes({
            backgroundLayer: true,
            showInLayerTree: true
        }).map(layer => {
            this.setTopBackgroundLayerId(layer.id);
            return layer.zIndex;
        }));

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
                v-for="(layer) in backgroundLayerIds"
                :key="layer"
            >
                <button
                    v-if="activatedExpandable === true"
                    class="btn btn-light"
                    @click="switchActiveBackgroundLayer(layer)"
                >
                    {{ layer }}
                </button>
            </li>
            <button
                class="btn btn-light"
                @click="setActivatedExpandable(!activatedExpandable)"
            >
                {{ topBackgroundLayerId }}
            </button>
            <button
                v-if="topBackgroundLayerId === undefined"
                class="btn btn-light"
            >
                "Choose Map"
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
</style>
