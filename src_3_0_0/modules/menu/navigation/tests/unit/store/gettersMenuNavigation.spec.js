import {expect} from "chai";
import getters from "../../../store/gettersMenuNavigation.js";

const {isModuleActiveInMenu, lastEntry, previousEntry} = getters;

describe("src_3_0_0/core/menu/navigation/store/gettersMenuNavigation.js", () => {
    describe("lastEntry", () => {
        it("returns null if no navigation was made (initial state)", () => {
            expect(lastEntry({
                entries: {
                    mainMenu: [],
                    secondaryMenu: []
                }
            })("mainMenu")).to.be.null;
        });
    });
    describe("previousEntry", () => {
        it("returns null if no navigation was made (initial state)", () => {
            expect(previousEntry({
                entries: {
                    mainMenu: [],
                    secondaryMenu: []
                }
            })("mainMenu")).to.be.null;
        });
    });
    describe("isModuleActiveInMenu", () => {
        it("returns false if no navigation was made (initial state)", () => {
            expect(isModuleActiveInMenu({
                entries: {
                    mainMenu: [],
                    secondaryMenu: []
                }
            }, null, null, {})("mainMenu", "type")).to.be.false;
        });
        it("returns false if moduleType is null", () => {
            expect(isModuleActiveInMenu({
                entries: {
                    mainMenu: [],
                    secondaryMenu: []
                }
            }, null, null, {})("mainMenu", null)).to.be.false;
        });
        it("returns true if moduleType is available", () => {
            const rootGetters = {
                    "Menu/mainMenu": {
                        sections: [[{
                            type: "moduleType"
                        }]]
                    }
                },
                path = ["mainMenu", "sections", 0, 0];

            expect(isModuleActiveInMenu({
                entries: {
                    mainMenu: [path]
                }
            }, null, null, rootGetters)("mainMenu", "moduleType")).to.be.true;
        });
    });
});
