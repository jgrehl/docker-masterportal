import testAction from "../../../../../../../../test/unittests/VueTestUtils";
import actions from "../../../../store/actions/actionsPrintInitialization";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import sinon from "sinon";

const {
    chooseCurrentLayout,
    sortVisibleLayerListByZindex,
    retrieveCapabilites,
    parseMapfishCapabilities,
    getGfiForPrint,
    getAttributeInLayoutByName,
    togglePostrenderListener,
    setPrintLayers,
    updateCanvasLayer,
    getVisibleLayer,
    createPrintMask,
    getOptimalScale,
    getOptimalResolution,
    drawMask,
    drawPrintPage,
    getPrintMapSize,
    getPrintMapScales
} = actions;

describe("src/modules/tools/print/store/actions/actionsPrintInitialization.js", () => {
    describe("chooseCurrentLayout", () => {
        it("should choose the current Layout", done => {
            const payload = [
                    {
                        name: "A4 Hochformat"
                    },
                    {
                        name: "A4 Querformat"
                    },
                    {
                        name: "A3 Hochformat"
                    },
                    {
                        name: "A3 Querformat"
                    }
                ],
                state = {
                    currentLayoutName: "A3 Querformat",
                    currentLayout: {name: "A3 Querformat"}
                };

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(chooseCurrentLayout, payload, state, {}, [
                {type: "setCurrentLayout", payload: state.currentLayout}
            ], {}, done);
        });
    });
    describe("sortVisibleLayerListByZindex", function () {
        it("should return an sorted array by input with zIndeces", done => {
            const array = [],
                layer1 = new VectorLayer({
                    source: new VectorSource()
                }),
                layer2 = new VectorLayer({
                    source: new VectorSource()
                }),
                layer3 = new VectorLayer({
                    source: new VectorSource()
                });

            layer1.setZIndex(10);
            layer2.setZIndex(9);
            layer3.setZIndex(11);

            array.push(layer1);
            array.push(layer2);
            array.push(layer3);

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(sortVisibleLayerListByZindex, array, {}, {}, [
                {type: "setVisibleLayerList", payload: [layer2, layer1, layer3]}
            ], {}, done);
        });

        it("should return an sorted array by input with zIndeces und without indeces", done => {
            const array = [],
                layer1 = new VectorLayer({
                    source: new VectorSource()
                }),
                layer2 = new VectorLayer({
                    source: new VectorSource()
                }),
                layer3 = new VectorLayer({
                    source: new VectorSource()
                });

            layer1.setZIndex(10);
            layer3.setZIndex(9);

            array.push(layer1);
            array.push(layer2);
            array.push(layer3);

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(sortVisibleLayerListByZindex, array, {}, {}, [
                {type: "setVisibleLayerList", payload: [layer2, layer3, layer1]}
            ], {}, done);
        });

        it("should return an empty array by empty array input", done => {
            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(sortVisibleLayerListByZindex, [], {}, {}, [
                {type: "setVisibleLayerList", payload: []}
            ], {}, done);
        });
    });

    describe("retrieveCapabilites", function () {
        it("should return the capabilities", done => {
            const serviceRequest = {
                    "serviceUrl": "https://geodienste.hamburg.de/mapfish_print_internet/print/master/capabilities.json",
                    "requestType": "GET",
                    "onSuccess": "parseMapfishCapabilities"
                },
                state = {
                    printSettings: {
                        mapfishServiceId: "mapfish"
                    },
                    printAppId: "master"
                },
                url = "https://geodienste.hamburg.de/mapfish_print_internet/print/",
                request = sinon.spy(() => ({
                    get: () => "https://geodienste.hamburg.de/mapfish_print_internet/print/"
                }));

            sinon.stub(Radio, "request").callsFake(request);
            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(retrieveCapabilites, null, state, {}, [
                {type: "setMapfishServiceUrl", payload: url, commit: true},
                {type: "sendRequest", payload: serviceRequest, dispatch: true}
            ], {}, done);
        });
        after(function () {
            sinon.restore();
        });
    });

    describe("parseMapfishCapabilities", function () {
        it("should parse the mapfish capabilities", done => {
            const payload = {
                layouts: [
                    {
                        name: "A4 Hochformat"
                    },
                    {
                        name: "A4 Querformat"
                    },
                    {
                        name: "A3 Hochformat"
                    },
                    {
                        name: "A3 Querformat"
                    }
                ],
                formats: [
                    "jpg", "png", "pdf"
                ]
            };

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(parseMapfishCapabilities, payload, {}, {}, [
                {type: "setLayoutList", payload: payload.layouts}
            ], {}, done);
        });
    });

    describe("getGfiForPrint", function () {
        it("should set empty gfi for print", done => {

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(getGfiForPrint, null, {}, {}, [
                {type: "setGfiForPrint", payload: []}
            ], {}, done, {"Tools/Gfi/currentFeature": null});
        });
        it("should set gfi for print", done => {
            const feature = {
                getTitle: () => "TestTitle",
                getMappedProperties: () => "TestProperties"
            };

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(getGfiForPrint, null, {}, {}, [
                {type: "setGfiForPrint", payload: ["TestProperties", "TestTitle", undefined]}
            ], {}, done, {"Tools/Gfi/currentFeature": feature, "Map/clickCoord": undefined});
        });
    });

    describe("getAttributeInLayoutByName", function () {
        it("should set nothing because gfi isn't available", done => {
            const state = {
                currentLayout: {
                    attributes: [
                        {name: "title"},
                        {name: "map"},
                        {name: "scale"},
                        {name: "master"},
                        {name: "title"}
                    ]
                }
            };

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(getAttributeInLayoutByName, "gfi", state, {}, [
            ], {}, done);
        });
    });

    describe("togglePostrenderListener", function () {
        it("should toggle the post render listener", done => {
            const TileLayer = {},
                state = {
                    active: true,
                    visibleLayerList: [
                        TileLayer,
                        VectorLayer,
                        VectorLayer,
                        VectorLayer,
                        VectorLayer
                    ],
                    eventListener: undefined,
                    layoutList: []
                };

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(togglePostrenderListener, undefined, state, {}, [
                {type: "getVisibleLayer", undefined, dispatch: true},
                {type: "setVisibleLayer", payload: state.visibleLayerList, commit: true},
                {type: "setEventListener", payload: undefined, commit: true}
            ], {}, done);
        });
    });

    describe("setPrintLayers", function () {
        it("should Get the layer which is visible in print scale", done => {
            const TileLayer = {
                    getMaxResolution: () => 66.80725559074865,
                    getMinResolution: () => 0.13229159522920522,
                    setVisible: () => true
                },
                scale = 40000,
                state = {
                    active: true,
                    visibleLayerList: [
                        TileLayer
                    ],
                    eventListener: undefined,
                    layoutList: []
                },
                request = sinon.spy(() => ({
                    setIsOutOfRange: () => false
                }));

            sinon.stub(Radio, "request").callsFake(request);

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(setPrintLayers, scale, state, {}, [
                {type: "setHintInfo", payload: "", commit: true},
                {type: "setInvisibleLayer", payload: [], commit: true},
                {type: "updateCanvasLayer", payload: undefined, dispatch: true}
            ], {}, done);
        });
        after(function () {
            sinon.restore();
        });
    });

    describe("updateCanvasLayer", function () {
        it("should update to draw the print page rectangle onto the canvas when the map changes", done => {
            const TileLayer = {
                    getMaxResolution: () => 66.80725559074865,
                    getMinResolution: () => 0.13229159522920522,
                    setVisible: () => true
                },
                scale = 40000,
                options = {
                    resolution: 15.874991427504629,
                    scale: 60000,
                    zoomLevel: 2
                },
                state = {
                    active: true,
                    visibleLayerList: [
                        TileLayer
                    ],
                    eventListener: undefined
                },
                request = sinon.spy(() => ({
                    getOptions: () => options
                }));

            sinon.stub(Radio, "request").callsFake(request);
            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(updateCanvasLayer, scale, state, {}, [], {}, done);
        });
        after(function () {
            sinon.restore();
        });

    });

    describe("getVisibleLayer", function () {
        it("returns the visible Layers", done => {
            const TileLayer = {
                    getVisible: () => true,
                    get: () => "name"
                },
                visibleLayerList = [
                    TileLayer
                ],
                request = sinon.spy(() => ({
                    getArray: () => [TileLayer],
                    getVisible: () => true
                }));

            sinon.stub(Radio, "request").callsFake(request);

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(getVisibleLayer, undefined, null, {}, [
                {type: "sortVisibleLayerListByZindex", payload: visibleLayerList, dispatch: true}
            ], {}, done);
        });
    });

    describe("createPrintMask", function () {
        it("creates the print Mask", done => {
            const evt = {
                    context: {
                        canvas: {},
                        direction: "ltr",
                        fillStyle: "#000000",
                        filter: "none",
                        font: "10px sans-serif",
                        globalAlpha: 1,
                        globalCompositeOperation: "source-over",
                        imageSmoothingEnabled: true,
                        imageSmoothingQuality: "low",
                        lineCap: "butt",
                        lineDashOffset: 0,
                        lineJoin: "miter",
                        lineWidth: 1,
                        miterLimit: 10,
                        shadowBlur: 0,
                        shadowColor: "rgba(0, 0, 0, 0)",
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        strokeStyle: "#000000",
                        textAlign: "start",
                        textBaseline: "alphabetic",
                        fill: () => {
                            return null;
                        }
                    },
                    frameState: {
                        size: [1348, 864],
                        viewState: {
                            resolution: 15.874991427504629
                        }
                    }
                },
                state = {
                    layoutMapInfo: [772, 1044],
                    isScaleSelectedManually: false,
                    scaleList: [500, 1000, 2500, 5000, 10000, 20000, 40000, 60000, 100000],
                    optimalScale: 20000
                },
                canvasOptions = {
                    "mapSize": evt.frameState.size,
                    "resolution": evt.frameState.viewState.resolution,
                    "printMapSize": state.layoutMapInfo,
                    "scaleList": state.scaleList
                },
                drawMaskOpt = {
                    "frameState": evt.frameState,
                    "context": evt.context
                },
                canvasPrintOptions = {
                    "mapSize": evt.frameState.size,
                    "resolution": evt.frameState.viewState.resolution,
                    "printMapSize": state.layoutMapInfo,
                    "scale": 20000,
                    "context": evt.context
                };

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(createPrintMask, evt, state, {}, [
                {type: "getPrintMapSize", payload: undefined, dispatch: true},
                {type: "getPrintMapScales", payload: undefined, dispatch: true},
                {type: "getOptimalScale", payload: canvasOptions, dispatch: true},
                {type: "drawMask", payload: drawMaskOpt, dispatch: true},
                {type: "drawPrintPage", payload: canvasPrintOptions, dispatch: true},
                {type: "setPrintLayers", payload: state.optimalScale, dispatch: true}
            ], {}, done);
        });
    });

    describe("getOptimalScale", function () {
        it("returns the optimal scale", done => {
            const frameState = {
                    size: [1348, 864],
                    viewState: {
                        resolution: 15.874991427504629
                    }
                },
                state = {
                    layoutMapInfo: [772, 1044],
                    isScaleSelectedManually: false,
                    scaleList: [500, 1000, 2500, 5000, 10000, 20000, 40000, 60000, 100000],
                    optimalScale: 20000,
                    DOTS_PER_INCH: 72,
                    INCHES_PER_METER: 39.37
                },
                canvasOptions = {
                    "mapSize": frameState.size,
                    "resolution": frameState.viewState.resolution,
                    "printMapSize": state.layoutMapInfo,
                    "scaleList": state.scaleList
                };

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(getOptimalScale, canvasOptions, state, {}, [
                {type: "setOptimalScale", payload: 20000, commit: true}
            ], {}, done);
        });
    });

    describe("getOptimalResolution", function () {
        it("returns the optimal resolution", done => {
            const resolution = {
                    scale: 10000,
                    mapSize: [951, 864],
                    printMapSize: [772, 1044]
                },
                state = {
                    DOTS_PER_INCH: 72,
                    INCHES_PER_METER: 39.37
                };

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(getOptimalResolution, resolution, state, {}, [
                {type: "setOptimalResolution", payload: 4.262740006961495, commit: true}
            ], {}, done);
        });
    });

    describe("drawMask", function () {
        it("should draw the print Mask", done => {
            const evt = {
                    context: {
                        canvas: {},
                        direction: "ltr",
                        fillStyle: "#000000",
                        filter: "none",
                        font: "10px sans-serif",
                        globalAlpha: 1,
                        globalCompositeOperation: "source-over",
                        imageSmoothingEnabled: true,
                        imageSmoothingQuality: "low",
                        lineCap: "butt",
                        lineDashOffset: 0,
                        lineJoin: "miter",
                        lineWidth: 1,
                        miterLimit: 10,
                        shadowBlur: 0,
                        shadowColor: "rgba(0, 0, 0, 0)",
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        strokeStyle: "#000000",
                        textAlign: "start",
                        textBaseline: "alphabetic",
                        beginPath: () => {
                            return null;
                        },
                        moveTo: () => {
                            return null;
                        },
                        lineTo: () => {
                            return null;
                        },
                        closePath: () => {
                            return null;
                        }
                    },
                    frameState: {
                        size: [1348, 864],
                        viewState: {
                            resolution: 15.874991427504629
                        }
                    }
                },
                drawMaskOpt = {
                    "frameState": evt.frameState,
                    "context": evt.context
                };

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(drawMask, drawMaskOpt, null, {}, [], {}, done);
        });
    });

    describe("drawPrintPage", function () {
        it("should draw the print page", done => {
            const evt = {
                    context: {
                        canvas: {
                            width: 1348
                        },
                        direction: "ltr",
                        fillStyle: "#000000",
                        filter: "none",
                        font: "10px sans-serif",
                        globalAlpha: 1,
                        globalCompositeOperation: "source-over",
                        imageSmoothingEnabled: true,
                        imageSmoothingQuality: "low",
                        lineCap: "butt",
                        lineDashOffset: 0,
                        lineJoin: "miter",
                        lineWidth: 1,
                        miterLimit: 10,
                        shadowBlur: 0,
                        shadowColor: "rgba(0, 0, 0, 0)",
                        shadowOffsetX: 0,
                        shadowOffsetY: 0,
                        strokeStyle: "#000000",
                        textAlign: "start",
                        textBaseline: "alphabetic",
                        moveTo: () => {
                            return null;
                        },
                        lineTo: () => {
                            return null;
                        },
                        closePath: () => {
                            return null;
                        }
                    },
                    frameState: {
                        size: [1348, 864],
                        viewState: {
                            resolution: 15.874991427504629
                        }
                    }
                },
                state = {
                    layoutMapInfo: [772, 1044],
                    isScaleSelectedManually: false,
                    scaleList: [500, 1000, 2500, 5000, 10000, 20000, 40000, 60000, 100000],
                    optimalScale: 20000,
                    DOTS_PER_INCH: 72,
                    INCHES_PER_METER: 39.37
                },
                canvasPrintOptions = {
                    "mapSize": evt.frameState.size,
                    "resolution": evt.frameState.viewState.resolution,
                    "printMapSize": state.layoutMapInfo,
                    "scale": 20000,
                    "context": evt.context
                };

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(drawPrintPage, canvasPrintOptions, state, {}, [], {}, done);
        });
    });

    describe("getPrintMapSize", function () {
        it("should commit the printMapSize", done => {
            const state = {
                mapAttribute: {
                    clientInfo: {
                        width: 772,
                        height: 1044
                    }
                }
            };

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(getPrintMapSize, undefined, state, {}, [
                {type: "getAttributeInLayoutByName", payload: "map", dispatch: true},
                {type: "setLayoutMapInfo", payload: [772, 1044], commit: true}
            ], {}, done);
        });
    });
    describe("getPrintMapScales", function () {
        it("should commit the scales", done => {
            const state = {
                mapAttribute: {
                    clientInfo: {
                        scales: [
                            250000,
                            100000,
                            60000,
                            40000,
                            20000,
                            10000,
                            5000,
                            2500,
                            1000,
                            500
                        ]
                    }
                }
            };

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(getPrintMapScales, undefined, state, {}, [
                {type: "getAttributeInLayoutByName", payload: "map", dispatch: true},
                {type: "setScaleList", payload: state.mapAttribute.clientInfo.scales, commit: true}
            ], {}, done);
        });
    });
});
