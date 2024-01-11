import {expect} from "chai";
import sinon from "sinon";
import highlightFeature from "../../../js/highlightFeature";
import {Style, Fill, Stroke, Circle} from "ol/style.js";

describe("src_3_0_0/core/maps/js/highlightFeature.js", () => {
    describe.only("highlightFeature", () => {
        const stroke = new Stroke({
                color: "#3399CC",
                width: 1.25
            }),
            fill = new Fill({}),
            style = new Style({
                image: new Circle({
                    fill: fill,
                    stroke: stroke,
                    radius: 5
                }),
                fill: fill,
                stroke: stroke
            }),
            featurePoint = {
                id: "test",
                getGeometry: () => sinon.stub({
                    getType: () => "Point",
                    getCoordinates: () => [100, 100]
                }),
                getProperties: () => [],
                get: () => sinon.stub(),
                getStyle: () => style,
                setStyle: () => sinon.stub()
            },
            layer = {
                id: "id",
                getSource: () =>{
                    return {
                        getFeatureById: sinon.stub.returns(featurePoint),
                        getFeatures: sinon.stub.returns([featurePoint])
                    };
                },
                getLayerById: () => sinon.stub.returns(layer)
            },
            highlightObjectPoint = {
                styleId: "defaultHighlightFeaturesPoint",
                type: "increase",
                feature: featurePoint
            };

        let commit,
            dispatch,
            getters,
            increaseFeatureSpy;

        beforeEach(() => {
            commit = sinon.spy();
            dispatch = sinon.spy();
            increaseFeatureSpy = sinon.spy(highlightFeature, "increaseFeature");
        });

        afterEach(() => {
            sinon.restore();
        });

        it("tests highlightFeature with type 'increase'", () => {

            highlightFeature.highlightFeature({commit, dispatch, getters}, highlightObjectPoint);
            expect(increaseFeatureSpy.called).to.be.true;
            expect(commit.called).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("Maps/addHighlightedFeature");
            expect(commit.firstCall.args[1]).to.equals(featurePoint);
            expect(commit.secondCall.args[0]).to.equals("Maps/addHighlightedFeatureStyle");
            expect(commit.secondCall.args[1]).to.equals(style);
        });
    });
});
