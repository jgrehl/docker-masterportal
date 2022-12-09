<script>
import {mapGetters, mapActions} from "vuex";
import Alerting from "./modules/alerting/components/AlertingItem.vue";
import ControlBar from "./modules/controls/components/ControlBar.vue";
import initializeLayers from "./core/layers/js/layerProcessor";
import {initializeMaps} from "./core/maps/js/maps";
import LayerPills from "./modules/layerPills/components/LayerPills.vue";
import LoaderOverlay from "./app-store/js/loaderOverlay";
import mapCollection from "./core/maps/js/mapCollection";
import MenuContainer from "./modules/menu/components/MenuContainer.vue";
import MenuToggleButton from "./modules/menu/components/MenuToggleButton.vue";


export default {
    name: "App",
    components: {
        Alerting,
        ControlBar,
        LayerPills,
        MenuContainer,
        MenuToggleButton
    },
    computed: {
        ...mapGetters([
            "allConfigsLoaded",
            "configJs",
            "portalConfig",
            "uiStyle",
            "visibleLayerConfigs"
        ]),
        ...mapGetters("Menu", ["mainMenu", "secondaryMenu", "mainExpanded", "secondaryExpanded"])
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
            this.mergeModulesState(portalConfig);
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
            "mergeModulesState"
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
            v-if="allConfigsLoaded && mainMenu && uiStyle !== 'SIMPLE'"
            side="mainMenu"
        />
        <div
            id="map-wrapper"
            class="mp-map"
        >
            <Alerting />
            <MenuToggleButton
                v-if="allConfigsLoaded && mainMenu && uiStyle !== 'SIMPLE'"
                side="mainMenu"
            />
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
            <MenuToggleButton
                v-if="allConfigsLoaded && secondaryMenu && uiStyle !== 'SIMPLE'"
                side="secondaryMenu"
            />
        </div>
        <MenuContainer
            v-if="allConfigsLoaded && secondaryMenu && uiStyle !== 'SIMPLE'"
            side="secondaryMenu"
        />
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

.masterportal-container {
    display: flex;
    flex-direction: row;
    position: relative;
    height: 100%;
    width: 100%;
    font-family: $font_family_default;
    font-size: $font-size-base;

    .mp-map {
        height: 100%;
        width: 100%;
        overflow: hidden;
        position: relative;
        display: flex;
        flex-direction: row;

        #map {
            position: fixed;
            height: 100%;
            width: 100%;
        }
    }
}

.elements-positioned-over-map {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    z-index: 1;
    pointer-events: none;
    position: fixed;
    width: 100%;
    height: 100%;

    .controls {
        flex-grow: 1;
    }
}

@include media-breakpoint-up(sm) {
    #map {
        position: relative;
    }
    .elements-positioned-over-map {
        position: relative;
    }
}
</style>
