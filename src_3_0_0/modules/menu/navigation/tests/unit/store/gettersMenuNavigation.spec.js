import {expect} from "chai";
import getters from "../../../store/gettersMenuNavigation.js";

const {lastEntry, previousEntry} = getters;

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
});
