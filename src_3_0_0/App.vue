<script>
import {mapGetters, mapActions} from "vuex";

import {createMaps} from "./core/maps/maps";
import runLayerFactory from "./core/layers/layerFactory";
import LoaderOverlay from "./utils/loaderOverlay";
import mapCollection from "./core/maps/mapCollection";

export default {
    name: "App",
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
                if (this.portalConfig?.treeType === "default") {
                    // or no 'Fachdaten' in config.json or another config property?
                    this.fillLayerConf();
                }
                this.extendVisibleLayers();
                createMaps(this.portalConfig, this.configJs);
                runLayerFactory(this.visibleLayerConfigs);
            }
        }
    },
    created () {
        this.setGlobalVariables();
        this.loadConfigsToTheVuexState();
    },
    methods: {
        ...mapActions([
            "extendVisibleLayers",
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
            id="map"
        />
    </div>
</template>

<style lang="scss" scoped>
    /* map itself should fill the whole region as "background" */
    #map {
        position: absolute;
        height: 100%;
        width: 100%;
    }
</style>
