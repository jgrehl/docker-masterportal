import Cluster from "ol/source/Cluster.js";
import {expect} from "chai";
import Feature from "ol/Feature";
import {GeoJSON} from "ol/format.js";
import sinon from "sinon";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import Layer2dVectorGeojson from "../../layer2dVectorGeojson";

describe("src_3_0_0/core/layers/layer2dVectorGeojson.js", () => {
    let attributes,
        warn;

    before(() => {
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);

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
            name: "geojsonTestLayer",
            typ: "Geojson"
        };
    });


    after(() => {
        sinon.restore();
    });

    describe("createLayer", () => {
        it("new Layer2dVectorGeojson should create an layer with no warning", () => {
            const geojsonLayer = new Layer2dVectorGeojson({});

            expect(geojsonLayer).not.to.be.undefined;
            expect(warn.notCalled).to.be.true;
        });

        it("createLayer shall create an ol.VectorLayer with source and style and GeoJSON-format", function () {
            const geojsonLayer = new Layer2dVectorGeojson(attributes),
                layer = geojsonLayer.layer;

            expect(layer).to.be.an.instanceof(VectorLayer);
            expect(layer.getSource()).to.be.an.instanceof(VectorSource);
            expect(layer.getSource().getFormat()).to.be.an.instanceof(GeoJSON);
            expect(layer.get("id")).to.be.equals(attributes.id);
            expect(layer.get("name")).to.be.equals(attributes.name);
            expect(layer.get("gfiTheme")).to.be.equals(attributes.gfiTheme);
        });

        it("createLayer shall create an ol.VectorLayer with cluster-source", function () {
            attributes.clusterDistance = 60;
            const geojsonLayer = new Layer2dVectorGeojson(attributes),
                layer = geojsonLayer.layer;

            expect(layer).to.be.an.instanceof(VectorLayer);
            expect(layer.getSource()).to.be.an.instanceof(Cluster);
            expect(layer.getSource().getDistance()).to.be.equals(attributes.clusterDistance);
            expect(layer.getSource().getSource().getFormat()).to.be.an.instanceof(GeoJSON);
        });
    });

    describe("getRawLayerAttributes", () => {
        let localAttributes;

        beforeEach(() => {
            localAttributes = {
                clusterDistance: 10,
                geojson: ["feat", "ures"],
                id: "1234",
                url: "exmpale.url"
            };
        });

        it("should return the raw layer attributes", () => {
            const geojsonLayer = new Layer2dVectorGeojson(localAttributes);

            expect(geojsonLayer.getRawLayerAttributes(localAttributes)).to.deep.equals({
                clusterDistance: 10,
                features: ["feat", "ures"],
                id: "1234",
                url: "exmpale.url"
            });
        });
    });

    describe("getLayerParams", () => {
        let localAttributes;

        beforeEach(() => {
            localAttributes = {
                altitudeMode: "clampToGround",
                name: "The name",
                typ: "Geojson"
            };
        });

        it("should return the raw layer attributes", () => {
            const geojsonLayer = new Layer2dVectorGeojson(localAttributes);

            expect(geojsonLayer.getLayerParams(localAttributes)).to.deep.equals({
                altitudeMode: "clampToGround",
                name: "The name",
                typ: "Geojson"
            });
        });
    });

    describe("afterLoading", () => {
        it("should set id to features, if id === undefined", () => {
            const geojsonLayer = new Layer2dVectorGeojson(attributes),
                features = [
                    new Feature(),
                    new Feature()
                ];

            geojsonLayer.afterLoading(attributes, features);

            expect(features[0].getId()).to.equals("geojson-id-feature-id-0");
            expect(features[1].getId()).to.equals("geojson-id-feature-id-1");
        });
    });
});
