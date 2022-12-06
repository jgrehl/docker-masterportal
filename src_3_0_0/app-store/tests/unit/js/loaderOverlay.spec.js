import {expect} from "chai";
import LoaderOverlay from "../../../js/loaderOverlay";

describe("src_3_0_0/app-store/js/loaderOverlay.js", () => {
    before(() => {
        LoaderOverlay.loaderOverlayCount = 0;
        LoaderOverlay.initialLoaderIsHidden = false;
        LoaderOverlay.isFading = false;
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
