import {expect} from "chai";
import Feature from "ol/Feature.js";
import Polygon from "ol/geom/Polygon";
import sinon from "sinon";
import mapMarker from "../../../js/mapMarker";

import actions from "../../../store/actionsMapsMarker";

const {
    placingPointMarker,
    placingPolygonMarker,
    removePointMarker,
    removePolygonMarker
} = actions;

describe("src_3_0_0/core/maps/store/actionsMapsMarker.js", () => {
    let dispatch,
        rootGetters;

    beforeEach(() => {
        dispatch = sinon.spy();
        rootGetters = {
            "Maps/mode": "2D"
        };

        sinon.stub(mapMarker, "addFeatureToMapMarkerLayer");
        sinon.stub(mapMarker, "removeMapMarker");
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("placingPointMarker", () => {
        it("place a point marker", () => {
            const value = [10, 10];

            placingPointMarker({dispatch, rootGetters}, value);

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("removePointMarker");

            expect(mapMarker.addFeatureToMapMarkerLayer.calledOnce).to.be.true;
            expect(mapMarker.addFeatureToMapMarkerLayer.firstCall.args[0]).to.equals("marker_point_layer");
            expect(mapMarker.addFeatureToMapMarkerLayer.firstCall.args[1] instanceof Feature).to.be.true;
        });
    });

    describe("placingPolygonMarker", () => {
        it("place a polygon marker", () => {
            const feature = new Feature({
                geometry: new Polygon([[[565086.1948534324, 5934664.461947621], [565657.6945448224, 5934738.54524095], [565625.9445619675, 5934357.545446689], [565234.3614400891, 5934346.962119071], [565086.1948534324, 5934664.461947621]]])
            });

            placingPolygonMarker({dispatch}, feature);

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("removePolygonMarker");

            expect(mapMarker.addFeatureToMapMarkerLayer.calledOnce).to.be.true;
            expect(mapMarker.addFeatureToMapMarkerLayer.firstCall.args[0]).to.equals("marker_polygon_layer");
            expect(mapMarker.addFeatureToMapMarkerLayer.firstCall.args[1] instanceof Feature).to.be.true;
        });
    });

    describe("removePointMarker", () => {
        it("remove a point marker", () => {
            removePointMarker();

            expect(mapMarker.removeMapMarker.calledOnce).to.be.true;
            expect(mapMarker.removeMapMarker.firstCall.args[0]).to.equals("marker_point_layer");
        });
    });

    describe("removePolygonMarker", () => {
        it("remove a polygon marker", () => {
            removePolygonMarker();

            expect(mapMarker.removeMapMarker.calledOnce).to.be.true;
            expect(mapMarker.removeMapMarker.firstCall.args[0]).to.equals("marker_polygon_layer");
        });
    });
});
