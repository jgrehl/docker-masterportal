import {expect} from "chai";
import sinon from "sinon";
import styleList from "@masterportal/masterportalapi/src/vectorStyle/styleList.js";
import createStyle from "@masterportal/masterportalapi/src/vectorStyle/createStyle";
import getGeometryTypeFromService from "@masterportal/masterportalapi/src/vectorStyle/lib/getGeometryTypeFromService";
import Layer2dVector from "../../../js/layer2dVector";

describe("src_3_0_0/core/js/layers/layer2dVector.js", () => {
    let attributes,
        error,
        warn,
        styleListStub;

    before(() => {
        mapCollection.clear();
        const map = {
            id: "ol",
            mode: "2D",
            getView: () => {
                return {
                    getProjection: () => {
                        return {
                            getCode: () => "EPSG:25832"
                        };
                    }
                };
            }
        };

        mapCollection.addMap(map, "2D");
    });

    beforeEach(() => {
        error = sinon.spy();
        warn = sinon.spy();
        sinon.stub(console, "error").callsFake(error);
        sinon.stub(console, "warn").callsFake(warn);
        attributes = {
            altitudeMode: "clampToGround"
        };
        const styleObj = {
            styleId: "styleId",
            rules: []
        };

        styleListStub = sinon.stub(styleList, "returnStyleObject").returns(styleObj);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("createLayer", () => {
        it("new Layer2dVector should create an layer with warning", () => {
            const layerWrapper = new Layer2dVector({});

            expect(layerWrapper).not.to.be.undefined;
            expect(warn.calledOnce).to.be.true;
        });
    });

    describe("clusterGeometryFunction", () => {
        it("should return the geometry of a feature", () => {
            const layer2d = new Layer2dVector(attributes),
                feature = {
                    get: () => sinon.stub(),
                    getGeometry: () => "Point"
                };

            expect(layer2d.clusterGeometryFunction(feature)).to.equals("Point");
        });
    });

    describe("featuresFilter", () => {
        it("featuresFilter shall filter getGeometry", function () {
            const layer2d = new Layer2dVector(attributes),
                features = [{
                    id: "1",
                    getGeometry: () => sinon.stub()
                },
                {
                    id: "2",
                    getGeometry: () => undefined
                }];

            expect(layer2d.featuresFilter(attributes, features).length).to.be.equals(1);

        });

        it("featuresFilter shall filter bboxGeometry", function () {
            attributes.bboxGeometry = {
                intersectsCoordinate: (coord) => {
                    if (coord[0] === 0.5 && coord[1] === 0.5) {
                        return true;
                    }
                    return false;
                },
                getExtent: () => ["1"]
            };
            const layer2d = new Layer2dVector(attributes),
                features = [{
                    id: "1",
                    getGeometry: () => {
                        return {
                            getExtent: () => [0, 0, 1, 1]
                        };

                    }
                },
                {
                    id: "2",
                    getGeometry: () => undefined
                },
                {
                    id: "3",
                    getGeometry: () => {
                        return {
                            getExtent: () => [2, 2, 3, 3]
                        };
                    }
                }],
                wfsFeatureFilter = layer2d.featuresFilter(attributes, features);

            expect(wfsFeatureFilter.length).to.be.equals(1);
            expect(wfsFeatureFilter[0].id).to.be.equals("1");
        });
    });

    describe("getLayerParams", () => {
        let localAttributes;

        beforeEach(() => {
            localAttributes = {
                altitudeMode: "clampToGround",
                gfiAttributes: "showAll",
                gfiTheme: "default",
                name: "The name",
                transparency: 0,
                typ: "Layer2d",
                zIndex: 1,
                renderer: "default",
                styleId: "styleId",
                style: [],
                excludeTypesFromParsing: ["type"],
                isPointLayer: false
            };
        });

        it("should return the raw layer attributes", () => {
            const layer2d = new Layer2dVector(localAttributes);
            /*
              zIndex: attributes.zIndex,
        renderer: attributes.renderer, // use "default" (canvas) or "webgl" renderer
        styleId: attributes.styleId, // styleId to pass to masterportalapi
        style: attributes.style, // style function to style the layer or WebGLPoints style syntax
        excludeTypesFromParsing: attributes.excludeTypesFromParsing, // types that should not be parsed from strings, only necessary for webgl
        isPointLayer: attributes.isPointLayer // whether the source will only hold point data, only necessary for webgl
            */

            expect(layer2d.getLayerParams(localAttributes)).to.deep.equals({
                altitudeMode: "clampToGround",
                gfiAttributes: "showAll",
                gfiTheme: "default",
                name: "The name",
                opacity: 1,
                typ: "Layer2d",
                zIndex: 1,
                renderer: "default",
                styleId: "styleId",
                style: [],
                excludeTypesFromParsing: ["type"],
                isPointLayer: false
            });
        });
    });

    describe("loadingParams", () => {
        it("should return loading params", () => {
            const layer2d = new Layer2dVector(attributes);

            expect(layer2d.loadingParams(attributes)).to.deep.equals({
                xhrParameters: undefined,
                propertyname: "",
                bbox: undefined
            });
        });
    });

    describe("propertyNames", () => {
        it("should return an empty Stirng if no propertyNames are configured", () => {
            const layer2d = new Layer2dVector(attributes);

            expect(layer2d.propertyNames(attributes)).to.equals("");
        });

        it("should return all strings separated by comma", () => {
            Object.assign(attributes, {propertyNames: ["ab", "cd"]});
            const layer2d = new Layer2dVector(attributes);

            expect(layer2d.propertyNames(attributes)).to.equals("ab,cd");
        });

        it("propertyNames shall return joined proertyNames or empty string", function () {
            attributes.propertyNames = ["app:plan", "app:name"];
            const layer2d = new Layer2dVector(attributes);
            let propertyname = layer2d.propertyNames(attributes);

            expect(propertyname).to.be.equals("app:plan,app:name");

            attributes.propertyNames = [];
            propertyname = layer2d.propertyNames(attributes);
            expect(propertyname).to.be.equals("");
            attributes.propertyNames = undefined;
            propertyname = layer2d.propertyNames(attributes);
            expect(propertyname).to.be.equals("");
            attributes.propertyNames = undefined;
            propertyname = layer2d.propertyNames(attributes);
            expect(propertyname).to.be.equals("");
        });
    });

    describe("onLoadingError", () => {
        it("should print a console.error", () => {
            const layer2d = new Layer2dVector(attributes);

            layer2d.onLoadingError("The error message");

            expect(error.calledOnce).to.be.true;
        });
    });

    describe("style funtions", () => {
        it("getStyleFunction shall return a function", function () {
            let layer2d = null,
                styleFunction = null;

            attributes.styleId = "styleId";
            layer2d = new Layer2dVector(attributes);
            styleFunction = layer2d.getStyleFunction(attributes);

            expect(styleFunction).not.to.be.null;
            expect(typeof styleFunction).to.be.equals("function");
        });

        it("setStyle shall set undefined at layer's style to use defaultStyle", function () {
            let layer2d = null,
                olLayerStyle = null;
            const olLayer = {
                setStyle: (value) => {
                    olLayerStyle = value;
                }
            };

            styleListStub.restore();
            layer2d = new Layer2dVector(attributes);
            layer2d.getLayer = () => olLayer;
            layer2d.setStyle(null);

            expect(olLayerStyle).not.to.be.null;
            expect(olLayerStyle).to.be.undefined;
        });
    });

    describe("createLegend", () => {
        beforeEach(() => {
            attributes = {
                id: "id",
                version: "1.3.0"
            };
        });

        it("createLegend with legendURL", async () => {
            attributes.legendURL = "legendUrl1";
            const layerWrapper = new Layer2dVector(attributes);

            expect(await layerWrapper.createLegend()).to.be.deep.equals([attributes.legendURL]);
        });

        it("createLegend with legendURL as array", async () => {
            attributes.legendURL = ["legendUrl1"];
            const layerWrapper = new Layer2dVector(attributes);


            expect(await layerWrapper.createLegend()).to.be.deep.equals(attributes.legendURL);
        });

        it("createLegend with styleObject and legend true", async () => {
            attributes.legend = true;
            const layerWrapper = new Layer2dVector(attributes),
                legendInformation = {
                    "the": "legend Information"
                };

            sinon.stub(createStyle, "returnLegendByStyleId").returns({legendInformation});
            sinon.stub(getGeometryTypeFromService, "getGeometryTypeFromWFS");

            expect(await layerWrapper.createLegend()).to.deep.equals(legendInformation);
        });
    });
});
