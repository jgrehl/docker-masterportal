import {expect} from "chai";
import getters from "../../getters";
import stateAppStore from "../../state";

describe("src_3_0_0/app-store/getters.js", () => {
    describe("allConfigsLoaded", () => {
        it("should return true, if all configs are loaded", () => {
            const state = {
                loadedConfigs: {
                    configJson: true,
                    restServicesJson: true,
                    servicesJson: true
                }
            };

            expect(getters.allConfigsLoaded(stateAppStore)).to.be.false;
            expect(getters.allConfigsLoaded(state)).to.be.true;
        });
    });
});
