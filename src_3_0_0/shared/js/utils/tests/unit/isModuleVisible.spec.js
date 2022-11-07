import {expect} from "chai";
import isModuleVisible from "../../isModuleVisible";

describe("src_3_0_0/shared/js/utils/isModuleVisible", () => {
    describe("isModuleVisible", () => {
        it("should return true if mapMode is '2D' and deviceMode is 'Desktop'", () => {
            expect(isModuleVisible("2D", "Desktop")).to.be.true;
        });

        it("should return true if mapMode is '2D' and deviceMode is 'Mobile'", () => {
            expect(isModuleVisible("2D", "Mobile")).to.be.true;
        });

        it("should return true if mapMode is '2D' and deviceMode is 'Table'", () => {
            expect(isModuleVisible("2D", "Table")).to.be.true;
        });

        it("should return true if mapMode is '3D' and deviceMode is 'Table'", () => {
            expect(isModuleVisible("3D", "Desktop")).to.be.true;
        });

        it("should return true if mapMode is '3D' and deviceMode is 'Mobile'", () => {
            expect(isModuleVisible("3D", "Mobile")).to.be.true;
        });

        it("should return true if mapMode is '3D' and deviceMode is 'Table'", () => {
            expect(isModuleVisible("3D", "Table")).to.be.true;
        });

        it("should return true if supportedMapModes and supportedDevices contains mapMode and deviceMode ", () => {
            expect(isModuleVisible("3D", "Table", ["3D"], ["Table"])).to.be.true;
        });

        it("should return false if supportedMapModes and supportedDevices doesn't contains mapMode and deviceMode ", () => {
            expect(isModuleVisible("3D", "Table", ["2D"], ["Mobile"])).to.be.false;
        });

        it("should return false if one of supportedMapModes and supportedDevices doesn't contains mapMode and deviceMode ", () => {
            expect(isModuleVisible("3D", "Table", ["3D"], ["Mobile"])).to.be.false;
            expect(isModuleVisible("3D", "Table", ["2D"], ["Table"])).to.be.false;
        });
    });
});
