import Cluster from "ol/source/Cluster.js";
import {expect} from "chai";
import {WFS} from "ol/format.js";
import sinon from "sinon";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import Layer2dVectorWfs from "../../layer2dVectorWfs";

describe("src_3_0_0/core/layers/layer2dVectorWfs.js", () => {
    let attributes,
        warn;

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
            layers: "layer1,layer2",
            name: "wfsTestLayer",
            typ: "WFS"
        };
    });


    after(() => {
        sinon.restore();
    });

    describe("createLayer", () => {
        it("new Layer2dVectorWfs should create an layer with no warning", () => {
            const wfsLayer = new Layer2dVectorWfs({});

            expect(wfsLayer).not.to.be.undefined;
            expect(warn.notCalled).to.be.true;
        });

        it("createLayer shall create an ol.VectorLayer with source and style and WFS-format", function () {
            const wfsLayer = new Layer2dVectorWfs(attributes),
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
            const wfsLayer = new Layer2dVectorWfs(attributes),
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
            const wfsLayer = new Layer2dVectorWfs(localAttributes);

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
                altitudeMode: "clampToGround",
                name: "The name",
                typ: "WFS"
            };
        });

        it("should return the raw layer attributes", () => {
            const wfsLayer = new Layer2dVectorWfs(localAttributes);

            expect(wfsLayer.getLayerParams(localAttributes)).to.deep.equals({
                altitudeMode: "clampToGround",
                name: "The name",
                typ: "WFS"
            });
        });
    });

    describe("getOptions", () => {
        let options;

        beforeEach(() => {
            options = [
                "clusterGeometryFunction",
                "doNotLoadInitially",
                "featuresFilter",
                "loadingParams",
                "loadingStrategy",
                "onLoadingError",
                "wfsFilter"
            ];
        });

        it("should return the options that includes the correct keys", () => {
            const wfsLayer = new Layer2dVectorWfs(attributes);

            expect(Object.keys(wfsLayer.getOptions(attributes))).to.deep.equals(options);
        });
    });
});
