import {expect} from "chai";
import gettersMap from "../../../store/gettersMaps";
import stateMap from "../../../store/stateMaps";

describe("src_3_0_0/core/maps/store/gettersMap.js", () => {
    describe("isMaxZoomDisplayed", async () => {
        it("returns false for isMaxZoomDisplayed from stateMaps and true for local state", () => {
            const state = {
                maxZoom: 10,
                zoom: 0
            };

            expect(gettersMap.isMaxZoomDisplayed(stateMap)).to.be.true;
            expect(gettersMap.isMaxZoomDisplayed(state)).to.be.false;
        });
    });

    describe("isMinZoomDisplayed", () => {
        it("returns false for isMinZoomDisplayed from stateMaps and true for local state", () => {
            const state = {
                minZoom: 0,
                zoom: 5
            };

            expect(gettersMap.isMinZoomDisplayed(stateMap)).to.be.true;
            expect(gettersMap.isMinZoomDisplayed(state)).to.be.false;
        });

    });
});
