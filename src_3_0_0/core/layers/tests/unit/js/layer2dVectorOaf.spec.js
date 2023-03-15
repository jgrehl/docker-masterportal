import Cluster from "ol/source/Cluster.js";
import {expect} from "chai";
import sinon from "sinon";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import styleList from "@masterportal/masterportalapi/src/vectorStyle/styleList.js";
import getGeometryTypeFromService from "@masterportal/masterportalapi/src/vectorStyle/lib/getGeometryTypeFromService";
import createStyle from "@masterportal/masterportalapi/src/vectorStyle/createStyle";
import webgl from "../../../js/webglRenderer";
import Layer2dVectorOaf from "../../../js/layer2dVectorOaf";

describe("src_3_0_0/core/js/layers/layer2dVectorOaf.js", () => {
    let attributes,
        warn,
        getGeometryTypeFromOAFStub;

    before(() => {
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);

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
        attributes = {
            id: "id",
            name: "oafTestLayer",
            typ: "OAF"
        };
        getGeometryTypeFromOAFStub = sinon.stub(getGeometryTypeFromService, "getGeometryTypeFromOAF").returns(true);
    });


    afterEach(() => {
        sinon.restore();
    });

    describe("createLayer", () => {
        beforeEach(() => {
            const styleObj = {
                styleId: "styleId",
                rules: []
            };

            sinon.stub(styleList, "returnStyleObject").returns(styleObj);
        });
        it("new Layer2dVectorWfs should create an layer with no warning", () => {
            const oafLayer = new Layer2dVectorOaf({});

            expect(oafLayer).not.to.be.undefined;
            expect(warn.notCalled).to.be.true;
        });

        it("createLayer shall create an ol.VectorLayer with source and style and OAF-format", function () {
            const oafLayer = new Layer2dVectorOaf(attributes),
                layer = oafLayer.getLayer();

            expect(layer).to.be.an.instanceof(VectorLayer);
            expect(layer.getSource()).to.be.an.instanceof(VectorSource);
            expect(typeof layer.getStyleFunction()).to.be.equals("function");
            expect(layer.get("id")).to.be.equals(attributes.id);
            expect(layer.get("name")).to.be.equals(attributes.name);
            expect(layer.get("gfiTheme")).to.be.equals(attributes.gfiTheme);
        });

        it("createLayer shall create an ol.VectorLayer with cluster-source", function () {
            attributes.clusterDistance = 60;
            const oafLayer = new Layer2dVectorOaf(attributes),
                layer = oafLayer.getLayer();

            expect(layer).to.be.an.instanceof(VectorLayer);
            expect(layer.getSource()).to.be.an.instanceof(Cluster);
            expect(layer.getSource().getDistance()).to.be.equals(attributes.clusterDistance);
            expect(typeof layer.getStyleFunction()).to.be.equals("function");
        });
    });

    describe("getRawLayerAttributes", () => {
        let localAttributes;

        beforeEach(() => {
            localAttributes = {
                bbox: [1, 2, 3, 4],
                bboxCrs: "EPSG:25832",
                clusterDistance: 10,
                collection: "collection",
                crs: "http://www.opengis.net/def/crs/EPSG/0/25832",
                datetime: "time",
                id: "1234",
                limit: 10,
                offset: 10,
                params: "params",
                url: "exmpale.url"
            };
        });

        it("should return the raw layer attributes", () => {
            const oafLayer = new Layer2dVectorOaf(localAttributes);

            expect(oafLayer.getRawLayerAttributes(localAttributes)).to.deep.equals({
                bbox: [1, 2, 3, 4],
                bboxCrs: "EPSG:25832",
                clusterDistance: 10,
                collection: "collection",
                crs: "http://www.opengis.net/def/crs/EPSG/0/25832",
                datetime: "time",
                id: "1234",
                limit: 10,
                offset: 10,
                params: "params",
                url: "exmpale.url"
            });
        });
    });

    describe("getOptions", () => {
        let options;

        beforeEach(() => {
            options = [
                "clusterGeometryFunction",
                "featuresFilter",
                "loadingParams",
                "loadingStrategy",
                "onLoadingError",
                "style"
            ];
        });

        it("should return the options that includes the correct keys", () => {
            const oafLayer = new Layer2dVectorOaf(attributes);

            expect(Object.keys(oafLayer.getOptions(attributes))).to.deep.equals(options);
        });
    });

    describe("getStyleFunction", () => {
        it("getStyleFunction shall return a function", function () {
            sinon.stub(styleList, "returnStyleObject").returns(true);
            attributes.styleId = "styleId";

            const oafLayer = new Layer2dVectorOaf(attributes),
                styleFunction = oafLayer.getStyleFunction(attributes);

            expect(styleFunction).not.to.be.null;
            expect(typeof styleFunction).to.be.equals("function");
        });
    });

    describe("Use WebGL renderer", () => {
        it("Should create the layer with WebGL methods, if renderer: \"webgl\" is set", function () {
            const vectorLayer = new Layer2dVectorOaf({...attributes, renderer: "webgl"}),
                layer = vectorLayer.getLayer();

            expect(vectorLayer.isDisposed).to.equal(webgl.isDisposed);
            expect(vectorLayer.setIsSelected).to.equal(webgl.setIsSelected);
            expect(vectorLayer.hideAllFeatures).to.equal(webgl.hideAllFeatures);
            expect(vectorLayer.showAllFeatures).to.equal(webgl.showAllFeatures);
            expect(vectorLayer.showFeaturesByIds).to.equal(webgl.showFeaturesByIds);
            expect(vectorLayer.setStyle).to.equal(webgl.setStyle);
            expect(vectorLayer.source).to.equal(layer.getSource());
            expect(layer.get("isPointLayer")).to.not.be.undefined;
        });
    });

    describe("createLegend", () => {
        let createStyleSpy;

        beforeEach(() => {
            const styleObj = {
                styleId: "styleId",
                rules: []
            };

            attributes = {
                id: "id",
                version: "1.3.0"
            };
            sinon.stub(styleList, "returnStyleObject").returns(styleObj);
            createStyleSpy = sinon.spy(createStyle, "returnLegendByStyleId");
        });

        it("createLegend with legendURL", () => {
            attributes.legend = "legendUrl1";
            const layerWrapper = new Layer2dVectorOaf(attributes);

            layerWrapper.createLegend();
            expect(layerWrapper.getLegend()).to.be.deep.equals([attributes.legend]);
        });

        it("createLegend with legendURL as array", () => {
            attributes.legend = ["legendUrl1"];
            const layerWrapper = new Layer2dVectorOaf(attributes);

            layerWrapper.createLegend();
            expect(layerWrapper.getLegend()).to.be.deep.equals(attributes.legend);
        });

        it("createLegend with styleObject and legend true", () => {
            attributes.legend = true;
            const layerWrapper = new Layer2dVectorOaf(attributes);

            layerWrapper.createLegend();
            // call once on creating layer and second here
            expect(createStyleSpy.calledTwice).to.be.true;
            expect(getGeometryTypeFromOAFStub.calledTwice).to.be.true;
        });
    });
});
