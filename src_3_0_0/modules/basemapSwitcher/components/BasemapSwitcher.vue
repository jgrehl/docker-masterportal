<script>
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
    name: "BasemapSwitcher",
    computed: {
        ...mapGetters(["isMobile", "allBackgroundLayerConfigs", "layerConfigsByAttributes"]),
        ...mapGetters("Modules/BasemapSwitcher", [
            "activatedExpandable",
            "backgroundLayerIds",
            "topBackgroundLayerId"
        ])
    },
    watch: {
        activatedExpandable () {
            // console.log("it switched", this.activatedExpandable);
        }
    },
    created () {
        const backgroundLayerConfigIds = [];

        Object.values(this.allBackgroundLayerConfigs).forEach(layer => {
            backgroundLayerConfigIds.push(layer.id);
        });
        this.setBackgroundLayerIds(backgroundLayerConfigIds);
    },
    methods: {
        ...mapMutations("Modules/BasemapSwitcher", ["setActivatedExpandable", "setBackgroundLayerIds", "setTopBackgroundLayerId"]),
        ...mapMutations(["setBackgroundLayerVisibility"]),
        ...mapActions(["replaceByIdInLayerConfig"]),
        ...mapActions("Modules/BasemapSwitcher", ["updateLayerTree"]),


        switchActiveBackgroundLayer (layerId) {
            this.updateLayerTree(layerId);

            this.setTopBackgroundLayerId([]);
            this.setTopBackgroundLayerId(layerId);
        }
    }
};

</script>

<template>
    <div
        v-if="backgroundLayerIds.length > 1"
        id="basemap-switcher"
        class="btn-group-vertical my-5 btn-group-basemap-switcher shadow"
        role="group"
    >
        <ul>
            <li
                v-for="(layer) in backgroundLayerIds"
                :key="layer"
            >
                <button
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
        </ul>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";

    #basemap-switcher {
        pointer-events: all;
    }
    .btn-group-basemap-switcher {
        background-color: $white;
        border: solid $white 1px;
        border-radius: 25px;
        position: absolute;
        bottom: 0;
        align-self: start;
    }

    li {
        list-style-type: none;
    }
</style>
