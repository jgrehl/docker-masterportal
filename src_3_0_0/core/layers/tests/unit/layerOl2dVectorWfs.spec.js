import Cluster from "ol/source/Cluster.js";
import {expect} from "chai";
import {WFS} from "ol/format.js";
import sinon from "sinon";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import LayerOl2dVectorWfs from "../../layerOl2dVectorWfs";

describe("src_3_0_0/core/layers/layerOl2dVectorWfs.js", () => {
    let attributes,
        error,
        warn;

    before(() => {
        warn = sinon.spy();
        error = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);
        sinon.stub(console, "error").callsFake(error);

        mapCollection.clear();
        const map = {
            id: "ol",
            mode: "2D"
        };

        mapCollection.addMap(map, "2D");
    });

    beforeEach(() => {
        attributes = {
            id: "id",
            layers: "layer1,layer2",
            name: "wfsTestLayer",
            typ: "WFS"
        };
    });


    after(() => {
        sinon.restore();
    });

    describe("createLayer", () => {
        it("new LayerOl2dVectorWfs should create an layer with no warning", () => {
            const wfsLayer = new LayerOl2dVectorWfs({});

            expect(wfsLayer).not.to.be.undefined;
            expect(warn.notCalled).to.be.true;
        });

        it("createLayer shall create an ol.VectorLayer with source and style and WFS-format", function () {
            const wfsLayer = new LayerOl2dVectorWfs(attributes),
                layer = wfsLayer.layer;

            expect(layer).to.be.an.instanceof(VectorLayer);
            expect(layer.getSource()).to.be.an.instanceof(VectorSource);
            expect(layer.getSource().getFormat()).to.be.an.instanceof(WFS);
            expect(typeof layer.getStyleFunction()).to.be.equals("function");
            expect(layer.get("id")).to.be.equals(attributes.id);
            expect(layer.get("name")).to.be.equals(attributes.name);
            expect(layer.get("gfiTheme")).to.be.equals(attributes.gfiTheme);
        });

        it("createLayer shall create an ol.VectorLayer with cluster-source", function () {
            attributes.clusterDistance = 60;
            const wfsLayer = new LayerOl2dVectorWfs(attributes),
                layer = wfsLayer.layer;

            expect(layer).to.be.an.instanceof(VectorLayer);
            expect(layer.getSource()).to.be.an.instanceof(Cluster);
            expect(layer.getSource().getDistance()).to.be.equals(attributes.clusterDistance);
            expect(layer.getSource().getSource().getFormat()).to.be.an.instanceof(WFS);
            expect(typeof layer.getStyleFunction()).to.be.equals("function");
        });
    });

    describe("getRawLayerAttributes", () => {
        let localAttributes;

        beforeEach(() => {
            localAttributes = {
                clusterDistance: 10,
                featureNS: "featureNS",
                featureType: "featureType",
                id: "1234",
                url: "exmpale.url",
                version: "2.0.0"
            };
        });

        it("should return the raw layer attributes", () => {
            const wfsLayer = new LayerOl2dVectorWfs(localAttributes);

            expect(wfsLayer.getRawLayerAttributes(localAttributes)).to.deep.equals({
                clusterDistance: 10,
                featureNS: "featureNS",
                featureType: "featureType",
                id: "1234",
                url: "exmpale.url",
                version: "2.0.0"
            });
        });
    });

    describe("getLayerParams", () => {
        let localAttributes;

        beforeEach(() => {
            localAttributes = {
                name: "The name",
                typ: "WFS"
            };
        });

        it("should return the raw layer attributes", () => {
            const wfsLayer = new LayerOl2dVectorWfs(localAttributes);

            expect(wfsLayer.getLayerParams(localAttributes)).to.deep.equals({
                name: "The name",
                typ: "WFS"
            });
        });
    });

    describe("clusterGeometryFunction", () => {
        it("should return the geometry of a feature", () => {
            const wfsLayer = new LayerOl2dVectorWfs(attributes),
                feature = {
                    get: () => sinon.stub(),
                    getGeometry: () => "Point"
                };

            expect(wfsLayer.clusterGeometryFunction(feature)).to.equals("Point");
        });
    });

    describe("featuresFilter", () => {
        it("featuresFilter shall filter getGeometry", function () {
            const wfsLayer = new LayerOl2dVectorWfs(attributes),
                features = [{
                    id: "1",
                    getGeometry: () => sinon.stub()
                },
                {
                    id: "2",
                    getGeometry: () => undefined
                }];

            expect(wfsLayer.featuresFilter(attributes, features).length).to.be.equals(1);

        });

        it("featuresFilter shall filter bboxGeometry", function () {
            attributes.bboxGeometry = {
                intersectsExtent: (extent) => {
                    if (extent.includes("1")) {
                        return true;
                    }
                    return false;
                },
                getExtent: () => ["1"]
            };
            const wfsLayer = new LayerOl2dVectorWfs(attributes),
                features = [{
                    id: "1",
                    getGeometry: () => {
                        return {
                            getExtent: () => ["1"]
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
                            getExtent: () => ["2"]
                        };
                    }
                }],
                wfsFeatureFilter = wfsLayer.featuresFilter(attributes, features);

            expect(wfsFeatureFilter.length).to.be.equals(1);
            expect(wfsFeatureFilter[0].id).to.be.equals("1");
        });
    });

    describe("loadingParams", () => {
        it("should return loading params", () => {
            const wfsLayer = new LayerOl2dVectorWfs(attributes);

            expect(wfsLayer.loadingParams(attributes)).to.deep.equals({
                xhrParameters: undefined,
                propertyname: "",
                bbox: undefined
            });
        });
    });

    describe("propertyNames", () => {
        it("should return an empty Stirng if no propertyNames are configured", () => {
            const wfsLayer = new LayerOl2dVectorWfs(attributes);

            expect(wfsLayer.propertyNames(attributes)).to.equals("");
        });

        it("should return all strings separated by comma", () => {
            Object.assign(attributes, {propertyNames: ["ab", "cd"]});
            const wfsLayer = new LayerOl2dVectorWfs(attributes);

            expect(wfsLayer.propertyNames(attributes)).to.equals("ab,cd");
        });
    });

    describe("onLoadingError", () => {
        it("should print a console.error", () => {
            const wfsLayer = new LayerOl2dVectorWfs(attributes);

            wfsLayer.onLoadingError("The error message");

            expect(error.calledOnce).to.be.true;
        });
    });
});
