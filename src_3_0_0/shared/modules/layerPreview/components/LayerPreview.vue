<script>
import Point from "ol/geom/Point.js";
import {buffer} from "ol/extent";
import {mapGetters, mapActions, mapMutations} from "vuex";
import {wms} from "@masterportal/masterportalapi";
import {wmts} from "@masterportal/masterportalapi";
import Layer2dRasterWmts from "../../../../core/layers/js/layer2dRasterWmts";
import {optionsFromCapabilities} from "ol/source/WMTS";
import layerCollection from "../../../../core/layers/js/layerCollection";

export default {
    name: "LayerPreview",
    props: {
        layerId: {
            type: String,
            required: true
        },
        center: {
            type: [Array, String]
        },
        zoomLevel: {
            type: Number
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
        customCssClass: {
            type: String,
            default: null
        }
    },
    data () {
        return {
            supportedLayerTyps: ["WMS", "WMTS", "VectorTile"],
            //if smaller some WMS layers load no content in image, e.g. Geobasiskarten (Schriftplatte), handle size by css
            width: 150,
            height: 150,
            previewUrl: ""
        };
    },
     computed: {
        ...mapGetters([ "layerConfigById" ]),
        ...mapGetters("Maps", [ "initialCenter", "initialZoom" ]),
        ...mapGetters("Modules/LayerPreview", ["previewCenter", "previewZoomLevel"])
        
    },
    mounted(){
        const layerConfig = this.layerConfigById(this.layerId);

        this.initialize({center: this.center, zoomLevel: this.zoomLevel});

        if(layerConfig){
           if(this.supportedLayerTyps.includes(layerConfig.typ)) {
                if(layerConfig.typ === "WMS"){
                    this.buildWMSUrl(layerConfig);
                }
                else  if(layerConfig.typ === "WMTS"){
                    this.buildWMTSUrl(layerConfig);
                }
                else  if(layerConfig.typ === "VectorTile"){
                    this.buildVectorTileUrl(layerConfig);
                }
           }
        }
        else{
            console.warn("Layer for preview cannot be found:", this.layerId);
        }
    },
    methods: {
        ...mapActions("Modules/LayerPreview", [
            "initialize"
        ]), 
        ...mapMutations("Modules/LayerPreview", ["setPreviewCenter", "setPreviewZoomLevel"]),

        calculateExtent(){
            let resolution = mapCollection.getMapView("2D").getResolutions()[this.previewZoomLevel];

            return buffer(
                            new Point(this.previewCenter).getExtent(),
                            this.radius * Math.sqrt(resolution)
                        );
        },
       
        buildWMSUrl(layerConfig){
            let params ,
            url = `${layerConfig.url}?SERVICE=WMS&REQUEST=GetMap&WIDTH=${this.width}&HEIGHT=${this.height}`;

            params = wms.makeParams(layerConfig);
            params.CRS = layerConfig.crs ? layerConfig.crs : mapCollection.getMapView("2D").getProjection().getCode(),
            params.BBOX = this.calculateExtent(layerConfig);

            Object.entries(params).forEach(([key, value]) => {
                if(key !== "WIDTH" && key !== "HEIGHT"){
                    url += `&${key}=${encodeURIComponent(value)}`;
                }               
            });
            this.previewUrl = url;
        },

        buildWMTSUrl(layerConfig){
            //https://tiles.geoservice.dlr.de/service/wmts?layer=eoc:basemap&style=_empty&tilematrixset=EPSG:3857&Service=WMTS&Request=GetTile&Version=1.0.0&TileMatrix=EPSG:3857:14&TileCol=8651&TileRow=5296
            let url = layerConfig.capabilitiesUrl.split("?")[0],
            previewUrl;

            //weiter ausprobieren:
            // const l = layerCollection.getLayerById(layerConfig.id);
            // const wmts = new Layer2dRasterWmts(layerConfig);
            // const urls = wmts.getLayer().getLayerSource().getUrls();
            // console.log("Layer2dRasterWmts urls",urls);

            wmts.getWMTSCapabilities(layerConfig.capabilitiesUrl).then((result) => {
                console.log("WMTSCapabilities:", result);

                // const tileMatrixSet = result.Contents.TileMatrixSet.filter(set => set.Identifier === options.matrixSet)[0];

                const capabilitiesOptions = {
                    layer: layerConfig.layers
                };
                if(layerConfig.tileMatrixSet){
                    capabilitiesOptions.matrixSet = matrixSet;
                }
                else {
                    capabilitiesOptions.projection = "EPSG:3857";
                }
                const options = optionsFromCapabilities(result, capabilitiesOptions)
                console.log("options",options);
                const tileMatrixSet = result.Contents.TileMatrixSet.filter(set => set.Identifier === options.matrixSet)[0];
                console.log("tileMatrixSet",tileMatrixSet);

                previewUrl = `${url}?Service=WMTS&Request=GetTile`;
                previewUrl += `&Version=${encodeURIComponent(result.version)}`;
                previewUrl += `&layer=${encodeURIComponent(layerConfig.layers)}`;
                previewUrl += `&style=${encodeURIComponent(options.style)}`;
                previewUrl += `&Format=${encodeURIComponent(options.format)}`;
                previewUrl += `&tilematrixset=${encodeURIComponent(options.matrixSet)}`;
                previewUrl += `&TileMatrix=${encodeURIComponent("EPSG:3857:14")}`;//woher kommt die 14?
                previewUrl += `&TileCol=3857`;//woher kommt das?
                previewUrl += `&TileRow=5296`;//woher kommt das?

                this.previewUrl = previewUrl;
            });
        },

        buildVectorTileUrl(layerConfig){
            this.previewUrl = layerConfig.preview?.src;
        }
    }
  
};
</script>

<template>
    <div>
        <img 
        :class="customCssClass ? 'previewImg ' + customCssClass : 'previewImg'" 
        :src=previewUrl>
    </div>
</template>

<style lang="scss" scoped>
@import "~variables";

.previewImg {
    width: 75px; 
    height: auto;
    display: block;
    -webkit-user-select: none;
    user-select: none;
    background-color: hsl(0, 0%, 90%);
    transition: background-color 300ms;
    border-radius: 50%;
    }

</style>
