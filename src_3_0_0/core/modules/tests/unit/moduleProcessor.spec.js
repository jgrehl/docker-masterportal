import {expect} from "chai";
import sinon from "sinon";

import initializeModules from "../../moduleProcessor";
import moduleCollection from "../../moduleCollection";

describe("src_3_0_0/core/modules/moduleProcessor.js", () => {
    describe("initializeModules", () => {
        it("should start registerConfiguredModules of moduleCollection", () => {
            const portalConfig = {
                    navigationMain: {
                        sections: [
                            {
                                "exampleModule": {}
                            }
                        ]
                    },
                    navigationSecondary: {
                        sections: [
                            {
                                "scaleSwitcher": {}
                            }
                        ]
                    }
                },
                registerConfiguredModulesSpy = sinon.spy(moduleCollection, "registerConfiguredModules");

            initializeModules(portalConfig);

            expect(registerConfiguredModulesSpy.calledTwice).to.be.true;
            expect(registerConfiguredModulesSpy.firstCall.args).to.deep.equals([
                "navigationMain",
                [
                    {
                        "exampleModule": {}
                    }
                ]
            ]);
            expect(registerConfiguredModulesSpy.secondCall.args).to.deep.equals([
                "navigationSecondary",
                [
                    {
                        "scaleSwitcher": {}
                    }
                ]
            ]);
        });
    });
});
