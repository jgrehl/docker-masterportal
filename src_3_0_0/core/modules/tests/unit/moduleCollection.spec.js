import {expect} from "chai";

import moduleCollection from "../../moduleCollection";

describe("src_3_0_0/core/modules/moduleCollection.js", () => {
    describe("registerConfiguredModules and getConfiguredModuleComponentsByNavigation", () => {
        it("should register configured modules", () => {
            const navigationName = "navigationSecondary",
                moduleConfigs = [
                    {
                        "scaleSwitcher": {}
                    }
                ];
            let configuredNavigationSecondaryModules = [];

            moduleCollection.registerConfiguredModules(navigationName, moduleConfigs);
            configuredNavigationSecondaryModules = moduleCollection.getConfiguredModuleComponentsByNavigation(navigationName);

            expect(configuredNavigationSecondaryModules.length).to.equals(1);
            expect(configuredNavigationSecondaryModules[0].name).to.equals("ScaleSwitcher");
        });
    });

    describe("addModule", () => {
        it("should add a module to moduleComponents", () => {
            const module = {
                name: "abc"
            };

            moduleCollection.addModule(module);

            expect(Object.keys(moduleCollection.getModuleComponents()).slice(-1)).to.includes("abc");
        });
    });

    describe("getModuleStores", () => {
        it("should add a store to moduleStores", () => {
            const moduleName = "abc",
                moduleStore = {
                    "abc": {}
                };

            moduleCollection.addModuleStore(moduleName, moduleStore);

            expect(Object.keys(moduleCollection.getModuleStores()).slice(-1)).to.includes("abc");
        });
    });
});
