import {expect} from "chai";
import mutations from "../../../menu-store/mutationsMenu.js";

const {addModuleToMenuSection} = mutations;

describe("src_3_0_0/core/menu/menu-store/mutationsMenu.js", () => {
    describe("addModuleToMenuSection", () => {
        it("adds a module to menu section on last position in first section", () => {
            const state = {
                    mainMenu: {
                        sections: [[]]
                    },
                    secondaryMenu: {
                        sections: [[]]
                    }

                },
                moduleState = {
                    type: "exampleModule",
                    menuSide: "mainMenu"
                };

            addModuleToMenuSection(state, moduleState);

            expect(state.mainMenu.sections[0].length).to.equals(1);
            expect(state.mainMenu.sections[0]).to.includes(moduleState);
        });
    });
});
