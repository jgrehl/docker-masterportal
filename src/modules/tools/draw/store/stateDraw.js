const symbol = {
        id: "iconPoint",
        type: "simple_point",
        value: "simple_point"
    },
    /**
     * @property {Boolean} active Current status of the Tool.
     * @property {Boolean} drawLayerVisible Shows/hides the draw layer and enables/disables the tools of the draw tool.
     * @property {Object} addFeatureListener Listens to the the event "addFeature" which is fired after a feature has been added to the map.
     * @property {Boolean} addIconsOfActiveLayers If activated and possible, all symbols found in layers are added to the iconList.
     * @property {String} currentInteraction The current interaction. Could be either "draw", "modify", "delete" or "none"
     * @property {String} formerInteraction The former interaction. Could be either "draw", "modify", "delete" or "none"
     * @property {Object[]} deactivatedDrawInteractions Array of draw interactions which are deactivated in the process of the tool. Can be used to reactivate them from another point.
     * @property {Boolean} deactivateGFI If set to true, the activation of the tool deactivates the GFI tool.
     * @property {String} download.dataString Data that will be written to the file for the Download.
     * @property {module:ol/Feature[]} download.features Features that are drawn on the Map.
     * @property {String} download.file Name of the file including thr suffix.
     * @property {String} download.fileName Name for the to be downloaded file.
     * @property {String} download.fileUrl The URL encoded dataString.
     * @property {String[]} download.formats Choosable formats for the download of the features.
     * @property {String} download.selectedFormat The format selected by the user for the download of the features.
     * @property {module:ol/interaction/Draw} drawInteraction The draw interaction of the draw tool.
     * @property {module:ol/interaction/Draw} drawInteractionTwo The second draw interaction of the draw tool needed if a double circle is to be drawn.
     * @property {Object} drawType The type of the draw interaction. The first parameter represents the type unique identifier of the draw interaction as a String and the second parameter represents the geometry of the drawType as a String.
     * @property {Number} fId ID of the last feature that was added to the redoArray.
     * @property {Object[]} filterList Filter to show and hide features based on their drawType.
     * @property {String[]} filterList.drawTypes The drawTypes to be filtered.
     * @property {String} filterList.name The name of the corresponding filter.
     * @property {Boolean} freeHand Distinction between a freeHand line drawing or a static one.
     * @property {String} icon Icon used in the header of the window.
     * @property {Object[]} iconList List of icons used for the point draw interaction.
     * @property {String} id Internal Identifier for the Tool.
     * @property {Integer} idCounter Amount of features drawn.
     * @property {String} innerBorderColor The color of the border of the dropdown menu for the selection of the inner radius of a circle.
     * @property {Boolean} isVisibleInMenu If true, the draw tool is listed in the menu.
     * @property {module:ol/layer/Vector} layer The layer in which the features are drawn.
     * @property {module:ol/interaction/Modify} modifyInteraction The modify interaction of the draw tool.
     * @property {String} name Title of the Tool. Can be configured through the config.json.
     * @property {String} outerBorderColor The color of the border of the dropdown menu for the selection of the outer radius of a circle.
     * @property {Number} pointSize The size of the point.
     * @property {Number[]} redoArray Array of the IDs of features removed through the undo button.
     * @property {Number[]} undoArray Array of the IDs of features to be removed through the undo button.
     * @property {Boolean} renderToWindow Decides whether the Tool should be displayed as a window or as a sidebar.
     * @property {Boolean} resizableWindow Determines whether the Tool window can be resized.
     * @property {module:ol/interaction/Select} selectInteraction The select interaction of the draw tool.
     * @property {Object} symbol The symbol for the point.
     * @property {module:ol/Feature} tooltipCircleRadiusNode the tooltip to show when a circles radius is created or changed
     * @property {Boolean} withoutGUI Determines whether the window for the draw tool is rendered or not.
     * @property {Number} zIndex Determines in which order features are rendered on the view.
     * @property {Object} drawSymbolSettings the values used for the drawType drawSymbol
     * @property {String[]} drawSymbolSettings.color The color of the drawn feature represented as an array.
     * @property {Number} drawSymbolSettings.opacity The opacity of the color of the drawn features. NOTE: The values of the transparencySettings are opacity values.
     * @property {Object} drawLineSettings the values used for the drawType drawLine
     * @property {Object} drawLineSettings.unit The unit of measurement (e.g. "km").
     * @property {Object} drawLineSettings.length the length of the line
     * @property {Number} drawLineSettings.strokeWidth Stroke width.
     * @property {Number} drawLineSettings.opacityContour The opacity of the color of the contours for features of drawType "LineString". NOTE: The values of the transparencySettings are opacity values.
     * @property {String[]} drawLineSettings.colorContour The color of the contours of the drawn feature represented as an array.
     * @property {Object} drawLineSettings.tooltipStyle The custom style for the tooltip of drawType "Line".
     * @property {Object} drawCurveSettings the values used for the drawType drawCurve
     * @property {Number} drawCurveSettings.strokeWidth Stroke width.
     * @property {Number} drawCurveSettings.opacityContour The opacity of the color of the contours for features of drawType "LineString". NOTE: The values of the transparencySettings are opacity values.
     * @property {String[]} drawCurveSettings.colorContour The color of the contours of the drawn feature represented as an array.
     * @property {Object} drawAreaSettings the values used for the drawType drawArea
     * @property {Number} drawAreaSettings.strokeWidth Stroke width.
     * @property {String} drawAreaSettings.unit The unit of measurement (e.g. "km").
     * @property {String} drawAreaSettings.area The area of the area.
     * @property {String[]} drawAreaSettings.color The color of the drawn feature represented as an array.
     * @property {Number} drawAreaSettings.opacity The opacity of the color of the drawn features. NOTE: The values of the transparencySettings are opacity values.
     * @property {String[]} drawAreaSettings.colorContour The color of the contours of the drawn feature represented as an array.
     * @property {Number} drawAreaSettings.opacityContour The opacity of the color of the contours for features of drawType "LineString". NOTE: The values of the transparencySettings are opacity values.
     * @property {Object} drawAreaSettings.tooltipStyle The custom style for the tooltip of drawType "Area".
     * @property {Object} drawSquareSettings the values used for the drawType drawSquare
     * @property {String} drawSquareSettings.squareMethod The method for drawing features of drawType "Square".
     * @property {Number} drawSquareSettings.strokeWidth Stroke width.
     * @property {String} drawSquareSettings.unit The unit of measurement (e.g. "km").
     * @property {Number} drawSquareSettings.squareArea The area of the square.
     * @property {Number} drawSquareSettings.squareSide The length of the sides from the square, only calculated if not modified and all sides are the same length.
     * @property {String[]} drawSquareSettings.color The color of the drawn feature represented as an array.
     * @property {Number} drawSquareSettings.opacity The opacity of the color of the drawn features. NOTE: The values of the transparencySettings are opacity values.
     * @property {String[]} drawSquareSettings.colorContour The color of the contours of the drawn feature represented as an array.
     * @property {Number} drawSquareSettings.opacityContour The opacity of the color of the contours for features of drawType "LineString". NOTE: The values of the transparencySettings are opacity values.
     * @property {Object} drawSquareSettings.tooltipStyle The custom style for the tooltip of drawType "Square".
     * @property {Object} drawCircleSettings the values used for the drawType drawCircle
     * @property {String} drawCircleSettings.circleMethod The method for drawing features of drawType "Circle".
     * @property {Object} drawCircleSettings.tooltipStyle The custom style for the tooltip of drawType "Circle".
     * @property {String} drawCircleSettings.unit The unit of measurement (e.g. "km").
     * @property {Number} drawCircleSettings.circleRadius The inner radius for feature of drawType "Circle".
     * @property {Number} drawCircleSettings.strokeWidth Stroke width.
     * @property {String[]} drawCircleSettings.color The color of the drawn feature represented as an array.
     * @property {Number} drawCircleSettings.opacity The opacity of the color of the drawn features. NOTE: The values of the transparencySettings are opacity values.
     * @property {String[]} drawCircleSettings.colorContour The color of the contours of the drawn feature represented as an array.
     * @property {Number} drawCircleSettings.opacityContour The opacity of the color of the contours for features of drawType "LineString". NOTE: The values of the transparencySettings are opacity values.
     * @property {Object} drawDoubleCircleSettings the values used for the drawType drawDoubleCircle
     * @property {String} drawDoubleCircleSettings.circleMethod The method for drawing features of drawType "DoubleCircle".
     * @property {String} drawDoubleCircleSettings.unit The unit of measurement (e.g. "km").
     * @property {Number} drawDoubleCircleSettings.circleRadius The inner radius for feature of drawType "DoubleCircle".
     * @property {Number} drawDoubleCircleSettings.circleOuterRadius The outer radius for feature of drawType "DoubleCircle".
     * @property {Number} drawDoubleCircleSettings.strokeWidth Stroke width.
     * @property {String[]} drawDoubleCircleSettings.color The color of the drawn feature represented as an array.
     * @property {Number} drawDoubleCircleSettings.opacity The opacity of the color of the drawn features. NOTE: The values of the transparencySettings are opacity values.
     * @property {String[]} drawDoubleCircleSettings.colorContour The color of the contours of the drawn feature represented as an array.
     * @property {Number} drawDoubleCircleSettings.opacityContour The opacity of the color of the contours for features of drawType "LineString". NOTE: The values of the transparencySettings are opacity values.
     * @property {Object} writeTextSettings the values used for the drawType writeText
     * @property {String} writeTextSettings.text The text to be written if the drawType "writeText" is chosen.
     * @property {Number} writeTextSettings.fontSize The size of the font used for the text interaction.
     * @property {String} writeTextSettings.font The font used for the text interaction.
     * @property {String[]} writeTextSettings.color The color of the drawn feature represented as an array.
     * @property {Number} writeTextSettings.opacity The opacity of the color of the drawn features. NOTE: The values of the transparencySettings are opacity values.
     * @property {Number} initialWidth Size of the sidebar when opening.
     * @property {Number} initialWidthMobile Mobile size of the sidebar when opening.
     * @property {String[]} attributesKeyList the attributes' key list
     * @property {Boolean} semicolonCSVDelimiter to decide if semicolon is used as downloaded csv delimiter.
     */
    state = {
        active: false,
        drawLayerVisible: true,
        addFeatureListener: {},
        addIconsOfActiveLayers: false,
        currentInteraction: "draw",
        formerInteraction: "",
        deactivatedDrawInteractions: [],
        deactivateGFI: true,
        download: {
            dataString: "",
            enabled: true,
            features: [],
            file: "",
            fileName: "",
            fileUrl: "",
            formats: ["KML", "GEOJSON", "GPX", "CSV"], // NOTE(roehlipa): If this can't be configured, then it may be moved out of the state IMO.
            preSelectedFormat: "",
            selectedFormat: ""
        },
        drawInteraction: null,
        drawInteractionTwo: null,
        drawType: {
            id: "drawSymbol",
            geometry: "Point"
        },
        enableAttributesSelector: false,
        fId: 0,
        filterList: null,
        freeHand: false,
        icon: "bi-pencil-fill",
        iconList: [
            symbol
        ],
        id: "draw",
        idCounter: 0,
        innerBorderColor: "",
        isVisibleInMenu: true,
        layer: null,
        modifyInteraction: null,
        modifyAttributesInteraction: null,
        outerBorderColor: "",
        pointSize: 16,
        redoArray: [],
        undoArray: [],
        renderToWindow: false,
        resizableWindow: true,
        selectInteraction: null,
        selectInteractionModify: null,
        selectInteractionModifyAttributes: null,
        selectedFeature: null,
        symbol,
        tooltipCircleRadiusNode: null,
        withoutGUI: false,
        zIndex: 0,
        name: "common:menu.tools.draw",
        imgPath: "",
        // // // // // //
        // UI SETTINGS //
        // // // // // //
        drawSymbolSettings: {
            color: [55, 126, 184, 1],
            opacity: 1
        },
        drawLineSettings: {
            unit: "m",
            length: 0,
            strokeWidth: 1,
            opacityContour: 1,
            colorContour: [0, 0, 0, 1],
            tooltipStyle: {
                fontSize: "14px",
                paddingTop: "3px",
                paddingLeft: "3px",
                paddingRight: "3px",
                backgroundColor: "rgba(255, 255, 255, .9)"
            }
        },
        drawCurveSettings: {
            strokeWidth: 1,
            opacityContour: 1,
            colorContour: [0, 0, 0, 1]
        },
        drawAreaSettings: {
            strokeWidth: 1,
            unit: "m",
            area: 0,
            color: [55, 126, 184, 1],
            opacity: 1,
            colorContour: [0, 0, 0, 1],
            opacityContour: 1,
            tooltipStyle: {
                fontSize: "14px",
                paddingTop: "3px",
                paddingLeft: "3px",
                paddingRight: "3px",
                backgroundColor: "rgba(255, 255, 255, .9)"
            }
        },
        drawSquareSettings: {
            squareMethod: "interactive",
            strokeWidth: 1,
            squareSide: 0,
            unit: "m",
            squareArea: 0,
            color: [55, 126, 184, 1],
            opacity: 1,
            colorContour: [0, 0, 0, 1],
            opacityContour: 1,
            tooltipStyle: {
                fontSize: "14px",
                paddingTop: "3px",
                paddingLeft: "3px",
                paddingRight: "3px",
                backgroundColor: "rgba(255, 255, 255, .9)"
            }
        },
        drawCircleSettings: {
            circleMethod: "interactive",
            unit: "m",
            circleRadius: 0,
            strokeWidth: 1,
            color: [55, 126, 184, 1],
            opacity: 1,
            colorContour: [0, 0, 0, 1],
            opacityContour: 1,
            tooltipStyle: {
                fontSize: "14px",
                paddingTop: "3px",
                paddingLeft: "3px",
                paddingRight: "3px",
                backgroundColor: "rgba(255, 255, 255, .9)"
            }
        },
        drawDoubleCircleSettings: {
            circleMethod: "defined",
            unit: "m",
            circleRadius: 0,
            circleOuterRadius: 0,
            strokeWidth: 1,
            color: [55, 126, 184, 1],
            opacity: 1,
            colorContour: [0, 0, 0, 1],
            outerColorContour: [0, 0, 0, 1],
            opacityContour: 1
        },
        writeTextSettings: {
            text: "",
            fontSize: 10,
            font: "Arial",
            color: [55, 126, 184, 1],
            opacity: 1
        },
        initialWidth: 500,
        initialWidthMobile: 300,
        attributesKeyList: [],
        semicolonCSVDelimiter: true,
        oldStyle: undefined
    };

export default state;
