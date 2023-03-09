import {expect} from "chai";
import sinon from "sinon";
import styleList from "@masterportal/masterportalapi/src/vectorStyle/styleList.js";
import Layer2dVector from "../../../js/layer2dVector";
import webgl from "../../../js/webglRenderer";

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
                zIndex: 1
            };
        });

        it("should return the raw layer attributes", () => {
            const layer2d = new Layer2dVector(localAttributes);

            expect(layer2d.getLayerParams(localAttributes)).to.deep.equals({
                altitudeMode: "clampToGround",
                gfiAttributes: "showAll",
                gfiTheme: "default",
                name: "The name",
                opacity: 1,
                typ: "Layer2d",
                zIndex: 1
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

    describe("Use WebGL renderer", () => {
        it("Should create the layer with WebGL methods, if renderer: \"webgl\" is set", function () {
            const
                vectorLayer = new Layer2dVector({...attributes, renderer: "webgl"}),
                layer = vectorLayer.getLayer();

            expect(vectorLayer.isDisposed).to.equal(webgl.isDisposed);
            expect(vectorLayer.setIsSelected).to.equal(webgl.setIsSelected);
            expect(vectorLayer.hideAllFeatures).to.equal(webgl.hideAllFeatures);
            expect(vectorLayer.showAllFeatures).to.equal(webgl.showAllFeatures);
            expect(vectorLayer.showFeaturesByIds).to.equal(webgl.showFeaturesByIds);
            expect(vectorLayer.setStyle).to.equal(webgl.setStyle);
            expect(vectorLayer.styling).to.equal(webgl.setStyle);
            expect(vectorLayer.source).to.equal(layer.getSource());
            expect(layer.get("isPointLayer")).to.not.be.undefined;
        });
    });
});
