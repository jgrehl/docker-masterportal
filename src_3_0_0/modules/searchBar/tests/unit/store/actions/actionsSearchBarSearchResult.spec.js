import sinon from "sinon";
import {expect} from "chai";
import WKTUtil from "../../../../../../shared/js/utils/getWKTGeom";
import actions from "../../../../store/actions/actionsSearchBarSearchResult";

const {
    activateLayerInTopicTree,
    addLayerToTopicTree,
    highligtFeature,
    openGetFeatureInfo,
    openTopicTree,
    setMarker,
    zoomToResult
} = actions;

describe("src/modules/searchBar/store/actions/actionsSearchBarSearchResult.spec.js", () => {
    let dispatch,
        getters,
        zoomLevel;

    beforeEach(() => {
        zoomLevel = 5;

        dispatch = sinon.spy();
        getters = {
            zoomLevel: zoomLevel
        };
    });

    after(() => {
        sinon.restore();
    });

    describe("activateLayerInTopicTree", () => {
        it("activateLayerInTopicTree", () => {
            activateLayerInTopicTree();
        });
    });

    describe("addLayerToTopicTree", () => {
        it("addLayerToTopicTree", () => {
            addLayerToTopicTree();
        });
    });

    describe("highligtFeature", () => {
        it("highligtFeature shall dispatch 'placingPolygonMarker'", () => {
            const hit = {
                    geometryType: "MULTIPOLYGON",
                    coordinate: [
                        ["570374.959", "5936460.361", "570369.316", "5936458.5", "570364.706", "5936473.242", "570370.393", "5936474.993", "570374.959", "5936460.361"],
                        ["556622.043", "5935346.022", "556605.381", "5935347.509", "556583.860", "5935349.429", "556562.872", "5935351.302", "556562.855", "5935344.371", "556604.117", "5935340.974", "556622.043", "5935339.707", "556622.043", "5935346.022"]
                    ],
                    id: "im Verfahren331",
                    name: "HafenCity12-Hamburg-Altstadt48",
                    type: "im Verfahren"
                },
                feature = {
                    id: "feature"
                },
                stubGetWKTGeom = sinon.stub(WKTUtil, "getWKTGeom").returns(feature);

            highligtFeature({dispatch}, {hit});
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("MapMarker/placingPolygonMarker");
            expect(dispatch.firstCall.args[1]).to.be.deep.equals(feature);
            expect(stubGetWKTGeom.calledOnce).to.be.true;
            expect(stubGetWKTGeom.firstCall.args[0]).to.be.deep.equals(hit);
        });
    });

    describe("openGetFeatureInfo", () => {
        it("openGetFeatureInfo", () => {
            openGetFeatureInfo();
        });
    });

    describe("openTopicTree", () => {
        it("openTopicTree", () => {
            openTopicTree();
        });
    });

    describe("setMarker", () => {
        it("sets the MapMarker with coordinates as string", () => {
            const coordinates = ["1234", "65432"],
                payload = [1234, 65432];

            setMarker({dispatch}, coordinates);

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("Maps/placingPointMarker");
            expect(dispatch.firstCall.args[1]).to.be.deep.equals(payload);
        });
        it("sets the MapMarker with coordinates as number", () => {
            const coordinates = [1234, 65432],
                payload = [1234, 65432];

            setMarker({dispatch}, coordinates);

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("Maps/placingPointMarker");
            expect(dispatch.firstCall.args[1]).to.be.deep.equals(payload);
        });
    });

    describe("zoomToResult", () => {
        it("zoomToResult with coordinates ", () => {
            const coordinates = [1234, 65432],
                payload = {
                    coordinates,
                    zoom: getters.zoomLevel
                };

            zoomToResult({dispatch, getters}, {coordinates});

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("Maps/zoomToCoordinates");
            expect(dispatch.firstCall.args[1]).to.be.deep.equals(payload);
        });
    });
});
