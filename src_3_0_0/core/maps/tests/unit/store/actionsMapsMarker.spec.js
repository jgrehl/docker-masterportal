import {expect} from "chai";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import sinon from "sinon";

import actions from "../../../store/actionsMapsMarker";
import mapMarker from "../../../js/mapMarker";

const {
    changeMarkerStyle,
    placingPointMarker,
    placingPolygonMarker,
    removePointMarker,
    removePolygonMarker,
    rotatePointMarker
} = actions;

describe("src_3_0_0/core/maps/store/actionsMapsMarker.js", () => {
    let dispatch,
        state;

    beforeEach(() => {
        dispatch = sinon.spy();

        state = {
            mode: "2D"
        };

        sinon.stub(mapMarker, "addFeatureToMapMarkerLayer");
        sinon.stub(mapMarker, "getMapmarkerLayerById");
        sinon.stub(mapMarker, "removeMapMarker");
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("changeMarkerStyle", () => {
        it("change the styleId of the marker", () => {
            const markerId = "marker",
                styleId = "style";

            changeMarkerStyle({dispatch}, {markerId, styleId});

            expect(dispatch.notCalled).to.be.true;

            expect(mapMarker.getMapmarkerLayerById.calledOnce).to.be.true;
            expect(mapMarker.getMapmarkerLayerById.firstCall.args[0]).to.equals(markerId);
        });
    });

    describe("placingPointMarker", () => {
        it("place a point marker, if position is an array", () => {
            const position = [10, 10];

            placingPointMarker({dispatch}, position);

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("removePointMarker");

            expect(mapMarker.addFeatureToMapMarkerLayer.calledOnce).to.be.true;
            expect(mapMarker.addFeatureToMapMarkerLayer.firstCall.args[0]).to.equals("marker_point_layer");
            expect(mapMarker.addFeatureToMapMarkerLayer.firstCall.args[1] instanceof Feature).to.be.true;
        });

        it("place a point marker, if position is an object", () => {
            const position = {
                coordinates: [10, 10]
            };

            placingPointMarker({dispatch}, position);

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("removePointMarker");

            expect(mapMarker.addFeatureToMapMarkerLayer.calledOnce).to.be.true;
            expect(mapMarker.addFeatureToMapMarkerLayer.firstCall.args[0]).to.equals("marker_point_layer");
            expect(mapMarker.addFeatureToMapMarkerLayer.firstCall.args[1] instanceof Feature).to.be.true;
        });

        it("place and rotate a point marker, if position is an object", () => {
            const position = {
                coordinates: [10, 10],
                rotation: 199.123
            };

            placingPointMarker({dispatch}, position);

            expect(dispatch.calledTwice).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("removePointMarker");
            expect(dispatch.secondCall.args[0]).to.equals("rotatePointMarker");
            expect(dispatch.secondCall.args[1]).to.deep.include({position});

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
    describe("rotatePointMarker", () => {
        beforeEach(() => {
            state = {
                mode: "3D"
            };
        });

        it("should rotate pointmarker and start also rotation in 3D", () => {
            const feature = {
                    rotation: 0,
                    getStyle: () => {
                        return {
                            getImage: () => {
                                return {
                                    setRotation: (rotation) => {
                                        feature.rotation = rotation;
                                    }
                                };
                            }
                        };
                    }
                },
                position = {
                    coordinates: [10, 10],
                    rotation: 199.123
                };

            rotatePointMarker({dispatch, state}, {feature, position});

            expect(feature.rotation).to.equals(3.4753519664486685);
            expect(dispatch.calledOnce).to.be.true;
        });
    });
});
