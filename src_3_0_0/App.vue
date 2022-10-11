<script>
import {mapGetters, mapActions} from "vuex";
import ControlBar from "./modules/controls/ControlBar.vue";
import ContainerItem from "./modules/container/ContainerItem.vue";
import MenuContainer from "./core/menu/MenuContainer.vue";
import initializeLayers from "./core/layers/layerProcessor";
import {initializeMaps} from "./core/maps/maps";
import initializeModules from "./core/modules/moduleProcessor";
import LoaderOverlay from "./utils/loaderOverlay";
import mapCollection from "./core/maps/mapCollection";

export default {
    name: "App",
    components: {
        ControlBar,
        ContainerItem,
        MenuContainer
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
                initializeModules(this.portalConfig);
            }
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
        <MenuContainer v-if="allConfigsLoaded && mainMenu" />
        <div
            id="map-wrapper"
        >
            <div
                id="map"
            />
            <button
                id="menu-toggle-button"
                class="btn btn-primary bootstrap-icon"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#menu-offcanvas-main"
                :aria-label="$t('common:menu.ariaLabelOpen')"
            >
                <i class="bi-list" />
            </button>
            <!-- only for Testing -->
            <ContainerItem />
            <div
                v-if="allConfigsLoaded"
                class="elements-positioned-over-map"
            >
                <ControlBar class="controls" />
            </div>
        </div>
        <MenuContainer
            v-if="allConfigsLoaded && secondaryMenu"
            side="secondary"
        />
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
            #menu-toggle-button {
                // TODO(roehlipa): Style ist wie bei ControlIcons, zentralisieren!
                position: absolute;
                top: 15px;
                left: 15px;
                font-size: calc(#{$icon_length} - 0.35 * #{$icon_length});
                height: $icon_length;
                width: $icon_length;

                i {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    line-height: 0;
                }
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
