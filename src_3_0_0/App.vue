<script>
import {mapGetters, mapActions} from "vuex";
import ControlBar from "./modules/controls/components/ControlBar.vue";
import MenuContainer from "./modules/menu/components/MenuContainer.vue";
import MenuToggleButton from "./modules/menu/components/MenuToggleButton.vue";
import LayerPills from "./modules/layerPills/components/LayerPills.vue";

import initializeLayers from "./core/layers/js/layerProcessor";
import {initializeMaps} from "./core/maps/js/maps";
import LoaderOverlay from "./app-store/js/loaderOverlay";
import mapCollection from "./core/maps/js/mapCollection";

export default {
    name: "App",
    components: {
        ControlBar,
        MenuContainer,
        MenuToggleButton,
        LayerPills
    },
    computed: {
        ...mapGetters([
            "allConfigsLoaded",
            "configJs",
            "layerConfig",
            "portalConfig",
            "visibleLayerConfigs"
        ]),
        ...mapGetters("Menu", ["mainMenu", "secondaryMenu"])
    },
    watch: {
        allConfigsLoaded (value) {
            if (value) {
                LoaderOverlay.hide();
                this.extendLayers();
                initializeMaps(this.portalConfig, this.configJs);
                initializeLayers(this.visibleLayerConfigs);
            }
        },
        portalConfig (portalConfig) {
            this.mergeModuleState(portalConfig);
        }
    },
    created () {
        this.setGlobalVariables();
        this.loadConfigsToTheVuexState();
        this.checkVueObservation();
    },
    methods: {
        ...mapActions([
            "extendLayers",
            "loadConfigJs",
            "loadConfigJson",
            "loadRestServicesJson",
            "loadServicesJson"
        ]),
        ...mapActions("Modules", [
            "mergeModuleState"
        ]),

        /**
         * Sets global variables.
         * Note: Should be as few as possible.
         * @returns {void}
         */
        setGlobalVariables () {
            global.mapCollection = mapCollection;

            if (typeof Cesium === "undefined") {
                global.Cesium = null;
            }
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
        },

        /**
        * Logs an error, if map3D is observed by vue. Only in mode 'development'.
        * NOTICE: this only works when 3D is enabled once!
        *
        * If the map3D is observed, and more information is needed:
        * Log of the observables in vue:
        * node_modules\vue\dist\vue.runtime.esm.js
        * function defineReactive$$1
        * line 1012: console.log(obj, key, val);
        * @returns {void}
        */
        checkVueObservation () {
            /* eslint-disable no-process-env */
            if (process.env.NODE_ENV === "development") {
                setInterval(() => {
                    const map3d = mapCollection.getMap("3D");

                    if (map3d?.__ob__) {
                        console.error("map3d is observed by vue:", map3d, " This leads to extreme performance problems, and the cause must be eliminated. This can have several causes: the map3D is in vuex-state or is available via getter. Layers are in the state or in the getters and reference the map3D.");
                    }
                }, 5000);
            }
        }
    }
};
</script>

<template>
    <div
        id="masterportal-container"
        class="masterportal-container"
    >
        <MenuContainer
            v-if="allConfigsLoaded && mainMenu"
            side="mainMenu"
        />
        <MenuContainer
            v-if="allConfigsLoaded && secondaryMenu"
            side="secondaryMenu"
        />
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
                <LayerPills />
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
        font-size: $font-size-base;

        #map-wrapper {
            display: flex;
            height: calc(100% - 50px);
            overflow: hidden;
            position: relative;
            flex-grow: 1;
            order: 1;

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
