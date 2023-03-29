import {expect} from "chai";
import sinon from "sinon";

import highlightFeaturesByAttribute from "../../../js/highlightFeaturesByAttribute";
import mapUrlParams from "../../../js/mapUrlParams";
import store from "../../../../../app-store";

describe("src_3_0_0/core/maps/js/mapUrlParams.js", () => {
    let dispatchCalls = {},
        error;

    beforeEach(() => {
        dispatchCalls = {};

        sinon.stub(console, "error").callsFake(error);

        store.dispatch = (arg1, arg2) => {
            dispatchCalls[arg1] = arg2 !== undefined ? arg2 : "called";
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("setMapAttributes", () =>{
        it("should set map attributes for 2D Map", () => {
            const params = {
                MAPS: "{\"center\":[571278.4429867676,5938534.397334521],\"mode\":\"2D\",\"zoom\":7}"
            };

            mapUrlParams.setMapAttributes(params);

            expect(Object.keys(dispatchCalls).length).to.equals(3);
            expect(dispatchCalls["Maps/setCamera"]).to.deep.equals({
                altitude: undefined,
                heading: undefined,
                tilt: undefined
            });
            expect(dispatchCalls["Maps/changeMapMode"]).to.equals("2D");
            expect(dispatchCalls["Maps/setView"]).to.deep.equals({
                center: [571278.4429867676, 5938534.397334521],
                rotation: undefined,
                zoom: 7
            });
        });

        it("should set map attributes for 3D map", () => {
            const params = {
                MAPS: "{\"center\":[571278.4429867676,5938534.397334521],\"mode\":\"3D\",\"zoom\":7,\"altitude\":127,\"heading\":-1.2502079000000208,\"tilt\":45}"
            };

            mapUrlParams.setMapAttributes(params);

            expect(Object.keys(dispatchCalls).length).to.equals(3);
            expect(dispatchCalls["Maps/setCamera"]).to.deep.equals({
                altitude: 127,
                heading: -1.2502079000000208,
                tilt: 45
            });
            expect(dispatchCalls["Maps/changeMapMode"]).to.equals("3D");
            expect(dispatchCalls["Maps/setView"]).to.deep.equals({
                center: [571278.4429867676, 5938534.397334521],
                rotation: undefined,
                zoom: 7
            });
        });
    });

    describe("highlightFeature", () => {
        it("should highlight a feature with HIGHLIGHTFEATURE", () => {
            const params = {
                HIGHLIGHTFEATURE: "1711,DE.HH.UP_GESUNDHEIT_KRANKENHAEUSER_2"
            };

            mapUrlParams.highlightFeature(params);

            expect(Object.keys(dispatchCalls).length).to.equals(1);
            expect(dispatchCalls["Maps/highlightFeature"]).to.deep.equals({
                layerIdAndFeatureId: ["1711", "DE.HH.UP_GESUNDHEIT_KRANKENHAEUSER_2"],
                type: "viaLayerIdAndFeatureId"
            });
        });

        it("should highlight a feature with MAP/HIGHLIGHTFEATURE", () => {
            const params = {
                "MAP/HIGHLIGHTFEATURE": "1711,DE.HH.UP_GESUNDHEIT_KRANKENHAEUSER_2"
            };

            mapUrlParams.highlightFeature(params);

            expect(Object.keys(dispatchCalls).length).to.equals(1);
            expect(dispatchCalls["Maps/highlightFeature"]).to.deep.equals({
                layerIdAndFeatureId: ["1711", "DE.HH.UP_GESUNDHEIT_KRANKENHAEUSER_2"],
                type: "viaLayerIdAndFeatureId"
            });
        });
    });

    describe("highlightFeaturesByAttributes", () => {
        let highlightFeaturesByAttributeStub;

        beforeEach(() => {
            highlightFeaturesByAttributeStub = sinon.stub(highlightFeaturesByAttribute, "highlightFeaturesByAttribute");
        });

        it("should highlight a feature with HIGHLIGHTFEATURESBYATTRIBUTE", () => {
            const params = {
                ATTRIBUTENAME: "bezirk",
                ATTRIBUTEQUERY: "IsLike",
                ATTRIBUTEVALUE: "Altona",
                HIGHLIGHTFEATURESBYATTRIBUTE: "123",
                WFSID: "8712"
            };

            mapUrlParams.highlightFeaturesByAttributes(params);

            expect(highlightFeaturesByAttributeStub.calledOnce).to.be.true;
            expect(highlightFeaturesByAttributeStub.firstCall.args[0]).to.equals(store.dispatch);
            expect(highlightFeaturesByAttributeStub.firstCall.args[1]).to.equals(store.getters);
            expect(highlightFeaturesByAttributeStub.firstCall.args[2]).to.equals("8712");
            expect(highlightFeaturesByAttributeStub.firstCall.args[3]).to.equals("bezirk");
            expect(highlightFeaturesByAttributeStub.firstCall.args[4]).to.equals("Altona");
            expect(highlightFeaturesByAttributeStub.firstCall.args[5]).to.equals("IsLike");
        });

        it("should highlight a feature with API/HIGHLIGHTFEATURESBYATTRIBUTE", () => {
            const params = {
                ATTRIBUTENAME: "bezirk",
                ATTRIBUTEQUERY: "IsLike",
                ATTRIBUTEVALUE: "Altona",
                "API/HIGHLIGHTFEATURESBYATTRIBUTE": "123",
                WFSID: "8712"
            };

            mapUrlParams.highlightFeaturesByAttributes(params);

            expect(highlightFeaturesByAttributeStub.calledOnce).to.be.true;
            expect(highlightFeaturesByAttributeStub.firstCall.args[0]).to.equals(store.dispatch);
            expect(highlightFeaturesByAttributeStub.firstCall.args[1]).to.equals(store.getters);
            expect(highlightFeaturesByAttributeStub.firstCall.args[2]).to.equals("8712");
            expect(highlightFeaturesByAttributeStub.firstCall.args[3]).to.equals("bezirk");
            expect(highlightFeaturesByAttributeStub.firstCall.args[4]).to.equals("Altona");
            expect(highlightFeaturesByAttributeStub.firstCall.args[5]).to.equals("IsLike");
        });
    });

    describe("setMapMarker", () => {
        it("should set coordinates to mapMarker with MARKER", () => {
            const params = {
                MARKER: "565874,5934140"
            };

            mapUrlParams.setMapMarker(params);

            expect(Object.keys(dispatchCalls).length).to.equals(1);
            expect(dispatchCalls["Maps/placingPointMarker"]).to.deep.equals(["565874", "5934140"]);
        });

        it("should set coordinates to mapMarker with MAPMARKER", () => {
            const params = {
                MAPMARKER: "[565874, 5934140]"
            };

            mapUrlParams.setMapMarker(params);

            expect(Object.keys(dispatchCalls).length).to.equals(1);
            expect(dispatchCalls["Maps/placingPointMarker"]).to.deep.equals([565874, 5934140]);
        });
    });

    describe("setCamera", () => {
        it("should set camera params for 3D map", () => {
            const params = {
                ALTITUDE: "127",
                HEADING: "-1.2502079000000208",
                TILT: "45"
            };

            mapUrlParams.setCamera(params);

            expect(Object.keys(dispatchCalls).length).to.equals(1);
            expect(dispatchCalls["Maps/setCamera"]).to.deep.equals({
                altitude: "127",
                heading: "-1.2502079000000208",
                tilt: "45"
            });
        });
    });

    describe("setMode", () => {
        it("should set map mode to 2D", () => {
            const params = {
                "MAP/MAPMODE": "2d"
            };

            mapUrlParams.setMode(params);

            expect(Object.keys(dispatchCalls).length).to.equals(1);
            expect(dispatchCalls["Maps/changeMapMode"]).to.equals("2D");
        });

        it("should set map mode to 3D", () => {
            const params = {
                MAP: "3d"
            };

            mapUrlParams.setMode(params);

            expect(Object.keys(dispatchCalls).length).to.equals(1);
            expect(dispatchCalls["Maps/changeMapMode"]).to.equals("3D");
        });
    });

    describe("setView", () => {
        it("set ZOOMLEVEL and CENTER to map view", () => {
            const params = {
                CENTER: "553925,5931898",
                ZOOMLEVEL: 0
            };

            mapUrlParams.setView(params);

            expect(Object.keys(dispatchCalls).length).to.equals(1);
            expect(dispatchCalls["Maps/setView"]).to.deep.equals({
                center: ["553925", "5931898"],
                rotation: undefined,
                zoom: 0
            });
        });

        it("set MAP/ZOOMLEVEL and MAP/CENTER to map view", () => {
            const params = {
                "MAP/CENTER": "553925,5931898",
                "MAP/ZOOMLEVEL": 0
            };

            mapUrlParams.setView(params);

            expect(Object.keys(dispatchCalls).length).to.equals(1);
            expect(dispatchCalls["Maps/setView"]).to.deep.equals({
                center: ["553925", "5931898"],
                rotation: undefined,
                zoom: 0
            });
        });
    });

    describe("zoomToFeatures", () => {
        it("should zoom to features with param ZOOMTOGEOMETRY", () => {
            const params = {
                ZOOMTOGEOMETRY: "bergedorf"
            };

            mapUrlParams.zoomToFeatures(params);

            expect(Object.keys(dispatchCalls).length).to.equals(1);
            expect(dispatchCalls["Maps/zoomToFeatures"]).to.deep.equals({
                ZOOMTOFEATUREID: undefined,
                ZOOMTOGEOMETRY: "bergedorf"
            });
        });

        it("should zoom to features with param BEZIRK", () => {
            const params = {
                BEZIRK: "bergedorf"
            };

            mapUrlParams.zoomToFeatures(params);

            expect(Object.keys(dispatchCalls).length).to.equals(1);
            expect(dispatchCalls["Maps/zoomToFeatures"]).to.deep.equals({
                ZOOMTOFEATUREID: undefined,
                ZOOMTOGEOMETRY: "bergedorf"
            });
        });

        it("should zoom to features with param MAP/ZOOMTOGEOMETRY", () => {
            const params = {
                "MAP/ZOOMTOGEOMETRY": "bergedorf"
            };

            mapUrlParams.zoomToFeatures(params);

            expect(Object.keys(dispatchCalls).length).to.equals(1);
            expect(dispatchCalls["Maps/zoomToFeatures"]).to.deep.equals({
                ZOOMTOFEATUREID: undefined,
                ZOOMTOGEOMETRY: "bergedorf"
            });
        });

        it("should zoom to feature id with param ZOOMTOFEATUREID", () => {
            const params = {
                ZOOMTOFEATUREID: "18,26"
            };

            mapUrlParams.zoomToFeatures(params);

            expect(Object.keys(dispatchCalls).length).to.equals(1);
            expect(dispatchCalls["Maps/zoomToFeatures"]).to.deep.equals({
                ZOOMTOFEATUREID: "18,26",
                ZOOMTOGEOMETRY: undefined
            });
        });

        it("should zoom to feature id with param FEATUREID", () => {
            const params = {
                FEATUREID: "18,26"
            };

            mapUrlParams.zoomToFeatures(params);

            expect(Object.keys(dispatchCalls).length).to.equals(1);
            expect(dispatchCalls["Maps/zoomToFeatures"]).to.deep.equals({
                ZOOMTOFEATUREID: "18,26",
                ZOOMTOGEOMETRY: undefined
            });
        });

        it("should zoom to feature id with param MAP/ZOOMTOFEATUREID", () => {
            const params = {
                "MAP/ZOOMTOFEATUREID": "18,26"
            };

            mapUrlParams.zoomToFeatures(params);

            expect(Object.keys(dispatchCalls).length).to.equals(1);
            expect(dispatchCalls["Maps/zoomToFeatures"]).to.deep.equals({
                ZOOMTOFEATUREID: "18,26",
                ZOOMTOGEOMETRY: undefined
            });
        });
    });

    describe("zoomToProjExtent", () => {
        beforeEach(() => {
            store.getters = {
                "Maps/projectionCode": "EPSG:25832"
            };
        });

        it("should zoomt o an extent with params PROJECTION and ZOOMTOEXTENT", () => {
            const params = {
                PROJECTION: "EPSG:4326",
                ZOOMTOEXTENT: "10.0822,53.6458,10.1781,53.8003"
            };

            mapUrlParams.zoomToProjExtent(params);

            expect(Object.keys(dispatchCalls).length).to.equals(1);
            expect(dispatchCalls["Maps/zoomToProjExtent"]).to.deep.equals({
                extent: ["10.0822", "53.6458", "10.1781", "53.8003"],
                options: {duration: 0},
                projection: "EPSG:4326"
            });
        });

        it("should zoom to an extent with params MAP/PROJECTION and MAP/ZOOMTOEXTENT", () => {
            const params = {
                "MAP/PROJECTION": "EPSG:4326",
                "MAP/ZOOMTOEXTENT": "10.0822,53.6458,10.1781,53.8003"
            };

            mapUrlParams.zoomToProjExtent(params);

            expect(Object.keys(dispatchCalls).length).to.equals(1);
            expect(dispatchCalls["Maps/zoomToProjExtent"]).to.deep.equals({
                extent: ["10.0822", "53.6458", "10.1781", "53.8003"],
                options: {duration: 0},
                projection: "EPSG:4326"
            });
        });

        it("should zoom to an extent with param ZOOMTOEXTENT", () => {
            const params = {
                ZOOMTOEXTENT: "510000,5850000,625000,6000000"
            };

            mapUrlParams.zoomToProjExtent(params);

            expect(Object.keys(dispatchCalls).length).to.equals(1);
            expect(dispatchCalls["Maps/zoomToProjExtent"]).to.deep.equals({
                extent: ["510000", "5850000", "625000", "6000000"],
                options: {duration: 0},
                projection: "EPSG:25832"
            });
        });
    });
});
