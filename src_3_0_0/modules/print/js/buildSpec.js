import Feature from "ol/Feature.js";
import {GeoJSON} from "ol/format.js";
import {Group, Image, Tile, Vector} from "ol/layer.js";
import {MVTEncoder} from "@geoblocks/print";
import {Point} from "ol/geom.js";
import VectorTileLayer from "ol/layer/VectorTile";

import differenceJS from "../../../shared/js/utils/differenceJS";
import findWhereJs from "../../../shared/js/utils/findWhereJs";
import {getLastPrintedExtent} from "../store/actionsPrintInitialization";
import sortBy from "../../../shared/js/utils/sortBy";
import store from "../../../app-store";

const BuildSpecModel = {
    defaults: {
        uniqueIdList: [],
        visibleLayerIds: null,
        layout: null,
        attributes: {
            map: null,
            title: "",
            showLegend: false,
            legend: "",
            showGfi: false,
            gfi: null,
            scale: null
        }
    },

    /**
     * Fetches the metadata object and checks if object is from own request.
     * If so it removes the unique id from the unique id list.
     * @param {Object} cswObj Object from csw parser.
     * @returns {void}
     */
    fetchedMetaData: function (cswObj) {
        if (this.isOwnMetaRequest(this.defaults.uniqueIdList, cswObj.uniqueId)) {
            this.removeUniqueIdFromList(this.defaults.uniqueIdList, cswObj.uniqueId);
            this.updateMetaData(cswObj.layerName, cswObj.parsedData);
            if (this.defaults.uniqueIdList.length === 0) {
                const printJob = {
                    index: cswObj.index,
                    payload: encodeURIComponent(JSON.stringify(this.defaults)),
                    getResponse: cswObj.getResponse
                };

                store.dispatch("Modules/Print/createPrintJob", printJob);
            }
        }
    },

    setAttributes: function (attr) {
        this.defaults.attributes = attr.attributes;
        this.defaults.layout = attr.layout;
        this.defaults.outputFilename = attr.outputFilename;
        this.defaults.outputFormat = attr.outputFormat;
    },

    /**
     * Checks if csw request belongs to this model.
     * @param {String[]} uniqueIdList List of all metaRequest-ids belonging to this model.
     * @param {String} uniqId Response unique-id from Cswparser.
     * @returns {Boolean} - Flag if csw response is from own metaRequest.
     */
    isOwnMetaRequest: function (uniqueIdList, uniqId) {
        return Array.isArray(uniqueIdList) && uniqueIdList.indexOf(uniqId) !== -1;
    },

    /**
     * Removes the uniqueId from the uniqueIdList, because the request returned something.
     * @param {String[]} uniqueIdList List of all metaRequest-ids belonging to this model.
     * @param {String} uniqId Response unique-id from Cswparser.
     * @returns {void}
     */
    removeUniqueIdFromList: function (uniqueIdList, uniqId) {
        this.setUniqueIdList(differenceJS(uniqueIdList, [uniqId]));
    },

    /**
     * Updates the metadata from the metadata response.
     * @param {String} layerName name of layer.
     * @param {Object} parsedData parsedCswData.
     * @returns {void}
     */
    updateMetaData: function (layerName, parsedData) {
        const layers = this.defaults.attributes.legend && this.defaults.attributes.legend.layers ? this.defaults.attributes.legend.layers : undefined,
            layer = findWhereJs(layers, {layerName: layerName});

        if (layer !== undefined) {
            layer.metaDate = parsedData?.date ? parsedData.date : "n.N.";
            layer.metaOwner = parsedData?.orgaOwner ? parsedData.orgaOwner : "n.N.";
            layer.metaAddress = parsedData?.address ? this.parseAddressToString(parsedData.address) : "n.N.";
            layer.metaEmail = parsedData?.email ? parsedData.email : "n.N.";
            layer.metaTel = parsedData?.tel ? parsedData.tel : "n.N.";
            layer.metaUrl = parsedData?.url ? parsedData.url : "n.N.";
        }
    },

    /**
     * Parses the address object to a string.
     * @param {Object} addressObj Address Object
     * @param {String} addressObj.street Street name.
     * @param {String} addressObj.housenr House number.
     * @param {String} addressObj.postalCode Postal Code.
     * @param {String} addressObj.city City.
     * @returns {String} - The parsed String.
     */
    parseAddressToString: function (addressObj) {
        let street,
            streetFilled = false,
            housenr,
            postalCode,
            postalCodeFilled = false,
            city,
            addressString = "";

        if (typeof addressObj === "object") {
            street = addressObj.street;
            streetFilled = this.isFilled(street);
            housenr = addressObj.housenr;
            postalCode = addressObj.postalCode;
            postalCodeFilled = this.isFilled(postalCode);
            city = addressObj.city;
        }
        if (streetFilled) {
            addressString += street;
        }
        if (this.isFilled(housenr)) {
            if (streetFilled) {
                addressString += " ";
            }
            addressString += housenr;
        }
        if (addressString !== "") {
            // newline between housenr and postalCode
            addressString += "\n ";
        }
        if (postalCodeFilled) {
            addressString += postalCode;
        }
        if (this.isFilled(city)) {
            if (postalCodeFilled) {
                addressString += " ";
            }
            addressString += city;
        }
        if (addressString.trim() === "") {
            // n.N. if addressString is empty
            addressString += "n.N.";
        }
        return addressString;
    },

    /**
     * Returns true, if the given string is not empty or undefined
     * @param {string} string to check
     * @returns {boolean} true, if string has content
     */
    isFilled: function (string) {
        return string !== undefined && string.trim() !== "";
    },


    /**
     * Defines the layers attribute of the map spec
     * @param {ol.layer.Layer[]} layerList All visible layers on the map.
     * @param {Number} [dpi] The dpi to use instead of the dpi from store.
     * @returns {void}
     */
    buildLayers: async function (layerList, dpi) {
        const layers = [],
            attributes = this.defaults.attributes,
            currentResolution = store.getters["Maps/resolution"],
            visibleLayerIds = [];

        if (Array.isArray(layerList)) {
            for (const layer of layerList) {
                const printLayers = [];

                if (layer instanceof Group) {
                    for (const childLayer of layer.getLayers().getArray()) {
                        printLayers.push(await this.buildLayerType(childLayer, currentResolution, dpi));
                        visibleLayerIds.push(childLayer.get("id"));
                    }
                }
                else {
                    printLayers.push(await this.buildLayerType(layer, currentResolution, dpi));
                }
                printLayers.forEach(printLayer => {
                    if (typeof printLayer !== "undefined") {
                        if (layer?.get("id") !== undefined) {
                            visibleLayerIds.push(layer?.get("id"));
                        }
                        layers.push(printLayer);
                    }

                });
            }
        }
        this.setVisibleLayerIds(visibleLayerIds);
        if (store.state.Modules.Print.printService === "plotservice") {
            attributes.map.layers = layers;
        }
        else {
            attributes.map.layers = layers.reverse();
        }
    },

    /**
     * Sorts the features of the draw layer by z-index and returns the vector object for mapfish-print-3
     * @param {ol.layer}  layer   ol.Layer with features.
     * @param {ol.extent} extent  Extent uses to filter the feature by extent.
     * @returns {Object|undefined} - VectorObject for mapfish print.
     */
    getDrawLayerInfo: function (layer, extent) {
        const featuresInExtent = layer.getSource().getFeaturesInExtent(extent),
            features = sortBy(featuresInExtent, function (feature) {
                if (feature.getStyle() && typeof feature.getStyle === "function" && typeof feature.getStyle().getZIndex === "function") {
                    return feature.getStyle().getZIndex();
                }
                return 0;
            }),
            visibleFeatures = features.filter(feature => feature.get("isVisible"));

        if (visibleFeatures.length > 0) {
            return this.buildVector(layer, visibleFeatures, extent);
        }

        return undefined;
    },

    /**
     * Returns information about the layer depending on the layer type.
     *
     * @param  {ol.layer} layer ol.Layer with features
     * @param {Number} currentResolution Current map resolution
     * @param {Number} [dpi] The dpi to use instead of the dpi from store.
     * @param {Boolean} [scaleDoesNotMatter=false] - The layer should be build even if it is not visible in the current resolution.
     * @returns {Object} - LayerObject for MapFish print.
     */
    buildLayerType: async function (layer, currentResolution, dpi, scaleDoesNotMatter = false) {
        const extent = store.getters["Maps/extent"],
            layerMinRes = typeof layer?.get === "function" ? layer.get("minResolution") : false,
            layerMaxRes = typeof layer?.get === "function" ? layer.get("maxResolution") : false,
            isInScaleRange = this.isInScaleRange(layerMinRes, layerMaxRes, currentResolution);
        let features = [],
            returnLayer;

            if (isInScaleRange || scaleDoesNotMatter) {
            const source = layer.getSource();

            if (layer instanceof VectorTileLayer) {
                const maskExtent = getLastPrintedExtent();

                returnLayer = await this.buildVectorTile(layer, currentResolution, maskExtent);
            }
            else if (layer instanceof Image) {
                returnLayer = this.buildImageWms(layer, dpi);
            }
            else if (layer instanceof Tile) {
                // The source of a TileWMS has a params object while the source of a WMTS has a layer object
                if (source?.getParams) {
                    returnLayer = this.buildTileWms(layer, dpi);
                }
                else if (source?.getLayer) {
                    returnLayer = this.buildWmts(layer, source);
                }
            }
            else if (typeof layer?.get === "function" && layer.get("name") === "importDrawLayer") {
                returnLayer = this.getDrawLayerInfo(layer, extent);
            }
            else if (layer instanceof Vector) {
                features = source.getFeaturesInExtent(extent);

                if (features.length > 0) {
                    returnLayer = this.buildVector(layer, features, extent);
                }
            }
        }

        return returnLayer;
    },

    /**
     * Checks if layer is in the visible resolution range.
     * @param {Number} layerMinRes Maximum resolution of layer.
     * @param {Number} layerMaxRes Minimum resolution of layer.
     * @param {Number} currentResolution Current map resolution.
     * @returns {Boolean} - Flag if layer is in visible resolution.
     */
    isInScaleRange: function (layerMinRes, layerMaxRes, currentResolution) {
        let isInScale = false;

        if (layerMinRes <= currentResolution && layerMaxRes >= currentResolution) {
            isInScale = true;
        }

        return isInScale;
    },

    /**
     * Builds the information needed for MapFish to print the given WMTS Layer.
     *
     * @param {ol.layer.Tile} layer The WMTS Layer.
     * @param {ol.source.WMTS} source The source of the WMTS Layer.
     * @returns {Object} Information about the WMTS Layer.
     */
    buildWmts: (layer, source) => {
        const matrices = [],
            tileGrid = source.getTileGrid(),
            matrixIds = tileGrid.getMatrixIds(),
            {origin_, origins_, tileSize_, tileSizes_} = tileGrid;
        let baseURL = source.getUrls()[0];

        for (let i = 0; i < matrixIds.length; i++) {
            // The parameters "matrixSizes" and "scales" are not standard for a WMTS source and are added in the process of parsing the information of the layer
            matrices.push({
                identifier: matrixIds[i],
                matrixSize: source.matrixSizes[i],
                topLeftCorner: origin_ ? origin_ : origins_[i],
                scaleDenominator: source.scales[i],
                tileSize: tileSize_ ? [tileSize_, tileSize_] : [tileSizes_[i], tileSizes_[i]]
            });
        }

        if (baseURL.includes("{Style}")) {
            // As described in the MapFish Documentation (https://mapfish.github.io/mapfish-print-doc/javadoc/org/mapfish/print/map/tiled/wmts/WMTSLayerParam.html#baseURL) the parameter "style" seemingly needs to be written small.
            baseURL = baseURL.replace(/{Style}/g, "{style}");
        }

        return {
            baseURL,
            opacity: layer.getOpacity(),
            type: "WMTS",
            layer: source.getLayer(),
            style: source.getStyle(),
            imageFormat: source.getFormat(),
            matrixSet: source.getMatrixSet(),
            matrices,
            requestEncoding: source.getRequestEncoding()
        };
    },

    /**
     * returns vector tile layer information
     * @param {ol.layer.VectorTile} layer vector tile layer with vector tile source
     * @param {number} resolution print resolution
     * @param {ol.Extent} extent printed extent
     * @returns {Object} - static image layer spec
     */
    buildVectorTile: async function (layer, resolution, extent) {
        MVTEncoder.useImmediateAPI = false;
        const mapInfo = store.state.Modules.Print.layoutMapInfo,
            targetDPI = store.state.Modules.Print.dpiForPdf,
            factor = targetDPI / 72,
            targetWidth = mapInfo[0] * factor,
            targetHeight = mapInfo[1] * factor,
            encoder = new MVTEncoder(),
            r = await encoder.encodeMVTLayer({
                layer,
                tileResolution: resolution,
                printResolution: resolution,
                printExtent: extent,
                canvasSize: [targetWidth, targetHeight]
            }),
            {extent: tileExtent, baseURL: tileBaseURL} = r[0];

        if (r.length !== 1) {
            throw new Error("handle several results");
        }

        if (r[0].baseURL.length <= 6) {
            return null;
        }

        return {
            extent: tileExtent,
            baseURL: tileBaseURL,
            type: "image",
            name: layer.get("name"),
            opacity: 1,
            imageFormat: "image/png"
        };
    },
    /**
     * returns tile wms layer information
     * @param {ol.layer.Tile} layer tile layer with tile wms source
     * @param {Number} [dpi] The dpi to use instead of the dpi from store.
     * @returns {Object} - wms layer spec
     */
    buildTileWms: function (layer, dpi) {
        const source = layer.getSource(),
            mapObject = {
                baseURL: source.getUrls()[0],
                opacity: layer.getOpacity(),
                type: source.getParams().SINGLETILE ? "WMS" : "tiledwms",
                layers: source.getParams().LAYERS.split(","),
                styles: source.getParams().STYLES ? source.getParams().STYLES.split(",") : undefined,
                imageFormat: source.getParams().FORMAT,
                customParams: {
                    "TRANSPARENT": source.getParams().TRANSPARENT,
                    "DPI": typeof dpi === "number" ? dpi : store.state.Modules.Print.dpiForPdf
                }
            };

        if (!source.getParams().SINGLETILE) {
            mapObject.tileSize = [source.getParams().WIDTH, source.getParams().HEIGHT];
        }
        if (Object.prototype.hasOwnProperty.call(source.getParams(), "SLD_BODY") && source.getParams().SLD_BODY !== undefined) {
            mapObject.customParams.SLD_BODY = source.getParams().SLD_BODY;
            mapObject.styles = ["style"];
        }
        return mapObject;
    },

    /**
     * Returns image wms layer information
     * @param {ol.layer.Image} layer - image layer with image wms source
     * @param {Number} [dpi] The dpi to use instead of the dpi from store.
     * @returns {Object} - wms layer spec
     */
    buildImageWms: function (layer, dpi) {
        const source = layer.getSource(),
            mapObject = {
                baseURL: source.getUrl(),
                opacity: layer.getOpacity(),
                type: "WMS",
                layers: source.getParams().LAYERS.split(","),
                styles: source.getParams().STYLES ? source.getParams().STYLES.split(",") : undefined,
                imageFormat: source.getParams().FORMAT,
                customParams: {
                    "TRANSPARENT": source.getParams().TRANSPARENT,
                    "DPI": typeof dpi === "number" ? dpi : store.state.Modules.Print.dpiForPdf
                }
            };

        return mapObject;
    },

    /**
     * returns vector layer information
     * @returns {object} - geojson layer spec
     */
    buildVector: function () {
        const geojsonList = [];

        return {
            type: "geojson",
            geojson: geojsonList
        };
    },

    /**
     * gets array with [GfiContent, layername, coordinates] of actual gfi
     * empty array if gfi is not active.
     * coordinates not needed, yet.
     * @param {boolean} isGfiSelected flag if gfi has to be printed
     * @param  {Array} gfiArray array
     * @return {void}
     */
    buildGfi: function (isGfiSelected, gfiArray) {
        const gfiObject = {};
        let gfiAttributes,
            layerName;

        if (isGfiSelected) {
            if (gfiArray.length > 0) {
                gfiObject.layers = [];
                gfiAttributes = gfiArray[0];
                layerName = gfiArray[1];

                gfiObject.layers.push({
                    layerName: layerName,
                    values: this.prepareGfiAttributes(gfiAttributes)
                });

            }
            this.addGfiFeature(this.defaults.attributes.map.layers, gfiArray[2]);
        }
        this.setShowGfi(isGfiSelected);
        this.setGfi(gfiObject);
    },

    /**
     * @param {Object[]} layers - layers attribute of the map spec
     * @param {number[]} coordinates - the coordinates of the gfi
     * @returns {void}
     */
    addGfiFeature: function (layers, coordinates) {
        const geojsonFormat = new GeoJSON(),
            gfiFeature = new Feature({
                geometry: new Point(coordinates),
                name: "GFI Point"
            });

        layers.splice(0, 0, {
            type: "geojson",
            geojson: [geojsonFormat.writeFeatureObject(gfiFeature)],
            style: {
                version: "2",
                "[name='GFI Point']": {
                    symbolizers: [{
                        fillOpacity: 0,
                        pointRadius: 18,
                        strokeColor: "#e10019",
                        strokeWidth: 3,
                        type: "point"
                    },
                    {
                        fillColor: "#e10019",
                        pointRadius: 4,
                        strokeOpacity: 0,
                        type: "point"
                    }]
                }
            }
        });
    },

    /**
     * parses gfiAttributes object with key value pairs into array[objects] with attributes key and value
     * @param  {Object} gfiAttributes gfi Mapping attributes
     * @return {Object[]} parsed array[objects] with key- and value attributes
     */
    prepareGfiAttributes: function (gfiAttributes) {
        const valuesArray = [];
        let key;

        for (key in gfiAttributes) {
            valuesArray.push({
                key: key,
                value: gfiAttributes[key]
            });
        }

        return valuesArray;
    },

    /**
     * Creates the scale string.
     * @param {String} scale Scale of map.
     * @returns {void}
     */
    buildScale: function (scale) {
        const scaleText = "1:" + scale;

        this.setScale(scaleText);
    },

    /**
     * Setter for Metadata
     * @param {String} value Value
     * @returns {void}
     */
    setMetadata: function (value) {
        this.defaults.attributes.metadata = value;
    },

    /**
     * Setter for showLegend
     * @param {Boolean} value Value
     * @returns {void}
     */
    setShowLegend: function (value) {
        this.defaults.attributes.showLegend = value;
    },

    /**
     * Setter for Legend
     * @param {String} value Value
     * @returns {void}
     */
    setLegend: function (value) {
        this.defaults.attributes.legend = value;
    },

    /**
     * Setter for showGfi
     * @param {Boolean} value Value
     * @returns {void}
     */
    setShowGfi: function (value) {
        this.defaults.attributes.showGfi = value;
    },

    /**
     * Setter for gfi
     * @param {String} value Value
     * @returns {void}
     */
    setGfi: function (value) {
        this.defaults.attributes.gfi = value;
    },

    /**
     * Setter for scale
     * @param {String} value Value
     * @returns {void}
     */
    setScale: function (value) {
        this.defaults.attributes.scale = value;
    },

    /**
     * Setter for uniqueIdList
     * @param {String} value Value
     * @returns {void}
     */
    setUniqueIdList: function (value) {
        this.defaults.uniqueIdList = value;
    },

    /**
     * Setter for visibleLayerIds
     * @param {String} value visibleLayerIds
     * @returns {void}
     */
    setVisibleLayerIds: function (value) {
        this.defaults.visibleLayerIds = value;
    }
};

export default BuildSpecModel;
