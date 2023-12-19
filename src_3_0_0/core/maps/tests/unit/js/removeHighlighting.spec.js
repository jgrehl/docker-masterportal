// import {expect} from "chai";
import Feature from "ol/Feature";
import sinon from "sinon";

import {removeHighlightFeature} from "../../../js/removeHighlighting";

describe("src_3_0_0/core/maps/js/removeHighlighting", () => {
    describe("removeHighlightFeature", () => {
        it("should reset highlighted feature style", function () {
            const feature = Feature,
                commit = sinon.spy(),
                state = sinon.spy();

            removeHighlightFeature({commit, state}, feature);
        });
    });
/*
    describe("highlightPolygon", () => {
        it("should highlight a polygon feature", function () {
            const highlightObject = {
                feature: "..."
            };

            expect(highlightFeature.highlightPolygon(commit, dispatch, highlightObject));
        });
    });

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
    });
    */
});
