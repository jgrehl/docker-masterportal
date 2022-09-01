<script>
import {mapGetters, mapActions} from "vuex";

import ControlBar from "./modules/controls/ControlBar.vue";
import {createMaps} from "./core/maps/maps";
import initializeLayerFactory from "./core/layers/layerFactory";
import LoaderOverlay from "./utils/loaderOverlay";
import mapCollection from "./core/maps/mapCollection";

export default {
    name: "App",
    components: {
        ControlBar
    },
    computed: {
        ...mapGetters([
            "allConfigsLoaded",
            "configJs",
            "layerConfig",
            "portalConfig",
            "visibleLayerConfigs"
        ])
    },
    watch: {
        allConfigsLoaded (value) {
            if (value) {
                LoaderOverlay.hide();
                this.extendLayers();
                createMaps(this.portalConfig, this.configJs);
                initializeLayerFactory(this.visibleLayerConfigs);
            }
        }
    },
    created () {
        this.setGlobalVariables();
        this.loadConfigsToTheVuexState();
    },
    methods: {
        ...mapActions([
            "extendLayers",
            "fillLayerConf",
            "loadConfigJs",
            "loadConfigJson",
            "loadRestServicesJson",
            "loadServicesJson"
        ]),

        /**
         * Sets global variables.
         * Note: Should be as few as possible.
         * @returns {void}
         */
        setGlobalVariables () {
            global.mapCollection = mapCollection;
        },

        /**
         * Load configs to the vuex state.
         * @returns {void}
         */
        loadConfigsToTheVuexState () {
            this.loadConfigJs(Config);
            this.loadConfigJson();
            this.loadServicesJson();
            this.loadRestServicesJson();
        }
    }
};
</script>

<template>
    <div
        id="masterportal-container"
        class="masterportal-container"
    >
        <div
            id="map-wrapper"
        >
            <div
                id="map"
            />
            <div
                v-if="allConfigsLoaded"
                class="elements-positioned-over-map"
            >
                <ControlBar class="controls" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    @import "~variables";

    #masterportal-container {
        display: flex;
        flex-direction: column;
        flex-flow: column;

        position: relative;

        height: 100%;
        width: 100%;

        font-family: $font_family_default;
        font-size: $font_size_default;

        #map-wrapper {
            display: flex;
            height:calc(100% - 50px);
            overflow: hidden;
            position: relative;
            flex-grow:1;
            order:1;

            #map {
                position: absolute;
                height: 100%;
                width: 100%;
            }
            .elements-positioned-over-map {
                display: flex;
                flex-direction: column;
                align-items: flex-end;

                width: 100%;
                height: 100%;

                .controls {
                    flex-grow: 1;
                }
            }
        }
    }
</style>
