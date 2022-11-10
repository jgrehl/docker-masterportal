import {fromCircle} from "ol/geom/Polygon.js";
import CircleStyle from "ol/style/Circle";
import Icon from "ol/style/Icon";
import Feature from "ol/Feature.js";
import {GeoJSON} from "ol/format.js";
import store from "../../../../app-store/index";
import isObject from "../../../../utils/isObject";
import uniqueId from "../../../../utils/uniqueId";
import Geometry from "ol/geom/Geometry";
import {convertColor} from "../../../../utils/convertColor";
import styleList from "@masterportal/masterportalapi/src/vectorStyle/styleList";
import createStyle from "@masterportal/masterportalapi/src/vectorStyle/createStyle";
import {getRulesForFeature} from "@masterportal/masterportalapi/src/vectorStyle/lib/getRuleForIndex";
import StaticImageSource from "ol/source/ImageStatic.js";


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
     * returns vector layer information
     * @param {ol.layer.Vector} layer vector layer with vector source
     * @param {ol.feature[]} features vectorfeatures
     * @param {ol.extent} extent  Extent uses to filter the feature by extent.
     * @returns {object} - geojson layer spec
     */
    buildVector: function (layer, features, extent) {
        const geojsonList = [];

        return {
            //     type: "geojson",
            style: this.buildStyle(layer, features, geojsonList, extent)
            // geojson: geojsonList
        };
    },

    /**
     * Generates the style for mapfish print.
     * @param {ol.layer} layer ol-Layer with features.
     * @param {ol.feature[]} features Array of features.
     * @param {Object[]} geojsonList Array of geojsons.
     * @param {ol.extent} extent  Extent uses to filter the feature by extent.
     * @returns {Object} - style for mapfish print.
     */
    buildStyle: function (layer, features, geojsonList, extent) {
        const mapfishStyleObject = {
                "version": "2"
            },
            layersToNotReverse = ["measureLayer", "importDrawLayer"],
            featuresInExtent = layer.getSource() ? layer.getSource().getFeaturesInExtent(extent) : features;

        if (!layersToNotReverse.includes(layer.values_.id)) {
            features.reverse();
        }
        features.forEach(feature => {
        // features.slice(0, 20).forEach(feature => {
            const foundFeature = featuresInExtent.find(featureInExtent => featureInExtent.ol_uid === feature.ol_uid),
                styles = this.getFeatureStyle(feature, layer),
                styleAttributes = this.getStyleAttributes(layer, feature);

            if (!foundFeature) {
                return;
            }

            let clonedFeature,
                stylingRules,
                stylingRulesSplit,
                styleObject,
                geometryType,
                styleGeometryFunction;

            styles.forEach((style, index) => {

                if (style !== null) {
                    const styleObjectFromStyleList = styleList.returnStyleObject(layer.get("styleId")),
                        styleFromStyleList = styleObjectFromStyleList ? createStyle.getGeometryStyle(feature, styleObjectFromStyleList.rules, false, Config.wfsImgPath) : undefined;
                    let limiter = ",";

                    clonedFeature = feature.clone();
                    styleAttributes.forEach(attribute => {
                        const singleFeature = clonedFeature.get("features") ? clonedFeature.get("features")[0] : clonedFeature;

                        if (attribute.includes("Datastreams")) {
                            clonedFeature.set(attribute, attribute === "default" && !singleFeature.get(attribute) ? "style" : `${singleFeature.getProperties().Datastreams[0].Observations[0].result}_${index}`);
                        }
                        else if (style.type && style.type === "CIRCLESEGMENTS") {
                            clonedFeature.setId(`${feature.ol_uid}__${index}`);
                            clonedFeature.set(attribute, `${style.type}_${style.scalingAttribute.replace(" | ", "_")}_${index}`);
                        }
                        else if (style.type && style.type === "imageStyle") {
                            clonedFeature.setId(`${feature.ol_uid}__${index}`);
                            clonedFeature.set(attribute, `${style.type}_${index}`);
                        }
                        else {
                            clonedFeature.set(attribute, attribute === "default" && !singleFeature.get(attribute) ? "style" : `${singleFeature.get(attribute)}_${index}`);
                        }
                        clonedFeature.ol_uid = feature.ol_uid;
                    });
                    geometryType = feature.getGeometry().getType();

                    // if an icon is shown, apply style offsets to geometry
                    if (geometryType === "Point" && style.getImage() instanceof Icon && style.getImage().getScale() > 0) {
                        const coords = clonedFeature.getGeometry().getCoordinates(),
                            offsetStyle = styleObjectFromStyleList.rules?.find(({style: {imageOffsetX, imageOffsetY}}) => imageOffsetX || imageOffsetY)?.style,
                            [posX, posY] = mapCollection.getMap("2D").getPixelFromCoordinate(coords),
                            [offsetX, offsetY] = [offsetStyle.imageOffsetX ?? 0, offsetStyle.imageOffsetY ?? 0],
                            mapScaleFactor = store.state.Tools.Print.currentScale / store.state.Tools.Print.currentMapScale,
                            transformedCoords = mapCollection.getMap("2D").getCoordinateFromPixel([posX - offsetX * mapScaleFactor, posY - offsetY * mapScaleFactor, 0]);

                        clonedFeature.getGeometry().setCoordinates(transformedCoords);
                    }

                    // if style has geometryFunction, take geometry from style Function
                    styleGeometryFunction = style.getGeometryFunction();
                    if (styleGeometryFunction !== null && styleGeometryFunction !== undefined) {
                        clonedFeature.setGeometry(styleGeometryFunction(clonedFeature));
                        geometryType = styleGeometryFunction(clonedFeature).getType();
                        if (geometryType === "Polygon") {
                            this.checkPolygon(clonedFeature);
                        }
                    }
                    stylingRules = this.getStylingRules(layer, clonedFeature, styleAttributes, style);
                    if (styleFromStyleList?.attributes?.labelField?.length > 0) {
                        stylingRules = stylingRules.replaceAll(limiter, " AND ");
                        limiter = " AND ";
                    }
                    stylingRulesSplit = stylingRules
                        .replaceAll("[", "")
                        .replaceAll("]", "")
                        .replaceAll("*", "")
                        .split(limiter)
                        .map(rule => rule.split("="));

                    if (Array.isArray(stylingRulesSplit) && stylingRulesSplit.length) {
                        this.unsetStringPropertiesOfFeature(clonedFeature,
                            stylingRulesSplit.reduce((accumulator, current) => Array.isArray(current) && current.length
                                ? [...accumulator, current[0]]
                                : accumulator,
                            [])
                        );
                    }
                    this.addFeatureToGeoJsonList(clonedFeature, geojsonList, style);

                    // do nothing if we already have a style object for this CQL rule
                    if (Object.prototype.hasOwnProperty.call(mapfishStyleObject, stylingRules)) {
                        return;
                    }

                    styleObject = {
                        symbolizers: []
                    };
                    if (geometryType === "Point" || geometryType === "MultiPoint") {
                        if (style.getImage() !== null || style.getText() !== null) {
                            styleObject.symbolizers.push(this.buildPointStyle(style, layer));
                        }
                    }
                    else if (geometryType === "Polygon" || geometryType === "MultiPolygon") {
                        styleObject.symbolizers.push(this.buildPolygonStyle(style, layer));
                    }
                    else if (geometryType === "Circle") {
                        styleObject.symbolizers.push(this.buildPolygonStyle(style, layer));
                    }
                    else if (geometryType === "LineString" || geometryType === "MultiLineString") {
                        if (layer.values_.id === "measureLayer" && style.stroke_ === null) {
                            return;
                        }
                        styleObject.symbolizers.push(this.buildLineStringStyle(style, layer));
                    }
                    // label styling
                    if (style.getText() !== null && style.getText() !== undefined) {
                        styleObject.symbolizers.push(this.buildTextStyle(style.getText()));
                    }

                    if (stylingRules.includes("@Datastreams")) {
                        const newKey = stylingRules.replaceAll("@", "").replaceAll(".", "");

                        stylingRules = newKey;
                    }
                    mapfishStyleObject[stylingRules] = styleObject;
                }
            });
        });
        return mapfishStyleObject;
    },

    /**
     * The geometry of the feature is checked for not closed linearRing. Used for type Polygon.
     * If it is not closed, the coordinates are adapted.
     * @param {ol.Feature} feature to inspect
     * @returns {ol.Feature} corrected feature, if necessary
     */
    checkPolygon (feature) {
        if (Array.isArray(feature.getGeometry().getCoordinates()[0])) {
            const coordinates = feature.getGeometry().getCoordinates()[0];

            if (coordinates[0][0] !== coordinates[coordinates.length - 1][0] && coordinates[0][1] !== coordinates[coordinates.length - 1][1]) {
                const coords = [];

                coordinates.forEach(coord => {
                    coords.push(coord);
                });
                feature.getGeometry().setCoordinates(coords);
            }

        }
        return feature;
    },

    /**
     * Gets the style object for the given layer.
     * @param {ol/layer} layer The layer.
     * @param {String} layerId The layer id.
     * @returns {Object} The style object.
     */
    getStyleObject (layer, layerId) {
        const layerModel = Radio.request("ModelList", "getModelByAttributes", {id: layer?.get("id")});
        let foundChild;

        if (typeof layerModel?.get === "function") {
            if (layerModel.get("typ") === "GROUP") {
                foundChild = layerModel.get("children").find(child => child.id === layerId);
                if (foundChild) {
                    return styleList.returnStyleObject(foundChild.styleId);
                }
            }
            else {
                return styleList.returnStyleObject(layerModel.get("styleId"));
            }
        }
        return undefined;
    },

    /**
     * Unsets all properties of type string of the given feature.
     * @param {ol.Feature} feature to unset properties of type string at
     * @param {string} notToUnset key not to unset
     * @returns {void}
     */
    unsetStringPropertiesOfFeature: function (feature, notToUnset) {
        Object.keys(feature.getProperties()).forEach(key => {
            const prop = feature.getProperties()[key];

            if (!notToUnset.includes(key) && typeof prop === "string") {
                feature.unset(key, {silent: true});
            }
        });
    },

    /**
     * Generates the point Style
     * @param {ol.style} style Style of layer.
     * @param {ol.layer} layer Ol-layer.
     * @returns {Object} - Point Style for mapfish print.
     */
    buildPointStyle: function (style, layer) {
        if (style.getImage() instanceof CircleStyle) {
            return this.buildPointStyleCircle(style.getImage());
        }
        else if (style.getImage() instanceof Icon && style.getImage().getScale() > 0) {
            return this.buildPointStyleIcon(style.getImage(), layer);
        }
        return this.buildTextStyle(style.getText());
    },

    /**
     * Generates the point Style for circle style
     * @param {ol.style} style Style of layer.
     * @returns {Object} - Circle Style for mapfish print.
     */
    buildPointStyleCircle: function (style) {
        const fillStyle = style.getFill(),
            strokeStyle = style.getStroke(),
            obj = {
                type: "point",
                pointRadius: style.getRadius()
            };

        if (fillStyle !== null) {
            this.buildFillStyle(fillStyle, obj);
            this.buildStrokeStyle(fillStyle, obj);
        }
        if (strokeStyle !== null) {
            this.buildStrokeStyle(strokeStyle, obj);
        }
        return obj;
    },

    /**
     * Generates the point Style for icons
     * @param {ol.style} style Style of layer.
     * @param {ol.layer} layer Ol-layer.
     * @returns {Object} - Icon Style for mapfish print.
     */
    buildPointStyleIcon: function (style, layer) {
        return {
            type: "point",
            graphicWidth: style.getSize()[0] ? style.getSize()[0] * style.getScale() : 60,
            graphicHeight: style.getSize()[1] ? style.getSize()[1] * style.getScale() : 60,
            externalGraphic: this.buildGraphicPath(style.getSrc()),
            graphicOpacity: layer.getOpacity()
        };
    },

    /**
     * derives the url of the image from the server the app is running on
     * if the app is running on localhost the images from test.geoportal-hamburg.de are used
     * @param {object} src the image source
     * @return {String} path or url to image directory
     */
    buildGraphicPath: function (src) {
        const origin = window.location.origin;
        let url = Config.wfsImgPath + this.getImageName(src);

        if (src.indexOf("http") === 0 && src.indexOf("localhost") === -1) {
            url = src;
        }
        else if (src.charAt(0) === "/") {
            url = origin + src;
        }
        else if (src.indexOf("../") === 0 || src.indexOf("./") === 0) {
            url = new URL(src, window.location.href).href;
        }
        else if (src.indexOf("data:image/svg+xml;charset=utf-8") === 0) {
            url = src;
        }
        else if (origin.indexOf("localhost") === -1) {
            // backwards-compatibility:
            url = origin + "/lgv-config/img/" + this.getImageName(src);
        }

        return url;
    },

    /**
     * Generates the text Style
     * @param {ol.style} style Style of layer.
     * @see https://openlayers.org/en/latest/apidoc/module-ol_style_Text.html
     * @returns {Object} - Text Style for mapfish print.
     */
    buildTextStyle: function (style) {
        // use openlayers kml default font, if not set
        const font = style.getFont() ? style.getFont() : "bold 16px Helvetica",
            size = this.getFontSize(font),
            isFontSizeInFont = size !== null,
            textScale = style.getScale() ? style.getScale() : 1,
            fontSize = isFontSizeInFont ? size : 10 * textScale,
            fontFamily = isFontSizeInFont ? this.getFontFamily(font, fontSize) : font,
            fontColor = style.getFill().getColor(),
            stroke = style.getStroke() ? style.getStroke() : undefined;

        return {
            type: "text",
            // tell MapFish that each feature has a property "_label" which contains the label-string
            // it is necessary to "add/fill" the "_label"-property when we call convertFeatureToGeoJson()
            // before we add it to the geoJSONList
            label: "[_label]",
            fontColor: convertColor(fontColor, "hex"),
            fontOpacity: fontColor[0] !== "#" ? fontColor[3] : 1,
            labelOutlineColor: stroke ? convertColor(stroke.getColor(), "hex") : undefined,
            labelOutlineWidth: stroke ? stroke.getWidth() : undefined,
            labelXOffset: style.getOffsetX(),
            labelYOffset: -style.getOffsetY(),
            fontSize: fontSize,
            fontFamily: fontFamily,
            labelAlign: this.getLabelAlign(style)
        };
    },

    /**
     * Inspects the given fontDef for family.
     * @param {String} fontDef the defined font
     * @param {String} fontSize the size incuding in the font
     * @returns {String} the font-family or an empty String if not contained
     */
    getFontFamily: function (fontDef, fontSize) {
        const index = fontDef ? fontDef.indexOf(" ", fontDef.indexOf(fontSize)) : -1;

        if (index > -1) {
            return fontDef.substring(index + 1);
        }
        return "";
    },
    /**
     * Inspects the given fontDef for numbers (=size).
     * @param {String} fontDef the defined font
     * @returns {String} the font-size or null if not contained
     */
    getFontSize: function (fontDef) {
        const size = fontDef ? fontDef.match(/\d/g) : null;

        if (Array.isArray(size) && size.length > 0) {
            return size.join("");
        }
        return null;
    },

    /**
     * gets the indicator of how to align the text with respect to the geometry.
     * this property must have 2 characters, the x-align and the y-align.
     * @param {ol.style} style Style of layer.
     * @returns {String} - placement indicator
     */
    getLabelAlign: function (style) {
        const textAlign = style.getTextAlign();

        if (textAlign === "left") {
            // left bottom
            return "lb";
        }
        else if (textAlign === "right") {
            // right bottom
            return "rb";
        }
        else if (textAlign === "center") {
            // center middle
            return "cm";
        }
        // center bottom
        return "cb";
    },

    /**
     * Generates the polygon Style
     * @param {ol.style} style Style of layer.
     * @param {ol.layer} layer Ol-layer.
     * @returns {Object} - Polygon Style for mapfish print.
     */
    buildPolygonStyle: function (style, layer) {
        const fillStyle = style.getFill(),
            strokeStyle = style.getStroke(),
            obj = {
                type: "polygon",
                fillOpacity: layer.getOpacity(),
                strokeOpacity: layer.getOpacity()
            };

        if (fillStyle !== null) {
            this.buildFillStyle(fillStyle, obj);
        }
        if (strokeStyle !== null) {
            this.buildStrokeStyle(strokeStyle, obj);
        }
        return obj;
    },


    /**
     * Generates the LineString Style
     * @param {ol.style} style Style of layer.
     * @param {ol.layer} layer Ol-layer.
     * @returns {Object} - LineString Style for mapfish print.
     */
    buildLineStringStyle: function (style, layer) {
        const strokeStyle = style.getStroke(),
            obj = {
                type: "line",
                strokeOpacity: layer.getOpacity()
            };

        if (strokeStyle !== null) {
            this.buildStrokeStyle(strokeStyle, obj);
        }
        return obj;
    },


    /**
     * Generates the Fill Style
     * @param {ol.style} style Style of layer.
     * @param {Object} obj current style object .
     * @returns {Object} - Fill Style for mapfish print.
     */
    buildFillStyle: function (style, obj) {
        let fillColor = style.getColor();

        if (typeof fillColor === "string") {
            fillColor = this.colorStringToRgbArray(fillColor);
        }
        else if (fillColor instanceof CanvasPattern) {
            fillColor = [0, 0, 0, 0];
        }

        obj.fillColor = convertColor(fillColor, "hex");
        obj.fillOpacity = fillColor[3];

        return obj;
    },

    /**
     * Checks if colorString starts with "rgb" then calls a parsing function.
     * @param {String} colorString rgb or rgba string
     * @returns {Number[] | String} - parsed rgb-string as number array
     */
    colorStringToRgbArray: function (colorString) {
        const parsedString = colorString;
        let parsedArray;

        if (parsedString.match(/^(rgb)/)) {
            parsedArray = this.rgbStringToRgbArray(parsedString);
        }
        return parsedArray;
    },

    /**
     * Parses a given rgb- or rgba-string to an numbers array.
     * @param {String} colorString rgb or rgba string
     * @returns {Number[]} - parsed rgb-string as number array
     */
    rgbStringToRgbArray: function (colorString) {
        const indexOpenBracket = colorString.indexOf("(") + 1,
            indexCloseBracket = colorString.indexOf(")"),
            length = indexCloseBracket - indexOpenBracket,
            valuesString = colorString.substr(indexOpenBracket, length),
            rgbaStringArray = valuesString.split(","),
            rgbaArray = [];

        rgbaStringArray.forEach(function (colorValue) {
            colorValue.trim();
            rgbaArray.push(parseFloat(colorValue));
        });

        return rgbaArray;
    },

    /**
     * Generates the Stroke Style
     * @param {ol.style} style Style of layer.
     * @param {Object} obj Style object for mapfish print.
     * @returns {Object} - LineString Style for mapfish print.
     */
    buildStrokeStyle: function (style, obj) {
        const strokeColor = style.getColor();

        obj.strokeColor = convertColor(strokeColor, "hex");
        if (Array.isArray(strokeColor) && strokeColor[3] !== undefined) {
            obj.strokeOpacity = strokeColor[3];
        }
        if (typeof style.getWidth === "function" && style.getWidth() !== undefined) {
            obj.strokeWidth = style.getWidth();
        }
        if (typeof style.getLineDash === "function" && style.getLineDash()) {
            obj.strokeLinecap = style.getLineCap();
            if (style.getLineDash().length > 1) {
                obj.strokeDashstyle = style.getLineDash().join(" ");
            }
            else {
                obj.strokeDashstyle = style.getLineDash()[0] + " " + style.getLineDash()[0];
            }

            obj.strokeDashOffset = style.getLineDashOffset();
        }

        return obj;
    },

    /**
     * Returns the image name of the src url.
     * @param {String} imageSrc Url of image source
     * @returns {String} - Image name.
     */
    getImageName: function (imageSrc) {
        const start = imageSrc.lastIndexOf("/");

        return imageSrc.indexOf("/") !== -1 ? imageSrc.substr(start + 1) : "/" + imageSrc;
    },

    /**
     * adds the feature to the geojson list
     * @param {ol.Feature} feature - the feature can be clustered
     * @param {GeoJSON[]} geojsonList -
     * @param {ol.style.Style[]} style - the feature-style
     * @returns {void}
     */
    addFeatureToGeoJsonList: function (feature, geojsonList, style) {
        let convertedFeature;

        if (feature.get("features") && feature.get("features").length === 1) {
            feature.get("features").forEach((clusteredFeature) => {
                if (feature.getKeys().find(element => element === "default")) {
                    clusteredFeature.setProperties({"default": feature.get("default")});
                    clusteredFeature.setId(feature.getId());
                }
                convertedFeature = this.convertFeatureToGeoJson(clusteredFeature, style);

                if (convertedFeature) {
                    geojsonList.push(convertedFeature);
                }
            });
        }
        else {
            convertedFeature = this.convertFeatureToGeoJson(feature, style);

            if (convertedFeature) {
                geojsonList.push(convertedFeature);
            }
        }
    },

    /**
     * converts an openlayers feature to a GeoJSON feature object
     * @param {ol.Feature} feature - the feature to convert
     * @param {ol.style.Style[]} style - the feature-style
     * @returns {object} GeoJSON object
     */
    convertFeatureToGeoJson: function (feature, style) {
        const clonedFeature = feature.clone(),
            geojsonFormat = new GeoJSON(),
            labelText = style.getText()?.getText() || "";
        let convertedFeature;

        // remove all object and array properties except geometry. Otherwise mapfish runs into an error
        Object.keys(clonedFeature.getProperties()).forEach(property => {
            if (isObject(clonedFeature.get(property)) && !(clonedFeature.get(property) instanceof Geometry) || Array.isArray(clonedFeature.get(property))) {
                clonedFeature.unset(property);
            }
        });

        // take over id from feature because the feature id is not set in the clone.
        clonedFeature.setId(feature.getId() || feature.ol_uid);
        // set "_label"-Propterty.
        // This is necessary because the *label* of the *text-Style* (buildTextStyle()) now referrs to it.
        clonedFeature.set("_label", labelText);
        // circle is not suppported by geojson
        if (clonedFeature.getGeometry().getType() === "Circle") {
            clonedFeature.setGeometry(fromCircle(clonedFeature.getGeometry(), 100));
        }
        Object.keys(clonedFeature.getProperties()).filter(key => {
            if (key.includes("@Datastreams")) {
                const newKey = key.replaceAll("@", "").replaceAll(".", "");

                clonedFeature.set(newKey, clonedFeature.getProperties()[key]);
                clonedFeature.unset(key, {silent: true});
            }
            return false;
        });
        // Removing "Datastreams" attribute because it might overload the server as happened for some sensors.
        clonedFeature.unset("Datastreams", {silent: true});

        convertedFeature = geojsonFormat.writeFeatureObject(clonedFeature);
        if (clonedFeature.getGeometry().getCoordinates().length === 0) {
            convertedFeature = undefined;
        }
        // if its a cluster remove property features
        if (convertedFeature?.properties && Object.prototype.hasOwnProperty.call(convertedFeature.properties, "features")) {
            delete convertedFeature.properties.features;
        }

        return convertedFeature;
    },

    /**
     * @param {ol.Feature} feature -
     * @param {ol.layer.Vector} layer -
     * @returns {ol.style.Style[]} returns or an array of styles
     */
    getFeatureStyle: function (feature, layer) {
        let styles;

        if (feature.getStyleFunction() !== undefined) {
            try {
                styles = feature.getStyleFunction().call(feature);
            }
            catch (e) {
                styles = feature.getStyleFunction().call(this, feature);
            }
        }
        else {
            styles = layer.getStyleFunction().call(layer, feature);
        }
        return !Array.isArray(styles) ? [styles] : styles;
    },

    /**
     * Returns the rules for styling of a feature
     *
     * @param {ol.Feature} layer -
     * @param {ol.Feature} feature -
     * @param {String[]} styleAttributes The attribute by whose value the feature is styled.
     * @param {ol.style.Style} style style
     * @param {Number} styleIndex The style index.
     * @returns {string} an ECQL Expression
     */
    getStylingRules: function (layer, feature, styleAttributes, style, styleIndex) {
        const styleAttr = feature.get("styleId") ? "styleId" : styleAttributes,
            styleObjectFromStyleList = styleList.returnStyleObject(layer.get("styleId")),
            styleFromStyleList = styleObjectFromStyleList ? createStyle.getGeometryStyle(feature, styleObjectFromStyleList.rules, false, Config.wfsImgPath) : undefined;

        if (styleAttr.length === 1 && styleAttr[0] === "") {
            if (feature.get("features") && feature.get("features").length === 1) {
                const singleFeature = new Feature({
                    properties: feature.get("features")[0].getProperties(),
                    geometry: feature.get("features")[0].getGeometry()
                });

                feature.get("features")[0] = singleFeature;
                if (style.getImage().getSrc().indexOf("data:image/svg+xml;charset=utf-8") === 0) {
                    singleFeature.setId("first_svg_" + singleFeature.ol_uid);
                }
                else {
                    singleFeature.setId("second_png_" + singleFeature.ol_uid);
                }
                singleFeature.set(singleFeature.getId(), String(feature.get("features").length));
                return "[" + singleFeature.getId() + "='" + String(feature.get("features").length) + "']";

            }
            if (feature.get("features") !== undefined) {
                if (style !== undefined && style.getText().getText() !== undefined) {
                    feature.set("sensorClusterStyle", feature.get("features")[0].ol_uid + "_" + String(style.getText().getText()));
                    return "[sensorClusterStyle='" + feature.get("features")[0].ol_uid + "_" + String(style.getText().getText()) + "']";
                }
            }
            if (this.getFeatureStyle(feature, layer).length > 1) {
                if (style.getImage().getSrc().indexOf("data:image/svg+xml;charset=utf-8") === 0) {
                    feature.setId("first_svg_" + feature.ol_uid);
                }
                else {
                    feature.setId("second_png_" + feature.ol_uid);
                }
                Object.keys(feature.getProperties()).forEach(property => {
                    if (property === "") {
                        feature.unset(property);
                    }
                });
                feature.set(feature.getId(), String(styleIndex));
                return "[" + feature.getId() + "='" + String(styleIndex) + "']";
            }
            return "*";
        }
        // cluster feature with geometry style
        if (feature.get("features") !== undefined) {
            if ((style !== undefined && style?.getText()?.getText() !== undefined) || feature.get("features").length > 1) {
                const value = feature.get("features")[0].get(styleAttr[0])
                    + "_"
                    + style !== undefined && style.getText().getText() !== undefined ? style.getText().getText() : "cluster";

                feature.set(styleAttr[0], value);
                return `[${styleAttr[0]}='${value}']`;
            }
            else if (style?.type) {
                const value = feature.get("default");

                return `[${styleAttr[0]}='${value}']`;
            }

            // Current feature is not clustered but a single feature in a clustered layer
            return styleAttr.reduce((acc, curr) => {
                const value = feature.get("features")[0].get(curr) === undefined ? "*" : feature.get("features")[0].get(curr);

                feature.set(curr, value);
                return acc + `${curr}='${value}',`;
            }, "[").slice(0, -1) + "]";
        }
        // feature with geometry style and label style
        if (styleFromStyleList !== undefined && styleFromStyleList.attributes.labelField && styleFromStyleList.attributes.labelField.length > 0) {
            const labelField = styleFromStyleList.attributes.labelField;

            return styleAttr.reduce((acc, curr) => acc + `${curr}='${feature.get(curr)}' AND ${labelField}='${feature.get(labelField)}',`, "[").slice(0, -1)
                + "]";
        }
        // feature with geometry style
        if (styleAttr instanceof Array) {
            return styleAttr.reduce((acc, curr) => acc + `${curr}='${feature.get(curr)}',`, "[").slice(0, -1)
            + "]";
        }

        return "[" + styleAttr + "='" + feature.get(styleAttr) + "']";
    },

    /**
     * @param {ol.Layer} layer -
     * @param {ol.feature} feature - the feature of current layer
     * @returns {String[]} the attributes by whose value the feature is styled
     */
    getStyleAttributes: function (layer, feature) {
        const layerId = layer.get("id"),
            styleObject = this.getStyleObject(layer, layerId);
        let styleFields = ["styleId"],
            layerModel = Radio.request("ModelList", "getModelByAttributes", {id: layer.get("id")});

        if (styleObject !== undefined) {
            layerModel = this.getChildModelIfGroupLayer(layerModel, layerId);

            if (layerModel.get("styleId")) {
                const featureRules = getRulesForFeature(styleObject, feature);

                styleFields = featureRules?.[0]?.conditions ? Object.keys(featureRules[0].conditions.properties) : ["default"];
            }
            else {
                styleFields = [styleObject.get("styleField")];
            }
        }
        return styleFields;
    },

    /**
     * Checks if model is a Group Model.
     * If so, then the child model corresponding to layerId is returned.
     * Otherwise the model is returned
     * @param  {Backbone.Model} model Layer model from ModelList
     * @param  {String} layerId Id of layer model to return
     * @return {Backbone.Model} found layer model
     */
    getChildModelIfGroupLayer: function (model, layerId) {
        let layerModel = model;

        if (layerModel.get("typ") === "GROUP") {
            layerModel = layerModel.get("layerSource").filter(childLayer => {
                return childLayer.get("id") === layerId;
            })[0];
        }
        return layerModel;
    },
    /**
     * Gets legend from legend vue store and builds legend object for mapfish print
     * The legend is only print if the related layer is visible.
     * @param {Boolean} isLegendSelected flag if legend has to be printed
     * @param {Boolean} isMetaDataAvailable flag to print metadata
     * @param {Function} getResponse the function that calls the axios request
     * @param {Number} index The print index.
     * @param {Object} legends the available legends
     * @return {void}
     */
    buildLegend: function (isLegendSelected, isMetaDataAvailable, getResponse, index) {
        const legendObject = {},
            metaDataLayerList = [],
            legends = store.state.Legend.legends;

        if (isLegendSelected && legends.length > 0) {
            legendObject.layers = [];
            legends.forEach(legendObj => {
                if (Radio.request("ModelList", "getModelByAttributes", {id: legendObj.id}).get("children")?.length > 0) {
                    legendObj.id = Radio.request("ModelList", "getModelByAttributes", {id: legendObj.id}).get("children")[0].id;
                }

                if (this.defaults.visibleLayerIds.includes(legendObj.id)) {
                    const legendContainsPdf = this.legendContainsPdf(legendObj.legend);

                    if (isMetaDataAvailable) {
                        metaDataLayerList.push(legendObj.name);
                    }
                    if (legendContainsPdf) {
                        store.dispatch("Alerting/addSingleAlert", {
                            category: i18next.t("common:modules.alerting.categories.info"),
                            content: "<b>The layer \"" + legendObj.name + "\" contains a pre-defined Legend. " +
                            "This legens cannot be added to the print.</b><br>" +
                            "You can download the pre-defined legend from the download menu seperately.",
                            displayClass: "info",
                            kategorie: "alert-info"
                        });
                    }
                    else {
                        legendObject.layers.push({
                            layerName: legendObj.name,
                            values: this.prepareLegendAttributes(legendObj.legend)
                        });
                    }
                }
            });
        }
        this.setShowLegend(isLegendSelected);
        this.setLegend(legendObject);
        if (isMetaDataAvailable && metaDataLayerList.length > 0) {
            metaDataLayerList.forEach((layerName) => {
                this.getMetaData(layerName, getResponse, index);
            });
        }
        else {
            const printJob = {
                index,
                payload: this.defaults,
                getResponse: getResponse
            };

            store.dispatch("Tools/Print/createPrintJob", printJob);
        }
    },

    legendContainsPdf: function (legend) {
        return legend.some(legendPart => {
            let isPdf = false;

            if (typeof legendPart === "object" && !Array.isArray(legendPart.graphic)) {
                isPdf = legendPart.graphic.endsWith(".pdf");
            }
            else if (typeof legendPart === "object" && Array.isArray(legendPart.graphic)) {
                return isPdf;
            }
            else {
                isPdf = legendPart.endsWith(".pdf");
            }
            return isPdf;
        });
    },

    /**
     * Requests the metadata for given layer name
     * @param {String} layerName name of current layer
     * @param {Function} getResponse the function to start axios request
     * @param {Number} index The print index
     * @fires CswParser#RadioTriggerCswParserGetMetaData
     * @returns {void}
     */
    getMetaData: function (layerName, getResponse, index) {
        const layer = Radio.request("ModelList", "getModelByAttributes", {name: layerName}),
            metaId = layer.get("datasets") && layer.get("datasets")[0] ? layer.get("datasets")[0].md_id : null,
            uniqueIdRes = uniqueId(),
            cswObj = {};

        if (metaId !== null) {
            this.defaults.uniqueIdList.push(uniqueIdRes);
            cswObj.layerName = layerName;
            cswObj.metaId = metaId;
            cswObj.keyList = ["date", "orgaOwner", "address", "email", "tel", "url"];
            cswObj.uniqueId = uniqueIdRes;
            cswObj.layer = layer;
            cswObj.getResponse = getResponse;
            cswObj.index = index;

            store.dispatch("Tools/Print/getMetaDataForPrint", cswObj);
        }
    },

    /**
     * Prepares Attributes for legend in mapfish-print template
     * @param {Object} legend Legend of layer.
     * @returns {Object[]} - prepared legend attributes.
     */
    prepareLegendAttributes: function (legend) {
        const valuesArray = [];

        legend.forEach(legendPart => {
            const legendObj = {
                    legendType: "",
                    geometryType: "",
                    imageUrl: "",
                    color: "",
                    label: legendPart.name
                },
                graphic = typeof legendPart === "object" ? legendPart.graphic : legendPart;

            if (Array.isArray(graphic)) {
                graphic.forEach(graphicPart => {
                    if (graphicPart.indexOf("svg") !== -1) {
                        legendObj.svg = decodeURIComponent(graphicPart).split("data:image/svg+xml;charset=utf-8,")[1];
                    }
                    else {
                        legendObj.imageUrl = graphicPart;
                    }
                });
                legendObj.legendType = "svgAndPng";
            }
            else if (graphic.indexOf("<svg") !== -1) {
                legendObj.color = this.getFillColorFromSVG(graphic);
                this.getFillStrokeFromSVG(graphic, legendObj);
                legendObj.legendType = "geometry";
                legendObj.geometryType = this.getGeometryTypeFromSVG(graphic);
            }
            else if (graphic.toUpperCase().includes("GETLEGENDGRAPHIC")) {
                legendObj.legendType = "wmsGetLegendGraphic";
                legendObj.imageUrl = graphic;
            }
            else {
                legendObj.legendType = "wfsImage";
                legendObj.imageUrl = graphic;
            }
            if (typeof legendObj.color !== "undefined") {
                valuesArray.push(legendObj);
            }
        });

        return [].concat(...valuesArray);
    },

    /**
     * Returns geometry type from SVG.
     * @param {String} svgString String of SVG.
     * @returns {String} - The geometry type.
     */
    getGeometryTypeFromSVG: function (svgString) {
        let geometryType = "";

        if (svgString.includes("<circle")) {
            geometryType = "point";
        }
        if (svgString.includes("<polygon")) {
            geometryType = "polygon";
        }

        return geometryType;
    },

    /**
     * Returns Fill color from SVG as hex.
     * @param {String} svgString String of SVG.
     * @returns {String} - Fill color from SVG.
     */
    getFillColorFromSVG: function (svgString) {
        let color = "";

        if (svgString.split(/fill:(.+)/)[1] || svgString.split("fill='")[1]) {
            color = svgString.split(/fill:(.+)/)[1]?.split(/;(.+)/)[0] || svgString.split("fill='")[1]?.split("'")[0];
        }
        if (color.startsWith("rgb(") && (svgString.split(/fill-opacity:(.+)/)[1]?.split(/;(.+)/)[0] || svgString.split("fill-opacity='")[1])) {
            color = `rgba(${color.split(")")[0].split("(")[1]}, ${svgString.split(/fill-opacity:(.+)/)[1]?.split(/;(.+)/)[0] || svgString.split(/fill-opacity=(.+)/)[1]?.split("'")[1]})`;
        }

        return color;
    },

    /**
     * Sest stroke styles to the legenedObj
     * @param {String} svgString String of SVG.
     * @param {Object} legendObj The legend object.
     * @returns {void}
     */
    getFillStrokeFromSVG: function (svgString, legendObj) {
        if (svgString.split(/stroke:(.+)/)[1] || svgString.split("stroke='")[1]) {
            legendObj.strokeColor = svgString.split(/stroke:(.+)/)[1]?.split(/;(.+)/)[0] || svgString.split("stroke='")[1]?.split("'")[0];
        }
        if (legendObj.strokeColor?.startsWith("rgb(") && (svgString.split(/stroke-opacity:(.+)/)[1]?.split(/;(.+)/)[0] || svgString.split("stroke-opacity='")[1]?.split("'")[0])) {
            legendObj.strokeColor = `rgba(${legendObj.strokeColor.split(")")[0].split("(")[1]}, ${svgString.split(/stroke-opacity:(.+)/)[1]?.split(/;(.+)/)[0] || svgString.split(/stroke-opacity=(.+)/)[1]?.split("'")[1]})`;
        }
        if (svgString.split(/stroke-width:(.+)/)[1] || svgString.split("stroke-width='")[1]) {
            legendObj.strokeWidth = svgString.split(/stroke-width:(.+)/)[1]?.split(/;(.+)/)[0] || svgString.split("stroke-width='")[1]?.split("'")[0];
        }
        if (svgString.split(/stroke-dasharray:(.+)/)[1] && !svgString.split(/stroke-dasharray:(.+)/)[1]?.startsWith(";")) {
            legendObj.strokeStyle = "Dashed";
        }
        return undefined;
    }
};

export default BuildSpecModel;
