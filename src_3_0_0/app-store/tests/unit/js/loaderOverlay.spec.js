import {expect} from "chai";
import LoaderOverlay from "../../../js/loaderOverlay";

<<<<<<< HEAD
=======
<<<<<<<< HEAD:src_3_0_0/shared/js/utils/tests/unit/loaderOverlay.spec.js
>>>>>>> 673d450ae (update rename store folders and move loaderOverlay to app-store/js)
<<<<<<<< HEAD:src_3_0_0/app-store/tests/unit/js/loaderOverlay.spec.js
describe("src_3_0_0/app-store/js/loaderOverlay.js", () => {
========
describe("src_3_0_0/shared/js/utils/loaderOverlay.js", () => {
>>>>>>>> b0b01718e (update move files into new folder structure):src_3_0_0/shared/js/utils/tests/unit/loaderOverlay.spec.js
<<<<<<< HEAD
=======
========
describe("src_3_0_0/app-store/js/loaderOverlay.js", () => {
>>>>>>>> 673d450ae (update rename store folders and move loaderOverlay to app-store/js):src_3_0_0/app-store/tests/unit/js/loaderOverlay.spec.js
>>>>>>> 673d450ae (update rename store folders and move loaderOverlay to app-store/js)
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
