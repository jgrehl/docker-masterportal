import {expect} from "chai";
import sinon from "sinon";
import {Style, Fill, Stroke, Circle} from "ol/style.js";
import VectorSource from "ol/source/Vector.js";
import highlightFeature from "../../../js/highlightFeature";
import layerCollection from "../../../../layers/js/layerCollection";

describe("src_3_0_0/core/maps/js/highlightFeature.js", () => {
    describe("highlightFeature", () => {
        const stroke = new Stroke({}),
            fill = new Fill({}),
            stylePoint = new Style({
                image: new Circle({
                    fill: fill,
                    stroke: stroke,
                    radius: 5
                })
            }),
            styleGeoms = new Style({
                stroke: stroke,
                fill: fill
            }),
            featurePoint = {
                id: "testPunkt",
                getGeometry: () => sinon.stub(),
                getStyle: () => stylePoint,
                setStyle: () => sinon.stub()
            },
            featurePolygon = {
                id: "testPolygon",
                getGeometry: () => sinon.stub(),
                getStyle: () => styleGeoms,
                setStyle: () => sinon.stub()
            },
            featureLine = {
                id: "testLine",
                getGeometry: () => sinon.stub(),
                getStyle: () => styleGeoms,
                setStyle: () => sinon.stub()
            },
            layerSource = new VectorSource({
                getFeatureById: () => sinon.stub.returns(featurePolygon),
                getFeatures: () => sinon.stub.returns([featurePolygon])
            }),
            layerPolygon = {
                id: "id",
                layerSource: sinon.stub().returns(layerSource),
                getLayerById: () => sinon.stub.returns(layerPolygon)
            },
            highlightObjectPoint = {
                styleId: "defaultHighlightFeaturesPoint",
                type: "increase",
                feature: featurePoint
            },
            highlightObjectViaId = {
                styleId: "defaultHighlightFeaturesPoint",
                layerIdAndFeatureId: [layerPolygon.id, featurePolygon.id],
                type: "viaLayerIdAndFeatureId",
                feature: featurePolygon
            },
            polygonWithoutHighlightStyle = {
                styleId: "defaultHighlightFeaturesPolygon",
                type: "highlightPolygon",
                feature: featurePolygon
            },
            polygonWithHighlightStyle = {...polygonWithoutHighlightStyle, highlightStyle: {styleGeoms}},
            lineWithoutHighlightStyle = {
                styleId: "defaultHighlightFeaturesLine",
                type: "highlightLine",
                feature: featureLine
            },
            lineWithHighlightStyle = {...lineWithoutHighlightStyle, highlightStyle: {styleGeoms}};

        let commit,
            dispatch,
            getters,
            increaseFeatureSpy,
            highlightViaParametricUrlSpy,
            getHighlightFeatureSpy,
            highlightPolygonSpy,
            highlightLineSpy;


        beforeEach(() => {
            commit = sinon.spy();
            dispatch = sinon.spy();
            increaseFeatureSpy = sinon.spy(highlightFeature, "increaseFeature");
            highlightViaParametricUrlSpy = sinon.spy(highlightFeature, "highlightViaParametricUrl");
            getHighlightFeatureSpy = sinon.spy(highlightFeature, "getHighlightFeature");
            highlightPolygonSpy = sinon.spy(highlightFeature, "highlightPolygon");
            highlightLineSpy = sinon.spy(highlightFeature, "highlightLine");
        });

        afterEach(() => {
            sinon.restore();
            sinon.stub().resetHistory();
        });

        it("tests type 'increase'", () => {

            highlightFeature.highlightFeature({commit, dispatch, getters}, highlightObjectPoint);
            expect(increaseFeatureSpy.called).to.be.true;
            expect(commit.called).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("Maps/addHighlightedFeature");
            expect(commit.firstCall.args[1]).to.equals(featurePoint);
            expect(commit.secondCall.args[0]).to.equals("Maps/addHighlightedFeatureStyle");
            expect(commit.secondCall.args[1]).to.equals(stylePoint);
        });

        it("tests type 'viaLayerIdAndFeatureId'", () => {

            sinon.stub(layerCollection, "getLayerById").returns(layerPolygon);
            highlightFeature.highlightFeature({commit, dispatch, getters}, highlightObjectViaId);

            expect(highlightViaParametricUrlSpy.called).to.be.true;
            expect(getHighlightFeatureSpy.called).to.be.true;
            // TODO weitere Assertions zu den dispatch actions
        });

        it("tests type 'highlightPolygon' with highlightStyle", () => {

            sinon.stub(highlightFeature, "styleObject").returns(styleGeoms);
            highlightFeature.highlightFeature({commit, dispatch, getters}, polygonWithHighlightStyle);

            expect(highlightPolygonSpy.called).to.be.true;
            expect(commit.called).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("Maps/addHighlightedFeature");
            expect(commit.firstCall.args[1]).to.equals(featurePolygon);
            expect(commit.secondCall.args[0]).to.equals("Maps/addHighlightedFeatureStyle");
            expect(commit.secondCall.args[1]).to.equals(styleGeoms);
        });

        it("tests type 'highlightPolygon' without highlightStyle", () => {

            highlightFeature.highlightFeature({commit, dispatch, getters}, polygonWithoutHighlightStyle);

            expect(highlightPolygonSpy.called).to.be.true;
            expect(dispatch.called).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("Maps/placingPolygonMarker");
            expect(dispatch.firstCall.args[1]).to.equals(featurePolygon);
        });


        it("tests type 'highlightLine' with highlightStyle", () => {

            sinon.stub(highlightFeature, "styleObject").returns(styleGeoms);
            highlightFeature.highlightFeature({commit, dispatch, getters}, lineWithHighlightStyle);

            expect(highlightLineSpy.called).to.be.true;
            expect(commit.called).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("Maps/addHighlightedFeature");
            expect(commit.firstCall.args[1]).to.equals(featureLine);
            expect(commit.secondCall.args[0]).to.equals("Maps/addHighlightedFeatureStyle");
            expect(commit.secondCall.args[1]).to.equals(styleGeoms);
        });

        it("tests type 'highlightLine' without highlightStyle", () => {

            sinon.stub(highlightFeature, "styleObject").returns(styleGeoms);
            highlightFeature.highlightFeature({commit, dispatch, getters}, lineWithoutHighlightStyle);

            expect(highlightLineSpy.called).to.be.true;
            expect(dispatch.called).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("Maps/placingPolygonMarker");
            expect(dispatch.firstCall.args[1]).to.equals(featureLine);
        });
    });
});
