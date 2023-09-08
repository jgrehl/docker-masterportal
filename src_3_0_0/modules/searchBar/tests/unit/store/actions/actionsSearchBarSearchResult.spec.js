import sinon from "sinon";
import {expect} from "chai";
import rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";
import WKTUtil from "../../../../../../shared/js/utils/getWKTGeom";
import wmsGFIUtil from "../../../../../../shared/js/utils/getWmsFeaturesByMimeType";
import actions from "../../../../store/actions/actionsSearchBarSearchResult";

const {
    activateLayerInTopicTree,
    addLayerToTopicTree,
    highlightFeature,
    openGetFeatureInfo,
    setMarker,
    showInTree,
    zoomToResult
} = actions;

describe("src/modules/searchBar/store/actions/actionsSearchBarSearchResult.spec.js", () => {
    let dispatch,
        commit,
        getters,
        zoomLevel;

    beforeEach(() => {
        zoomLevel = 5;

        dispatch = sinon.spy();
        commit = sinon.spy();
        getters = {
            zoomLevel: zoomLevel
        };
    });

    after(() => {
        sinon.restore();
    });

    describe("activateLayerInTopicTree", () => {
        it("should activate a layer in topic tree", () => {
            const layerId = "123",
                rootGetters = {
                    layerConfigById: sinon.stub().returns(true)
                };

            activateLayerInTopicTree({dispatch, rootGetters}, {layerId});

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("replaceByIdInLayerConfig");
            expect(dispatch.firstCall.args[1]).to.be.deep.equals({
                layerConfigs: [{
                    id: layerId,
                    layer: {
                        id: layerId,
                        visibility: true,
                        showInLayerTree: true
                    }
                }]
            });
        });
    });

    describe("addLayerToTopicTree", () => {
        it("should add a layer to topic tree", () => {
            const layerId = "123",
                source = {
                    id: layerId,
                    abc: "abc",
                    datasets: []
                },
                added = true,
                rootGetters = {
                    layerConfigById: sinon.stub().returns(false)
                };

            dispatch = sinon.stub().resolves(added);
            addLayerToTopicTree({dispatch, rootGetters}, {layerId, source});

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("addLayerToLayerConfig");
            expect(dispatch.firstCall.args[1]).to.be.deep.equals({
                layerConfig: {
                    id: layerId,
                    abc: "abc",
                    datasets: [],
                    showInLayerTree: true,
                    type: "layer",
                    visibility: true
                },
                parentKey: "Fachdaten"
            });
        });
    });

    describe("showInTree", () => {
        it("should call showLayer", () => {
            const layerId = "123",
                rootGetters = {
                    layerConfigById: () => true
                };

            showInTree({dispatch, rootGetters}, {layerId});

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("Modules/LayerSelection/showLayer");
            expect(dispatch.firstCall.args[1]).to.be.deep.equals({
                layerId: "123"
            });
        });

        it("should call addLayerToTopicTree and showLayer", () => {
            const layerId = "123",
                source = {
                    id: layerId,
                    abc: "abc",
                    datasets: []
                },
                rootGetters = {
                    layerConfigById: () => false
                };

            sinon.stub(rawLayerList, "getLayerWhere").returns(source);

            showInTree({dispatch, rootGetters}, {layerId});

            expect(dispatch.calledTwice).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("addLayerToTopicTree");
            expect(dispatch.firstCall.args[1]).to.be.deep.equals({
                layerId: "123",
                source,
                showInLayerTree: false,
                visibility: false
            }
            );
            expect(dispatch.secondCall.args[0]).to.equals("Modules/LayerSelection/showLayer");
            expect(dispatch.secondCall.args[1]).to.be.deep.equals({
                layerId: "123"
            });
        });
    });

    describe("highlightFeature", () => {
        it("highlightFeature shall dispatch 'placingPolygonMarker'", () => {
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

            highlightFeature({dispatch}, {hit});
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("Maps/placingPolygonMarker");
            expect(dispatch.firstCall.args[1]).to.be.deep.equals(feature);
            expect(stubGetWKTGeom.calledOnce).to.be.true;
            expect(stubGetWKTGeom.firstCall.args[0]).to.be.deep.equals(hit);
        });
    });

    describe("openGetFeatureInfo", () => {
        it("openGetFeatureInfo shall commit 'setGfiFeatures'", () => {
            const feature = {
                    id: "feature"
                },
                layer = {
                    id: "layer"
                },
                gfiFeature = {
                    getId: () => feature.id,
                    getLayerId: () => layer.id
                },
                stubCreateGfiFeature = sinon.stub(wmsGFIUtil, "createGfiFeature").returns(gfiFeature);

            openGetFeatureInfo({commit}, {feature, layer});
            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("Modules/GetFeatureInfo/setGfiFeatures");
            expect(commit.firstCall.args[1]).to.be.deep.equals([gfiFeature]);
            expect(stubCreateGfiFeature.calledOnce).to.be.true;
            expect(stubCreateGfiFeature.firstCall.args[0]).to.be.deep.equals(layer);
            expect(stubCreateGfiFeature.firstCall.args[1]).to.be.equals("");
            expect(stubCreateGfiFeature.firstCall.args[2]).to.be.deep.equals(feature);
        });
    });

    describe("setMarker", () => {
        it("sets the MapMarker with coordinates", () => {
            const coordinates = [1234, 65432],
                payload = [1234, 65432];

            setMarker({dispatch}, {coordinates});

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("Maps/placingPointMarker");
            expect(dispatch.firstCall.args[1]).to.be.deep.equals(payload);
        });
    });

    describe("zoomToResult", () => {
        it("zoomToResult with coordinates ", () => {
            const coordinates = [1234, 65432],
                payload = {
                    center: coordinates,
                    zoom: getters.zoomLevel
                };

            zoomToResult({dispatch, getters}, {coordinates});

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("Maps/zoomToCoordinates");
            expect(dispatch.firstCall.args[1]).to.be.deep.equals(payload);
        });
    });

    // todo addLayerToTopicTree activateLayerInTopicTree
});
