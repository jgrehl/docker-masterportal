<script>
import {mapGetters, mapActions, mapMutations} from "vuex";
import {buffer} from "ol/extent";
import {wms, wmts} from "@masterportal/masterportalapi";
import {optionsFromCapabilities} from "ol/source/WMTS";
import proj4 from "proj4";
import {Point} from "ol/geom";

export default {
    name: "LayerPreview",
    props: {
        layerId: {
            type: String,
            required: true
        },
        center: {
            type: [Array, String],
            default: null
        },
        zoomLevel: {
            type: Number,
            default: null
        },
        radius: {
            type: Number,
            default: 1000
        },
        checkable: {
            type: Boolean,
            default: false
        },
        checked: {
            type: Boolean,
            default: false
        },
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
            previewUrl: ""
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
        ...mapMutations("Modules/LayerPreview", ["setPreviewCenter", "setPreviewZoomLevel"]),

        calculateExtent () {
            const resolution = mapCollection.getMapView("2D").getResolutions()[this.previewZoomLevel - 1];

            return buffer(
                new Point(this.previewCenter).getExtent(),
                this.radius * Math.sqrt(resolution)
            );
        },

        buildWMSUrl (layerConfig) {
            let url = `${layerConfig.url}?SERVICE=WMS&REQUEST=GetMap&WIDTH=${this.width}&HEIGHT=${this.height}`;
            const params = wms.makeParams(layerConfig);

            params.CRS = layerConfig.crs ? layerConfig.crs : mapCollection.getMapView("2D").getProjection().getCode();
            params.BBOX = this.calculateExtent(layerConfig);

            Object.entries(params).forEach(([key, value]) => {
                if (key !== "WIDTH" && key !== "HEIGHT") {
                    url += `&${key}=${encodeURIComponent(value)}`;
                }
            });
            this.previewUrl = url;
        },

        buildWMTSUrl (layerConfig) {
            const url = layerConfig.capabilitiesUrl.split("?")[0];

            wmts.getWMTSCapabilities(layerConfig.capabilitiesUrl).then((result) => {
                const capabilitiesOptions = {
                        layer: layerConfig.layers
                    },
                    mapView = mapCollection.getMapView("2D");
                let previewUrl,
                    options = null,
                    transformedCoords = null,
                    tileZ = null,
                    tileCoord = null;

                if (layerConfig.tileMatrixSet) {
                    capabilitiesOptions.matrixSet = layerConfig.tileMatrixSet;
                }
                else {
                    capabilitiesOptions.projection = "EPSG:3857";
                }
                options = optionsFromCapabilities(result, capabilitiesOptions);
                transformedCoords = proj4(proj4(mapView.getProjection().getCode()), proj4("EPSG:3857"), this.previewCenter);
                tileZ = options.tileGrid.getZForResolution(mapView.getResolutions()[this.previewZoomLevel - 1]);
                tileCoord = options.tileGrid.getTileCoordForCoordAndZ(transformedCoords, tileZ);

                previewUrl = `${url}?Service=WMTS&Request=GetTile`;
                previewUrl += `&Version=${encodeURIComponent(result.version)}`;
                previewUrl += `&layer=${encodeURIComponent(layerConfig.layers)}`;
                previewUrl += `&style=${encodeURIComponent(options.style)}`;
                previewUrl += `&Format=${encodeURIComponent(options.format)}`;
                previewUrl += `&tilematrixset=${encodeURIComponent(options.matrixSet)}`;
                previewUrl += `&TileMatrix=${encodeURIComponent("EPSG:3857:" + tileCoord[0])}`;
                previewUrl += `&TileCol=${tileCoord[1]}`;
                previewUrl += `&TileRow=${tileCoord[2]}`;

                this.previewUrl = previewUrl;
            });
        },

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
        class="layerPreview"
        @click="clicked()"
        @keydown.enter="clicked()"
    >
        <div class="wrapperImg">
            <img
                ref="previewEl"
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
