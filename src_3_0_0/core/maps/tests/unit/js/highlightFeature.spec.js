import {expect} from "chai";
import sinon from "sinon";
import {highlightFeature} from "../../../js/highlightFeature";
import {Style} from "ol/style.js";
// import Point from "ol/geom/Point";

describe.only("src_3_0_0/core/maps/js/highlightFeature.js", () => {
    describe("highlightFeature", () => {
        const feature = {
                id: "test",
                getGeometry: () => sinon.spy({
                    getType: () => "Point",
                    getCoordinates: () => [100, 100]
                }),
                getProperties: () => [],
                get: () => sinon.stub(),
                getStyle: () => new Style()
            },
            highlightObject = {
                styleId: "defaultHighlightFeaturesPoint",
                type: "increase",
                feature: feature
            };
        let commit,
            dispatch,
            getters,
            increaseFeatureSpy;

        before(() => {
            increaseFeatureSpy = sinon.spy(highlightFeature, "increaseFeature");
            commit = sinon.spy();
            dispatch = sinon.spy();

        });

        it("tests highlightFeature with type 'increase'", () => {

            highlightFeature({commit, dispatch, getters}, highlightObject);
            expect(increaseFeatureSpy.calledOnce).to.be.true;
            // expect(Object.keys(olMap.listeners_)).include("pointermove");
        });


    });
});


// import sinon from "sinon";

// import {highlightFeature} from "../../../js/highlightFeature";

// describe("src_3_0_0/core/maps/js/highlightFeature", () => {
//     describe("highlightFeature", () => {
//         it("should check how to highlight", function () {
//             const highlightObject = {
//                     type: "highlightPolygon"
//                 },
//                 commit = sinon.spy(),
//                 dispatch = sinon.spy();

//             highlightFeature({commit, dispatch}, highlightObject);
//         });
//     });

/* describe("highlightPolygon", () => {
        it("should highlight a polygon feature", function () {
            const highlightObject = {
                    feature: "..."
                },
                commit = sinon.spy(),
                dispatch = sinon.spy();

            highlightPolygon(commit, dispatch, highlightObject);
        });
    }); */
/*
    describe("highlightLine", () => {
        it("should highlight a line feature", function () {

        });
    });

    describe("highlightViaParametricUrl", () => {
        it("should highlight a feature via layerid and featureid", function () {

        });
    });

    describe("getHighlightFeature", () => {
        it("should search the feature which shall be highlighted", function () {

        });
    });

    describe("increaseFeature", () => {
        it("should increase the icon of the feature", function () {

        });
    });

    describe("styleObject", () => {
        it("should get style via styleList", function () {

        });
    }); */
// });
