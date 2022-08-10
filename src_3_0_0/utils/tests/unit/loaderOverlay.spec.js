import {expect} from "chai";
import LoaderOverlay from "../../loaderOverlay";

describe("src_3_0_0/utils/loaderOverlay.js", () => {
    before(() => {
        LoaderOverlay.loaderOverlayCount = 0;
        LoaderOverlay.initialLoaderIsHidden = false;
        LoaderOverlay.isFading = false;
        LoaderOverlay.loaderTimeoutReference = null;
    });

    describe("show", () => {
        it("show loader should return 1", () => {
            expect(LoaderOverlay.show()).to.equals(1);
        });
    });
    describe("hide", () => {
        it("hide loader should return 0", () => {
            expect(LoaderOverlay.hide()).to.equals(0);
        });
    });
    describe("fade", () => {
        it("fade loader should be return undefined", () => {
            expect(LoaderOverlay.fade()).to.be.undefined;
        });
    });
    describe("cleanup", () => {
        it("cleanup loader should be return undefined", () => {
            expect(LoaderOverlay.cleanup()).to.be.undefined;
        });
        it("cleanup sets window.INITIAL_LOADING to false", () => {
            expect(window.INITIAL_LOADING).to.be.false;
        });
    });
});
