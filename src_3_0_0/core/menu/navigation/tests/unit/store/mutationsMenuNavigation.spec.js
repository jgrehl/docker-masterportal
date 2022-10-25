import {expect} from "chai";
import mutations from "../../../store/mutationsMenuNavigation.js";


const {addEntry, removeLastEntry} = mutations,
    sampleMainMenuPath = ["mainMenu", "sections", 0, 1, "children", 0];

describe("src_3_0_0/modules/controls/backForward/store/mutationsMenuNavigation.js", () => {
    describe("addEntry", () => {
        it("adds an entry to navigation state", () => {
            const state = {
                entries: {
                    mainMenu: [],
                    secondaryMenu: []
                }
            };

            addEntry(state, sampleMainMenuPath);
            expect(state.entries.mainMenu.length).to.equal(1);
            expect(state.entries.mainMenu[0]).to.equal(sampleMainMenuPath);
            expect(state.entries.secondaryMenu.length).to.equal(0);
        });
    });
    describe("removeLastEntry", () => {
        it("removes the last entry from navigation state state", () => {
            const state = {
                entries: {
                    mainMenu: [sampleMainMenuPath],
                    secondaryMenu: []
                }
            };

            removeLastEntry(state, "mainMenu");

            expect(state.entries.mainMenu.length).to.equal(0);
        });
    });
});
