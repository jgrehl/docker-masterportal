define(function (require) {

    var Config = require("config"),
        ol = require("openlayers"),
        WFSStyle;

        WFSStyle = Backbone.Model.extend({
        defaults: {
            imagePath: "",
            class: "POINT",
            subClass: "SIMPLE",
            styleField: "",
            styleFieldValues: [],
            labelField: "",
            // für subclass SIMPLE
            imageName: "blank.png",
            imageWidth: 1,
            imageHeight: 1,
            imageScale: 1,
            imageOffsetX: 0.5,
            imageOffsetY: 0.5,
            // für subclass CIRCLE
            circleRadius: 10,
            circleFillColor: [0, 153, 255, 1],
            circleStrokeColor: [0, 0, 0, 1],
            circleStrokeWidth: 2,
            // Für Label
            textAlign: "left",
            textFont: "Courier",
            textScale: 1,
            textOffsetX: 0,
            textOffsetY: 0,
            textFillColor: [255, 255, 255, 1],
            textStrokeColor: [0, 0, 0, 1],
            textStrokeWidth: 3,
            // Für Cluster
            clusterClass: "CIRCLE",
            // Für Cluster Class CIRCLE
            clusterCircleRadius: 10,
            clusterCircleFillColor: [0, 153, 255, 1],
            clusterCircleStrokeColor: [0, 0, 0, 1],
            clusterCircleStrokeWidth: 2,
            // Für Cluster Class SIMPLE
            clusterImageName: "blank.png",
            clusterImageWidth: 1,
            clusterImageHeight: 1,
            clusterImageScale: 1,
            clusterImageOffsetX: 0.5,
            clusterImageOffsetY: 0.5,
            // Für Cluster Text
            clusterText: "COUNTER",
            clusterTextAlign: "left",
            clusterTextFont: "Courier",
            clusterTextScale: 1,
            clusterTextOffsetX: 0,
            clusterTextOffsetY: 0,
            clusterTextFillColor: [255, 255, 255, 1],
            clusterTextStrokeColor: [0, 0, 0, 1],
            clusterTextStrokeWidth: 3,
            // Für Polygon
            polygonFillColor: [255, 255, 255, 1],
            polygonStrokeColor: [0, 0, 0, 1],
            polygonStrokeWidth: 2,
            // Für Line
            lineStrokeColor: [0, 0, 0, 1],
            lineStrokeWidth: 2,
            // Für subClass ADVANCED
            // Für scalingShape CIRCLESEGMENTS
            circleSegmentsRadius: 10,
            circleSegmentsStrokeWidth: 4,
            circleSegmentsBackgroundColor: [255, 255, 255, 0],
            scalingValueDefaultColor: [0, 0, 0, 1],
            circleSegmentsGap: 10,
            // Für scalingShape CIRCLE_BAR
            circleBarScalingFactor: 1,
            circleBarRadius: 6,
            circleBarLineStroke: 5,
            circleBarCircleFillColor: [0, 0, 0, 1],
            circleBarCircleStrokeColor: [0, 0, 0, 1],
            circleBarCircleStrokeWidth: 1,
            circleBarLineStrokeColor: [0, 0, 0, 1]
        },
        initialize: function () {
            this.set("imagePath", Radio.request("Util", "getPath", Config.wfsImgPath));
        },

        /*
        * in WFS.js this function ist set as style. for each feature, this function is called.
        * Depending on the attribute "class" the respective style is created.
        * allowed values for "class" are "POINT", "LINE", "POLYGON".
        */
        createStyle: function (feature, isClustered) {
            var style = this.getDefaultStyle(),
                styleClass = this.get("class").toUpperCase(),
                styleSubClass = this.get("subClass").toUpperCase(),
                labelField = this.get("labelField");

            if (_.isUndefined(feature)) {
                return style;
            }
            else if (styleClass === "POINT") {
                style = this.createPointStyle(feature, styleSubClass, isClustered);
            }
            else if (styleClass === "LINE") {
                style = this.createLineStyle(feature, styleSubClass, isClustered);
            }
            else if (styleClass === "POLYGON") {
                style = this.createPolygonStyle(feature, styleSubClass, isClustered);
            }

            // after style is derived, createTextStyle
            if (_.isArray(style)) {
                style[0].setText(this.createTextStyle(feature, labelField, isClustered));
            }
            else {
                style.setText(this.createTextStyle(feature, labelField, isClustered));
            }

            return style;
        },

        /*
        * create openLayers Default Style
        */
        getDefaultStyle: function () {
            var fill = new ol.style.Fill({
                    color: "rgba(255,255,255,0.4)"
                }),
                stroke = new ol.style.Stroke({
                    color: "#3399CC",
                    width: 1.25
                });

            return new ol.style.Style({
                image: new ol.style.Circle({
                    fill: fill,
                    stroke: stroke,
                    radius: 5
                }),
                fill: fill,
                stroke: stroke
            });
        },

        /*
        * creates lineStyle depending on the attribute "subClass".
        * allowed values for "subClass" are "SIMPLE".
        */
        createLineStyle: function (feature, styleSubClass, isClustered) {
            var style = this.getDefaultStyle();

            if (styleSubClass === "SIMPLE") {
                style = this.createSimpleLineStyle(feature, isClustered);
            }
            return style;
        },

        /*
        * creates a simpleLineStyle.
        * all features get the same style.
        */
        createSimpleLineStyle: function (feature, isClustered) {
            var strokecolor = this.returnColor(this.get("lineStrokeColor"), "rgb"),
                strokewidth = parseInt(this.get("lineStrokeWidth"), 10),
                strokestyle = new ol.style.Stroke({
                    color: strokecolor,
                    width: strokewidth
                }),
                style;

                style = style = new ol.style.Style({
                    stroke: strokestyle
                });

            return style;
        },

        /*
        * creates polygonStyle depending on the attribute "subClass".
        * allowed values for "subClass" are "SIMPLE".
        */
        createPolygonStyle: function (feature, styleSubClass, isClustered) {
            var style = this.getDefaultStyle();

            if (styleSubClass === "SIMPLE") {
                style = this.createSimplePolygonStyle(feature, isClustered);
            }

            return style;
        },

        /*
        * creates a simplePolygonStyle.
        * all features get the same style.
        */
        createSimplePolygonStyle: function (feature, isClustered) {
            var strokestyle = new ol.style.Stroke({
                    color: this.returnColor(this.get("polygonStrokeColor"), "rgb"),
                    width: this.returnColor(this.get("polygonStrokeWidth"), "rgb")
                }),
                fill = new ol.style.Fill({
                    color: this.returnColor(this.get("polygonFillColor"), "rgb")
                }),
                style;

            style = new ol.style.Style({
                stroke: strokestyle,
                fill: fill
            });

            return style;
        },

        /*
        * creates pointStyle depending on the attribute "subClass".
        * allowed values for "subClass" are "SIMPLE", "CUSTOM" and "CIRCLE.
        */
        createPointStyle: function (feature, styleSubClass, isClustered) {
            var style = this.getDefaultStyle();

            if (styleSubClass === "SIMPLE") {
                style = this.createSimplePointStyle(feature, isClustered);
            }
            else if (styleSubClass === "CUSTOM") {
                style = this.createCustomPointStyle(feature, isClustered);
            }
            else if (styleSubClass === "CIRCLE") {
                style = this.createCirclePointStyle(feature, isClustered);
            }
            else if (styleSubClass === "ADVANCED") {
                style = this.createAdvancedPointStyle(feature, isClustered);
            }

            return style;
        },

        /*
        * creates clusterStyle depending on the attribute "clusterClass".
        * allowed values for "clusterClass" are "SIMPLE" and "CIRCLE".
        */
        createClusterStyle: function () {
            var clusterClass = this.get("clusterClass"),
                clusterStyle;

            if (clusterClass === "SIMPLE") {
                clusterStyle = this.createSimpleClusterStyle();
            }
            else if (clusterClass === "CIRCLE") {
                clusterStyle = this.createCircleClusterStyle();
            }
            // else if (clusterClass === "ADVANCED") {
            //     clusterStyle = this.createAdvancedClusterStyle();
            // }
            return clusterStyle;
        },

        /*
        * creates simpleClusterStyle.
        * all clustered features get same image.
        */
        createSimpleClusterStyle: function () {
            var src = this.get("imagePath") + this.get("clusterImageName"),
                isSVG = src.indexOf(".svg") > -1 ? true : false,
                width = this.get("clusterImageWidth"),
                height = this.get("clusterImageHeight"),
                scale = parseFloat(this.get("clusterImageScale")),
                offset = [parseFloat(this.get("clusterImageOffsetX")), parseFloat(this.get("clusterImageOffsetY"))],
                clusterStyle = new ol.style.Icon({
                    src: src,
                    width: width,
                    height: height,
                    scale: scale,
                    anchor: offset,
                    imgSize: isSVG ? [width, height] : ""
                });

                return clusterStyle;
        },

        /*
        * creates circleClusterStyle.
        * all clustered features get same circle.
        */
        createCircleClusterStyle: function () {
            var radius = parseInt(this.get("clusterCircleRadius"), 10),
                fillcolor = this.returnColor(this.get("clusterCircleFillColor"), "rgb"),
                strokecolor = this.returnColor(this.get("clusterCircleStrokeColor"), "rgb"),
                strokewidth = parseInt(this.get("clusterCircleStrokeWidth"), 10),
                clusterStyle = new ol.style.Circle({
                    radius: radius,
                    fill: new ol.style.Fill({
                        color: fillcolor
                    }),
                    stroke: new ol.style.Stroke({
                        color: strokecolor,
                        width: strokewidth
                    })
                });

                return clusterStyle;
        },

        // createAdvancedClusterStyle: function () {
        //     var clusterSubClass = this.get("clusterSubClass"),
        //         clusterStyle;

        //     if (clusterSubClass === "NOMINAL") {
        //         clusterStyle = this.createAdvancedNominalClusterStyle();
        //     }
        // },

        // createAdvancedNominalClusterStyle: function () {

        // },

        /*
        * creates simplePointStyle.
        * all features get same image.
        */
        createSimplePointStyle: function (feature, isClustered) {
            var src,
                isSVG,
                width,
                height,
                scale,
                offset,
                imagestyle,
                style;

                if (isClustered && feature.get("features").length > 1) {
                    imagestyle = this.createClusterStyle();
                }
                else {
                    src = this.get("imagePath") + this.get("imageName");
                    isSVG = src.indexOf(".svg") > -1 ? true : false;
                    width = this.get("imageWidth");
                    height = this.get("imageHeight");
                    scale = parseFloat(this.get("imageScale"));
                    offset = [parseFloat(this.get("imageOffsetX")), parseFloat(this.get("imageOffsetY"))];
                    imagestyle = new ol.style.Icon({
                        src: src,
                        width: width,
                        height: height,
                        scale: scale,
                        anchor: offset,
                        imgSize: isSVG ? [width, height] : ""
                    });
                }

                style = new ol.style.Style({
                    image: imagestyle
                });

            return style;

        },

        /*
        * creates customPointStyle.
        * each features gets a different image, depending on their attribute which is stored in "styleField".
        */
        createCustomPointStyle: function (feature, isClustered) {
            var styleField = this.get("styleField"),
                featureValue,
                styleFieldValueObj,
                src,
                isSVG,
                width,
                height,
                scale,
                imageoffsetx,
                imageoffsety,
                offset,
                imagestyle,
                style = this.getDefaultStyle();

                if (isClustered && feature.get("features").length > 1) {
                    imagestyle = this.createClusterStyle();
                }
                else {
                    featureValue = !_.isUndefined(feature.get("features")) ? feature.get("features")[0].get(styleField) : feature.get(styleField);
                    if (!_.isUndefined(featureValue)) {
                        styleFieldValueObj = _.filter(this.get("styleFieldValues"), function (styleFieldValue) {
                            return styleFieldValue.styleFieldValue.toUpperCase() === featureValue.toUpperCase();
                        })[0];
                    }
                    if (_.isUndefined(styleFieldValueObj)) {
                        return style;
                    }
                    src = (!_.isUndefined(styleFieldValueObj) && _.has(styleFieldValueObj, "imageName")) ? this.get("imagePath") + styleFieldValueObj.imageName : this.get("imagePath") + this.get("imageName");
                    isSVG = src.indexOf(".svg") > -1 ? true : false;
                    width = styleFieldValueObj.imageWidth ? styleFieldValueObj.imageWidth : this.get("imageWidth");
                    height = styleFieldValueObj.imageHeight ? styleFieldValueObj.imageHeight : this.get("imageHeight");
                    scale = styleFieldValueObj.imageScale ? styleFieldValueObj.imageScale : parseFloat(this.get("imageScale"));
                    imageoffsetx = styleFieldValueObj.imageOffsetX ? styleFieldValueObj.imageOffsetX : this.get("imageOffsetX");
                    imageoffsety = styleFieldValueObj.imageOffsetY ? styleFieldValueObj.imageOffsetY : this.get("imageOffsetY");
                    offset = [parseFloat(imageoffsetx), parseFloat(imageoffsety)];
                    imagestyle = new ol.style.Icon({
                        src: src,
                        width: width,
                        height: height,
                        scale: scale,
                        anchor: offset,
                        imgSize: isSVG ? [width, height] : ""
                    });
                }

                style = new ol.style.Style({
                    image: imagestyle
                });

            return style;
        },

        /*
        * creates circlePointStyle.
        * all features get same circle.
        */
        createCirclePointStyle: function (feature, isClustered) {
            var radius,
                fillcolor,
                strokecolor,
                strokewidth,
                circleStyle,
                style;

            if (isClustered) {
                circleStyle = this.createClusterStyle();
            }
            else {
                radius = parseInt(this.get("circleRadius"), 10),
                fillcolor = this.returnColor(this.get("circleFillColor"), "rgb"),
                strokecolor = this.returnColor(this.get("circleStrokeColor"), "rgb"),
                strokewidth = parseInt(this.get("circleStrokeWidth"), 10),
                circleStyle = new ol.style.Circle({
                    radius: radius,
                    fill: new ol.style.Fill({
                        color: fillcolor
                    }),
                    stroke: new ol.style.Stroke({
                        color: strokecolor,
                        width: strokewidth
                    })
                });
            }
            style = new ol.style.Style({
                image: circleStyle
            });

            return style;
        },

        /**
         * create advanced style for pointFeatures
         * @param  {ol.Feature} feature
         * @param  {boolean} isClustered
         * @return {ol.Style} style
         */
        createAdvancedPointStyle: function (feature, isClustered) {
            var styleScaling = this.get("scaling").toUpperCase(),
                style;

            if (isClustered && feature.get("features").length > 1) {
                var imagestyle = this.createClusterStyle();

                style = new ol.style.Style({
                    image: imagestyle
                });
            }
            else {

                // parse from array
                if (_.isArray(feature.get("features"))) {
                    feature = feature.get("features")[0];
                }

                // check scaling
                if (styleScaling === "NOMINAL") {
                    style = this.createNominalAdvancedPointStyle(feature);
                }
                else if (styleScaling === "INTERVAL") {
                    style = this.createIntervalAdvancedPointStyle(feature);
                }
            }

            return style;
        },

        /**
         * create nominal scaled advanced style for pointFeatures
         * @param  {ol.Feature} feature
         * @return {ol.Style} style
         */
        createNominalAdvancedPointStyle: function (feature) {
            var styleScalingShape = this.get("scalingShape").toUpperCase(),
                imageName = this.get("imageName"),
                imageNameDefault = this.defaults.imageName,
                svgPath,
                style;

            if (styleScalingShape === "CIRCLESEGMENTS") {
                svgPath = this.createNominalCircleSegments(feature);
            }

            style = this.createSVGStyle(svgPath);

            // create style from svg and image
            if (imageName !== imageNameDefault) {
                imageStyle = this.createSimplePointStyle(feature, false);
                style = [style, imageStyle];
            }

            return style;
        },

        /**
         * create interval scaled advanced style for pointFeatures
         * @param  {ol.Feature} feature
         * @return {ol.Style} style
         */
        createIntervalAdvancedPointStyle: function (feature) {
            var styleScalingShape = this.get("scalingShape").toUpperCase(),
                svgPath;

            if (styleScalingShape === "CIRCLE_BAR") {
                svgPath = this.createIntervalCircleBar(feature);
            }

            style = this.createSVGStyle(svgPath);

            return style;

        },

        /**
         * create Style for SVG
         * @param  {String} svgPath
         * @return {ol.Style} style
         */
        createSVGStyle: function (svgPath) {
            var size = this.getSize();

            return new ol.style.Style({
                image: new ol.style.Icon({
                    src: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgPath),
                    imgSize: [size, size]
                })
            });
        },

        /*
        * creates textStyle if feature is clustered OR "labelField" is set
        */
        createTextStyle: function (feature, labelField, isClustered) {
            var textStyle,
                textObj = {};

                if (isClustered) {
                    textObj = this.createClusteredTextStyle(feature, labelField);
                    if (_.isUndefined(textObj)) {
                        return;
                    }
                }
                else if (labelField.length === 0) {
                    return;
                }
                else {
                    textObj.text = feature.get(labelField);
                    textObj.textAlign = this.get("textAlign");
                    textObj.font = this.get("textFont").toString();
                    textObj.scale = parseInt(this.get("textScale"), 10);
                    textObj.offsetX = parseInt(this.get("textOffsetX"), 10);
                    textObj.offsetY = parseInt(this.get("textOffsetY"), 10);
                    textObj.fillcolor = this.returnColor(this.get("textFillColor"), "rgb");
                    textObj.strokecolor = this.returnColor(this.get("textStrokeColor"), "rgb");
                    textObj.strokewidth = parseInt(this.get("textStrokeWidth"), 10);
                }

                textStyle = new ol.style.Text({
                    text: textObj.text,
                    textAlign: textObj.textAlign,
                    offsetX: textObj.offsetX,
                    offsetY: textObj.offsetY,
                    font: textObj.font,
                    scale: textObj.scale,
                    fill: new ol.style.Fill({
                        color: textObj.fillcolor
                    }),
                    stroke: new ol.style.Stroke({
                        color: textObj.strokecolor,
                        width: textObj.strokewidth
                    })
                });

                return textStyle;
        },
        /*
        * creates clusteredTextStyle.
        * if "clusterText" === "COUNTER" then the number if features are set
        * if "clusterText" === "NONE" no Text is shown
        * else all features get the text that is defined in "clusterText"
        */
        createClusteredTextStyle: function (feature, labelField) {
            var clusterTextObj = {};

            if (feature.get("features").length === 1) {
                clusterTextObj.text = feature.get("features")[0].get(labelField);
                clusterTextObj.textAlign = this.get("textAlign");
                clusterTextObj.font = this.get("textFont").toString();
                clusterTextObj.scale = parseInt(this.get("textScale"), 10);
                clusterTextObj.offsetX = parseInt(this.get("textOffsetX"), 10);
                clusterTextObj.offsetY = parseInt(this.get("textOffsetY"), 10);
                clusterTextObj.fillcolor = this.returnColor(this.get("textFillColor"), "rgb");
                clusterTextObj.strokecolor = this.returnColor(this.get("textStrokeColor"), "rgb");
                clusterTextObj.strokewidth = parseInt(this.get("textStrokeWidth"), 10);
            }
            else {
                if (this.get("clusterText") === "COUNTER") {
                    clusterTextObj.text = feature.get("features").length.toString();
                }
                else if (this.get("clusterText") === "NONE") {
                    return;
                }
                else {
                    clusterTextObj.text = this.get("clusterText");
                }
                clusterTextObj.textAlign = this.get("clusterTextAlign");
                clusterTextObj.font = this.get("clusterTextFont").toString();
                clusterTextObj.scale = parseFloat(this.get("clusterTextScale"), 10);
                clusterTextObj.offsetX = parseFloat(this.get("clusterTextOffsetX"), 10);
                clusterTextObj.offsetY = parseFloat(this.get("clusterTextOffsetY"), 10);
                clusterTextObj.fillcolor = this.returnColor(this.get("clusterTextFillColor"), "rgb");
                clusterTextObj.strokecolor = this.returnColor(this.get("clusterTextStrokeColor"), "rgb");
                clusterTextObj.strokewidth = parseFloat(this.get("clusterTextStrokeWidth"), 10);
            }
            return clusterTextObj;
        },

        /*
        * returns input color to destinated color.
        * possible values for dest are "rgb" and "hex".
        * color has to come as hex (e.g. "#ffffff" || "#fff") or as array (e.g [255,255,255,0]) or as String ("[255,255,255,0]")
        */
        returnColor: function (color, dest) {
            var src,
                newColor,
                pArray = [];

                if (_.isArray(color) && !_.isString(color)) {
                    src = "rgb";
                }
                else if (_.isString(color) && color.indexOf("#") === 0) {
                    src = "hex";
                }
                else if (_.isString(color) && color.indexOf("#") === -1) {
                    src = "rgb";

                    pArray = color.replace("[", "").replace("]", "").replace(/ /g, "").split(",");
                    color = [pArray[0], pArray[1], pArray[2], pArray[3]];
                }

            if (src === "hex" && dest === "rgb") {
                newColor = this.hexToRgb(color);
            }
            else if (src === "rgb" && dest === "hex") {
                newColor = this.rgbToHex(color[0], color[1], color[2]);
            }
            else {
                newColor = color;
            }

            return newColor;
        },
        rgbToHex: function (r, g, b) {
            return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
        },
        componentToHex: function (c) {
            var hex = c.toString(16);

            return hex.length === 1 ? "0" + hex : hex;
        },
        hexToRgb: function (hex) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

            return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
        },

        /**
         * create a svg with colored circle segments by nominal scaling
         * @param  {ol.Feature} feature
         * @return {String} svg with colored circle segments
         */
        createNominalCircleSegments: function (feature) {
            var size = 10,
                circleSegmentsRadius = parseInt(this.get("circleSegmentsRadius"), 10),
                circleSegmentsStrokeWidth = parseInt(this.get("circleSegmentsStrokeWidth"), 10),
                circleSegmentsFillOpacity = _.last(this.get("circleSegmentsBackgroundColor")),
                circleSegmentsBackgroundColor = this.returnColor(this.get("circleSegmentsBackgroundColor"), "hex"),
                scalingValueDefaultColor = this.returnColor(this.get("scalingValueDefaultColor"), "hex"),
                scalingValues = this.get("scalingValues"),
                scalingObject = this.fillScalingAttributes(feature),
                totalSegments = _.reduce(_.values(scalingObject), function (memo, num) {
                        return memo + num;
                    }, 0),
                degreeSegment = 360 / totalSegments,
                startAngelDegree = 0,
                endAngelDegree = degreeSegment,
                svg;

            // calculate size
            if (((circleSegmentsRadius + circleSegmentsStrokeWidth) * 2) >= size) {
                size = size + ((circleSegmentsRadius + circleSegmentsStrokeWidth) * 2);
            }

            // is required for the display in the Internet Explorer,
            // because in addition to the SVG and the size must be specified
            this.setSize(size);

            svg = this.createSvgNominalCircleSegments(size, circleSegmentsRadius, circleSegmentsBackgroundColor, circleSegmentsStrokeWidth, circleSegmentsFillOpacity);

            _.each(scalingObject, function (value, key) {
                if (!_.isUndefined(scalingValues) && (key !== "empty")) {
                    strokeColor = this.returnColor(scalingValues[key], "hex");
                }
                else {
                    strokeColor = scalingValueDefaultColor;
                }

                // create segments
                for (var i = 0; i < value; i++) {
                    var d = this.calculateCircleSegment(startAngelDegree, endAngelDegree, circleSegmentsRadius, size);

                    svg = this.extendsSvgNominalCircleSegments(svg, circleSegmentsStrokeWidth, strokeColor, d);

                    // set degree for next circular segment
                    startAngelDegree = startAngelDegree + degreeSegment;
                    endAngelDegree = endAngelDegree + degreeSegment;
                };
            }, this);

            svg = svg + "</svg>";

            return svg;
        },

        /**
         * fills the object with values
         * @param {ol.feature} feature
         * @return {Object} scalingObject - contains the states
         */
        fillScalingAttributes: function (feature) {
            var scalingObject = this.getScalingAttributesAsObject(),
                states = feature.get(this.get("scalingAttribute"));

            if (_.contains(states, "|")) {
                states = states.split(" | ");
            }
            else {
                states = [states];
            }

            _.each(states, function (state) {
                if (_.contains(_.keys(scalingObject), String(state))) {
                    scalingObject[state] = scalingObject[state] + 1;
                }
                else {
                    scalingObject.empty = scalingObject.empty + 1;
                }
            });

            return scalingObject;
        },

        /**
         * convert scalingAttributes to object
         * to fo object
         * @return {object} scalingAttribute with value 0
         */
        getScalingAttributesAsObject: function () {
            var obj = {},
                scalingValues = this.get("scalingValues");

            if (!_.isUndefined(scalingValues)) {
                _.each(scalingValues, function (key, value) {
                    obj[value] = 0;
                });
            }

            obj.empty = 0;

            return obj;
        },

        /**
         * create SVG for nominalscaled circle segments
         * @param  {number} size - size of the section to be drawn
         * @param  {number} circleSegmentsRadius
         * @param  {String} circleSegmentsBackgroundColor
         * @param  {number} circleSegmentsStrokeWidth
         * @param  {String} circleSegmentsFillOpacity
         * @return {String} svg
         */
        createSvgNominalCircleSegments: function (size, circleSegmentsRadius, circleSegmentsBackgroundColor, circleSegmentsStrokeWidth, circleSegmentsFillOpacity) {
            var svg = "<svg width='" + size + "'" +
                    " height='" + size + "'" +
                    " xmlns='http://www.w3.org/2000/svg'" +
                    " xmlns:xlink='http://www.w3.org/1999/xlink'>",
                svg = svg + "<circle cx='" + (size / 2) + "'" +
                    " cy='" + (size / 2) + "'" +
                    " r='" + circleSegmentsRadius + "'" +
                    " stroke='" + circleSegmentsBackgroundColor + "'" +
                    " stroke-width='" + circleSegmentsStrokeWidth + "'" +
                    " fill='" + circleSegmentsBackgroundColor + "'" +
                    " fill-opacity='" + circleSegmentsFillOpacity + "'/>";

            return svg;
        },

        /**
         * extends the SVG with given tags
         * @param  {String} svg - String with svg tags
         * @param  {number} circleSegmentsStrokeWidth
         * @param  {String} strokeColor
         * @param  {String} d - circle segment
         * @return {String} extended svg
         */
        extendsSvgNominalCircleSegments: function (svg, circleSegmentsStrokeWidth, strokeColor, d) {
            svg = svg + "<path" +
                " fill='none'" +
                " stroke-width='" + circleSegmentsStrokeWidth + "'" +
                " stroke='" + strokeColor + "'" +
                " d='" + d + "'/>";

            return svg;
        },

        /**
         * create circle segments
         * @param  {number} startAngelDegree - start with circle segment
         * @param  {number} endAngelDegree - finish with circle segment
         * @param  {number} circleRadius
         * @param  {number} size - size of the window to be draw
         * @return {String} all circle segments
         */
        calculateCircleSegment: function (startAngelDegree, endAngelDegree, circleRadius, size) {
            var rad = Math.PI / 180,
                xy = size / 2,
                gap = this.get("circleSegmentsGap"),
                isCircle = (startAngelDegree === 0 && endAngelDegree === 360) ? true : false;

            if (isCircle) {
                endAngelDegree = endAngelDegree / 2;
                gap = 0;
            }

            // convert angle from degree to radiant
            startAngleRad = (startAngelDegree + gap / 2) * rad;
            endAngleRad = (endAngelDegree - gap / 2) * rad;

            xStart = xy + (Math.cos(startAngleRad) * circleRadius);
            yStart = xy - (Math.sin(startAngleRad) * circleRadius);

            xEnd = xy + (Math.cos(endAngleRad) * circleRadius);
            yEnd = xy - (Math.sin(endAngleRad) * circleRadius);

            if (isCircle) {
                 var d = [
                    "M", xStart, yStart,
                    "A", circleRadius, circleRadius, 0, 0, 0, xEnd, yEnd,
                    "A", circleRadius, circleRadius, 0, 0, 0, xStart, yStart
                ].join(" ");
            }
            else {
                var d = [
                    "M", xStart, yStart,
                    "A", circleRadius, circleRadius, 0, 0, 0, xEnd, yEnd
                ].join(" ");
            }

            return d;
        },

        /**
         * create interval circle bar
         * @param  {ol.Feature} feature - contains features to draw
         * @return {String} svg
         */
        createIntervalCircleBar: function (feature) {
            var stateValue = feature.get(this.get("scalingAttribute")),
                circleBarScalingFactor = parseFloat(this.get("circleBarScalingFactor")),
                circleBarRadius = parseInt(this.get("circleBarRadius"), 10),
                circleBarLineStroke = parseInt(this.get("circleBarLineStroke"), 10),
                circleBarCircleFillColor = this.returnColor(this.get("circleBarCircleFillColor"), "hex"),
                circleBarCircleStrokeColor = this.returnColor(this.get("circleBarCircleStrokeColor"), "hex"),
                circleBarCircleStrokeWidth = this.get("circleBarCircleStrokeWidth"),
                circleBarLineStrokeColor = this.returnColor(this.get("circleBarLineStrokeColor"), "hex"),
                size,
                barLength,
                svg;

            if (_.contains(stateValue, " ")) {
                stateValue = stateValue.split(" ")[0];
            }

            size = this.calculateSizeIntervalCircleBar(stateValue, circleBarScalingFactor, circleBarLineStroke, circleBarRadius);
            barLength = this.calculateLengthIntervalCircleBar(size, circleBarRadius, stateValue, circleBarScalingFactor);

            this.setSize(size);

            // create svg
            svg = this.createSvgIntervalCircleBar(size, barLength, circleBarCircleFillColor, circleBarCircleStrokeColor, circleBarCircleStrokeWidth, circleBarLineStrokeColor, circleBarLineStroke, circleBarRadius);

            return svg;
        },

        /**
         * calculate size for intervalscaled circle bar
         * @param  {number} stateValue
         * @param  {number} circleBarScalingFactor
         * @param  {number} circleBarLineStroke
         * @return {number} size - size of the section to be drawn
         */
        calculateSizeIntervalCircleBar: function (stateValue, circleBarScalingFactor, circleBarLineStroke, circleBarRadius) {
            var size = circleBarRadius * 2;

            if (((stateValue * circleBarScalingFactor) + circleBarLineStroke) >= size) {
                size = size + ((stateValue * circleBarScalingFactor) + circleBarLineStroke);
            }

            return size;
        },

        /**
         * calculate the length for the bar
         * @param  {number} size - size of the section to be drawn
         * @param  {number} circleBarRadius
         * @param  {number} stateValue
         * @param  {number} circleBarScalingFactor
         * @return {number} barLength
         */
        calculateLengthIntervalCircleBar: function (size, circleBarRadius, stateValue, circleBarScalingFactor) {
            var barLength;

            if (stateValue >= 0) {
                barLength = (size / 2 - circleBarRadius - stateValue * circleBarScalingFactor);
            }
            else if (stateValue < 0) {
                barLength = (size / 2 + circleBarRadius - stateValue * circleBarScalingFactor);
            }
            else if (_.isNaN(stateValue) || stateValue === "NaN") {
                barLength = 0;
            }

            return barLength;
        },

        /**
         * create SVG for intervalscaled circle bars
         * @param  {number} size - size of the section to be drawn
         * @param  {number} barLength
         * @param  {String} circleBarCircleFillColor
         * @param  {String} circleBarCircleStrokeColor
         * @param  {number} circleBarCircleStrokeWidth
         * @param  {String} circleBarLineStrokeColor
         * @param  {number} circleBarLineStroke
         * @param  {number} circleBarRadius
         * @return {String} svg
         */
        createSvgIntervalCircleBar: function (size, barLength, circleBarCircleFillColor, circleBarCircleStrokeColor, circleBarCircleStrokeWidth, circleBarLineStrokeColor, circleBarLineStroke, circleBarRadius) {
            var svg = "<svg width='" + size + "'" +
                    " height='" + size + "'" +
                    " xmlns='http://www.w3.org/2000/svg'" +
                    " xmlns:xlink='http://www.w3.org/1999/xlink'>",
                // draw bar
                svg = svg + "<line x1='" + (size / 2) + "'" +
                    " y1='" + (size / 2) + "'" +
                    " x2='" + (size / 2) + "'" +
                    " y2='" + barLength + "'" +
                    " stroke='" + circleBarLineStrokeColor + "'" +
                    " stroke-width='" + circleBarLineStroke + "' />",
                // draw circle
                svg = svg + "<circle cx='" + (size / 2) + "'" +
                    " cy='" + (size / 2) + "'" +
                    " r='" + circleBarRadius + "'" +
                    " stroke='" + circleBarCircleStrokeColor + "'" +
                    " stroke-width='" + circleBarCircleStrokeWidth + "'" +
                    " fill='" + circleBarCircleFillColor + "' />",
                svg = svg + "</svg>";

            return svg;
        },

        setSize: function (size) {
            this.set("size", size);
        },

        getSize: function () {
            return this.get("size");
        }

    });

    return WFSStyle;
});
