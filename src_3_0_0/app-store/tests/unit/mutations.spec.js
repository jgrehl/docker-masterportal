import {expect} from "chai";
import mutations from "../../mutations";

const {
    setLoadedConfigs
} = mutations;

describe("src_3_0_0/app-store/mutations.js", () => {
    describe("setLoadedConfigs", () => {
        it("Sets the loaded configJson to true", () => {
            const state = {
                loadedConfigs: {
                    configJson: false,
                    restServicesJson: false,
                    servicesJson: false
                }
            };

            setLoadedConfigs(state, "configJson");

            expect(state.loadedConfigs.configJson).to.be.true;
            expect(state.loadedConfigs.restServicesJson).to.be.false;
            expect(state.loadedConfigs.servicesJson).to.be.false;
        });

        it("Sets the loaded all configs to true", () => {
            const state = {
                loadedConfigs: {
                    configJson: false,
                    restServicesJson: false,
                    servicesJson: false
                }
            };

            setLoadedConfigs(state, "configJson");
            setLoadedConfigs(state, "restServicesJson");
            setLoadedConfigs(state, "servicesJson");

            expect(state.loadedConfigs.configJson).to.be.true;
            expect(state.loadedConfigs.restServicesJson).to.be.true;
            expect(state.loadedConfigs.servicesJson).to.be.true;
        });
    });
});
