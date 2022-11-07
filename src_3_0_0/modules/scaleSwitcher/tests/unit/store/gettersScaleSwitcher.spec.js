import {expect} from "chai";
import getters from "../../../store/gettersScaleSwitcher";
import stateScaleSwitcher from "../../../store/stateScaleSwitcher";

const {
    icon,
    name,
    type,
    active,
    deactivateGFI,
    hasMouseMapInteractions,
    supportedDevice,
    supportedMapMode
} = getters;

describe("src_3_0_0/modules/scaleSwitcher/store/gettersScaleSwitcher.js", () => {
    describe("ScaleSwitcher getters", () => {
        it("returns the active from state", () => {
            expect(active(stateScaleSwitcher)).to.be.false;
        });
        it("returns the icon from state", () => {
            expect(icon(stateScaleSwitcher)).to.equals("bi-arrows-angle-contract");
        });
        it("returns the name from state", () => {
            expect(name(stateScaleSwitcher)).to.be.equals("common:menu.tools.scaleSwitcher");
        });
        it("returns the type from state", () => {
            expect(type(stateScaleSwitcher)).to.equals("scaleSwitcher");
        });
    });

    describe("testing default values", () => {
        it("returns the deactivateGFI default value from state", () => {
            expect(deactivateGFI(stateScaleSwitcher)).to.be.false;
        });
        it("returns the hasMouseMapInteractions default value from state", () => {
            expect(hasMouseMapInteractions(stateScaleSwitcher)).to.be.false;
        });
        it("returns the supportedDevice default value from state", () => {
            expect(supportedDevice(stateScaleSwitcher)).to.be.deep.equals(["Desktop", "Mobil", "Table"]);
        });
        it("returns the deactivateGFI default value from state", () => {
            expect(supportedMapMode(stateScaleSwitcher)).to.be.deep.equals(["2D", "3D"]);
        });
    });
});
