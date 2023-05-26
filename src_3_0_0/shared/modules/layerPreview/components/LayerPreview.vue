<script>
import {mapGetters, mapActions} from "vuex";
import {buffer} from "ol/extent";
import {wms, wmts} from "@masterportal/masterportalapi";
import {optionsFromCapabilities} from "ol/source/WMTS";
import proj4 from "proj4";
import {Point} from "ol/geom";

export default {
    name: "LayerPreview",
    props: {
        /** id of the layer to create a preview for */
        layerId: {
            type: String,
            required: true
        },
        /** center coordinates fro the preview */
        center: {
            type: [Array, String],
            default: null
        },
        /** zoomLevel coordinates fro the preview */
        zoomLevel: {
            type: Number,
            default: null
        },
        /** radius of the extent, default is 1000 metres */
        radius: {
            type: Number,
            default: 1000
        },
        /** if true, preview is checkable */
        checkable: {
            type: Boolean,
            default: false
        },
        /** if true, preview is checked */
        checked: {
            type: Boolean,
            default: false
        },
        /** custom css-class to overwrite style, NOTICE: maybe '!important' must be used */
        customClass: {
            type: String,
            default: ""
        }
    },
    emits: ["previewClicked"],
    data () {
        return {
            supportedLayerTyps: ["WMS", "WMTS", "VectorTile"],
            // if smaller some WMS layers load no content in image, e.g. Geobasiskarten (Schriftplatte), handle size by css
            width: 150,
            height: 150,
            previewUrl: null
        };
    },
    computed: {
        ...mapGetters(["layerConfigById"]),
        ...mapGetters("Maps", ["initialCenter", "initialZoom"]),
        ...mapGetters("Modules/LayerPreview", ["previewCenter", "previewZoomLevel"])

    },
    mounted () {
        const layerConfig = this.layerConfigById(this.layerId);

        if (layerConfig && this.supportedLayerTyps.includes(layerConfig.typ)) {
            this.initialize({center: this.center, zoomLevel: this.zoomLevel});
            if (layerConfig.typ === "WMS") {
                this.buildWMSUrl(layerConfig);
            }
            else if (layerConfig.typ === "WMTS") {
                this.buildWMTSUrl(layerConfig);
            }
            else if (layerConfig.typ === "VectorTile") {
                this.buildVectorTileUrl(layerConfig);
            }
        }
        else {
            console.warn("Layer for preview cannot be found:", this.layerId);
        }
    },
    methods: {
        ...mapActions("Modules/LayerPreview", [
            "initialize"
        ]),

        /**
         * Calculates the extent by zoomlevel/resolution, center and radius from props.
         * @returns {ol.extent.buffer} the extent
         */
        calculateExtent () {
            const resolution = mapCollection.getMapView("2D").getResolutions()[this.previewZoomLevel - 1];

            return buffer(
                new Point(this.previewCenter).getExtent(),
                this.radius * Math.sqrt(resolution)
            );
        },

        /**
         * Sets the previewUrl from layerConfigs params.
         * @param {Object} layerConfig config of the WMS layer
         * @returns {void}
         */
        buildWMSUrl (layerConfig) {
            let url = `${layerConfig.url}?SERVICE=WMS&REQUEST=GetMap&WIDTH=${this.width}&HEIGHT=${this.height}`;
            const params = wms.makeParams(layerConfig);

            params.CRS = layerConfig.crs ? layerConfig.crs : mapCollection.getMapView("2D").getProjection().getCode();
            params.BBOX = this.calculateExtent();

            Object.entries(params).forEach(([key, value]) => {
                if (key !== "WIDTH" && key !== "HEIGHT") {
                    url += `&${key}=${encodeURIComponent(value)}`;
                }
            });
            this.previewUrl = url;
        },

        /**
         * Sets the previewUrl from layerConfigs capabilities.
         * @param {Object} layerConfig config of the WMTS layer
         * @returns {void}
         */
        buildWMTSUrl (layerConfig) {
            wmts.getWMTSCapabilities(layerConfig.capabilitiesUrl).then((capabilities) => {
                this.createWMTSPreviewUrlFromCapabilities(layerConfig, capabilities);
            }).catch(error => {
                console.warn("Error occured during creation of url for preview of wmts-layer", layerConfig, error);
            });
        },

        /**
         * Creates the url for this WMTS layer-config from the WMTS capabilities and sets it to previewUrl.
         * @param {Object} layerConfig config of the WMTS layer
         * @param {Object} capabilities capabilities  of the WMTS layer
         * @returns {void}
         */
        createWMTSPreviewUrlFromCapabilities (layerConfig, capabilities) {
            const capabilitiesOptions = {
                    layer: layerConfig.layers
                },
                mapView = mapCollection.getMapView("2D"),
                url = layerConfig.capabilitiesUrl?.split("?")[0];
            let previewUrl,
                options = null,
                transformedCoords = null,
                tileZ = null,
                tileCoord = null,
                tileMatrix = null;

            if (layerConfig.tileMatrixSet) {
                capabilitiesOptions.matrixSet = layerConfig.tileMatrixSet;
            }
            else {
                capabilitiesOptions.projection = "EPSG:3857";
            }
            options = optionsFromCapabilities(capabilities, capabilitiesOptions);
            transformedCoords = proj4(proj4(mapView.getProjection().getCode()), proj4("EPSG:3857"), this.previewCenter);
            tileZ = options?.tileGrid.getZForResolution(mapView.getResolutions()[this.previewZoomLevel - 1]);
            tileCoord = options?.tileGrid.getTileCoordForCoordAndZ(transformedCoords, tileZ);
            tileMatrix = tileCoord ? "EPSG:3857:" + tileCoord[0] : "EPSG:3857:0";

            previewUrl = `${url}?Service=WMTS&Request=GetTile`;
            previewUrl += `&Version=${encodeURIComponent(capabilities.version)}`;
            previewUrl += `&layer=${encodeURIComponent(layerConfig.layers)}`;
            previewUrl += `&style=${encodeURIComponent(options?.style)}`;
            previewUrl += `&Format=${encodeURIComponent(options?.format)}`;
            previewUrl += `&tilematrixset=${encodeURIComponent(options?.matrixSet)}`;
            previewUrl += `&TileMatrix=${encodeURIComponent(tileMatrix)}`;
            previewUrl += `&TileCol=${tileCoord ? tileCoord[1] : "0"}`;
            previewUrl += `&TileRow=${tileCoord ? tileCoord[2] : "0"}`;
            this.previewUrl = previewUrl;
        },

        /**
         * Sets the previewUrl from layerConfigs preview.src.
         * @param {Object} layerConfig config of the VectorTile layer
         * @returns {void}
         */
        buildVectorTileUrl (layerConfig) {
            this.previewUrl = layerConfig.preview?.src;
        },

        /**
         * Listener for click on preview.
         * @returns {void}
         */
        clicked () {
            if (this.checkable) {
                this.$emit("previewClicked");
            }
        }
    }

};
</script>

<template>
    <div
        v-if="previewUrl"
        class="layerPreview"
        @click="clicked()"
        @keydown.enter="clicked()"
    >
        <div class="wrapperImg">
            <img
                :class="[
                    customClass,
                    'previewImg'
                ]"
                :src="previewUrl"
                alt="previewImg"
            >
        </div>

        <div
            v-if="checkable"
            :class="[
                customClass,
                'checkable',
                {
                    'bi-check-circle': checked,
                    'bi-circle': !checked
                }
            ]"
        />
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

.layerPreview{
    position: relative;
}
.previewImg {
    width: 50px;
    height: auto;
    display: block;
    -webkit-user-select: none;
    user-select: none;
    background-color: hsl(0, 0%, 90%);
    transition: background-color 300ms;
    border-radius: 50%;
}
.bi-check-circle::before {
    display: block;
}
.bi-circle::before {
    display: block;
}
.wrapperImg{
   position: absolute;
}
.checkable{
    position: absolute;
    width: 50px;
    height: 50px;
    font-size: 3.7rem;
}

</style>
