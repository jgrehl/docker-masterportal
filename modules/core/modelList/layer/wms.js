import Layer from "./model";
import TileWMS from "ol/source/TileWMS.js";
import TileGrid from "ol/tilegrid/TileGrid.js";
import ImageWMS from "ol/source/ImageWMS.js";
import {Image, Tile} from "ol/layer.js";

const WMSLayer = Layer.extend({
    defaults: function () {
        // extended die Layer defaults by value
        return Object.assign(Layer.prototype.defaults, {
            infoFormat: "text/xml",
            // Eine Veränderung der CACHEID initiiert von openlayers ein reload des Dienstes und umgeht den Browser-Cache
            cacheId: parseInt(Math.random() * 10000000, 10),
            supported: ["2D", "3D"],
            showSettings: true,
            extent: null,
            notSupportedFor3D: ["1747", "1749", "1750", "9822", "12600", "9823", "1752", "9821", "1750", "1751", "12599", "2297"]
        });
    },

    initialize: function () {

        this.checkForScale(Radio.request("MapView", "getOptions"));

        if (!this.get("isChildLayer")) {
            Layer.prototype.initialize.apply(this);
        }

        this.listenTo(this, {
            "change:SLDBody": this.updateSourceSLDBody
        });

        // Hack für Dienste die nicht EPSG:4326 untertützen
        if (this.get("notSupportedFor3D").includes(this.get("id"))) {
            this.set("supported", ["2D"]);
        }
    },

    /**
     * [createLayerSource description]
     * @return {void}
     */
    createLayerSource: function () {
        let params,
            source;

        params = {
            CACHEID: this.get("cacheId"),
            LAYERS: this.get("layers"),
            FORMAT: this.get("format") === "nicht vorhanden" ? "image/png" : this.get("format"),
            VERSION: this.get("version"),
            TRANSPARENT: this.get("transparent").toString()
        };

        if (this.get("styles") && this.get("styles") !== "" && this.get("styles") !== "nicht vorhanden") {
            params = Object.assign(params, {
                STYLES: this.get("styles")
            });
        }
        this.set("tileloaderror", false);

        if (this.get("singleTile") !== true) {
            // TileWMS can be cached
            this.set("tileCountloaderror", 0);
            this.set("tileCount", 0);
            source = new TileWMS({
                url: this.get("url"),
                attributions: this.get("olAttribution"),
                gutter: this.get("gutter"),
                params: params,
                tileGrid: new TileGrid({
                    resolutions: Radio.request("MapView", "getResolutions"),
                    origin: [
                        442800,
                        5809000
                    ],
                    tileSize: parseInt(this.get("tilesize"), 10)
                })
            });

            // wms_webatlasde
            if (this.get("url").indexOf("wms_webatlasde") !== -1) {
                if (this.get("tileloaderror") === false) {
                    this.set("tileloaderror", true);
                    source.on("tileloaderror", function () {
                        if (!navigator.cookieEnabled) {
                            Radio.trigger("Alert", "alert", {text: "<strong>Bitte erlauben sie Cookies, damit diese Hintergrundkarte geladen werden kann.</strong>", kategorie: "alert-warning"});
                        }
                    });
                }
            }

            this.setLayerSource(source);
        }
        else {
            // ImageWMS can not be cached
            this.setLayerSource(new ImageWMS({
                url: this.get("url"),
                attributions: this.get("olAttribution"),
                params: params
            }));
        }
        // this.registerErrorListener();
        // this.registerLoadingListeners();
    },

    /**
     * [createLayer description]
     * @return {void}
     */
    createLayer: function () {
        const layerobjects =
            {
                id: this.get("id"),
                source: this.get("layerSource"),
                name: this.get("name"),
                typ: this.get("typ"),
                legendURL: this.get("legendURL"),
                routable: this.get("routable"),
                gfiTheme: this.get("gfiTheme"),
                infoFormat: this.get("infoFormat")
            };

        if (this.get("singleTile") !== true) {
            this.setLayer(new Tile(layerobjects));
        }
        else {
            this.setLayer(new Image(layerobjects));
        }
        this.createLegend();
    },

    /**
     * Wenn der Parameter "legendURL" leer ist, wird er auf GetLegendGraphic gesetzt.
     * @return {void}
     */
    createLegend: function () {
        const legends = [],
            version = this.get("version");
        let legend = this.get("legend");

        /**
         * @deprecated in 3.0.0
         */
        if (this.get("legendURL")) {
            console.warn("legendURL ist deprecated in 3.0.0. Please use attribute \"legend\" als Boolean or String with path to legend image or pdf");
            if (this.get("legendURL") === "") {
                legend = true;
            }
            else if (this.get("legendURL") === "ignore") {
                legend = false;
            }
            else {
                legend = this.get("legendURL");
            }
        }

        if (legend === true || Array.isArray(legend)) {
            const layerNames = this.get("layers").split(",");

            if (layerNames.length === 1) {
                legends.push(encodeURI(this.get("url") + "?VERSION=" + version + "&SERVICE=WMS&REQUEST=GetLegendGraphic&FORMAT=image/png&LAYER=" + this.get("layers")));
            }
            else if (layerNames.length > 1) {
                layerNames.forEach(layerName => {
                    legends.push(encodeURI(this.get("url") + "?VERSION=" + version + "&SERVICE=WMS&REQUEST=GetLegendGraphic&FORMAT=image/png&LAYER=" + layerName));
                });
            }

            this.setLegend(legends);
        }
        else if (typeof legend === "string") {
            this.setLegend([legends]);
        }
    },

    /**
     * Register LayerLoad-Events
     * @returns {void}
     */
    registerLoadingListeners: function () {
        if (this.get("layerSource") instanceof TileWMS) {
            this.registerTileWMSLoadEvents();
        }
        else if (this.get("layerSource") instanceof ImageWMS) {
            this.registerImageLoadEvents();
        }
    },

    registerImageLoadEvents: function () {
        this.get("layerSource").on("imageloadend", function () {
            this.set("loadingParts", this.get("loadingParts") - 1);
        });

        this.get("layerSource").on("imageloadstart", function () {
            const startval = this.get("loadingParts") ? this.get("loadingParts") : 0;

            this.set("loadingParts", startval + 1);
        });

        this.get("layerSource").on("change:loadingParts", function (obj) {
            if (obj.oldValue > 0 && this.get("loadingParts") === 0) {
                this.dispatchEvent("wmsloadend");
                this.unset("loadingParts", {silent: true});
            }
            else if (obj.oldValue === undefined && this.get("loadingParts") === 1) {
                this.dispatchEvent("wmsloadstart");
            }
        });
    },

    registerTileWMSLoadEvents: function () {
        this.get("layerSource").on("tileloadend", function () {
            this.set("loadingParts", this.get("loadingParts") - 1);
        });

        this.get("layerSource").on("tileloadstart", function () {
            const startval = this.get("loadingParts") ? this.get("loadingParts") : 0;

            this.set("loadingParts", startval + 1);
        });

        this.get("layerSource").on("change:loadingParts", function (obj) {
            if (obj.oldValue > 0 && this.get("loadingParts") === 0) {
                this.dispatchEvent("wmsloadend");
                this.unset("loadingParts", {silent: true});
            }
            else if (obj.oldValue === undefined && this.get("loadingParts") === 1) {
                this.dispatchEvent("wmsloadstart");
            }
        });
    },

    /**
     * Register LayerLoad-Events
     * @returns {void}
     */
    registerErrorListener: function () {
        if (this.get("layerSource") instanceof TileWMS) {
            this.registerTileloadError();
        }
        else if (this.get("layerSource") instanceof ImageWMS) {
            this.registerImageloadError();
        }
    },
    updateSupported: function () {
        if (this.getSingleTile()) {
            this.set("supported", ["2D"]);
        }
        else {
            this.set("supported", ["2D", "3D"]);
        }
    },
    getExtent: function () {
        if (this.has("extent")) {
            return this.get("extent");
        }
        return Radio.request("MapView", "getExtent");
    },

    updateSourceSLDBody: function () {
        this.get("layer").getSource().updateParams({SLD_BODY: this.get("SLDBody"), STYLES: this.get("paramStyle")});
    },

    /**
     * Lädt den WMS neu, indem ein Parameter verändert wird.
     * @returns {void}
     */
    updateSource: function () {
        this.newCacheId();

        this.get("layer").getSource().updateParams({CACHEID: this.get("cacheId")});
    },

    setInfoFormat: function (value) {
        this.set("infoFormat", value);
    },

    /**
     * [getLayers description]
     * @return {Object[]} [description]
     */
    getLayers: function () {
        return this.get("layers");
    },

    /**
     * Gets the gfi url from the layers source.
     * @returns {String} - The created getFeature info url.
     */
    getGfiUrl: function () {
        const resolution = Radio.request("MapView", "getOptions").resolution,
            projection = Radio.request("MapView", "getProjection"),
            coordinate = Radio.request("GFI", "getCoordinate");

        return this.get("layerSource").getFeatureInfoUrl(coordinate, resolution, projection, {INFO_FORMAT: this.get("infoFormat"), FEATURE_COUNT: this.get("featureCount"), STYLES: "", SLD_BODY: undefined});
    },

    /*
    * random setter for cacheId
    * @returns {void}
    */
    newCacheId: function () {
        this.set("cacheId", parseInt(Math.random() * 10000000, 10));
    }
});

export default WMSLayer;
