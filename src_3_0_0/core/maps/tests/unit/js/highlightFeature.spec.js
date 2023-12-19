import sinon from "sinon";

import {highlightFeature} from "../../../js/highlightFeature";

describe("src_3_0_0/core/maps/js/highlightFeature", () => {
    describe("highlightFeature", () => {
        it("should check how to highlight", function () {
            const highlightObject = {
                    type: "highlightPolygon"
                },
                commit = sinon.spy(),
                dispatch = sinon.spy();

            highlightFeature({commit, dispatch}, highlightObject);
        });
    });

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
});
