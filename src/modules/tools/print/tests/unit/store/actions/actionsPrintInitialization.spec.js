import testAction from "../../../../../../../../test/unittests/VueTestUtils";
import actions from "../../../../store/actions/actionsPrintInitialization";

const {
    getGfiForPrint
} = actions;

describe("src/modules/tools/print/store/actions/actionsPrintInitialization.js", () => {
    describe("getGfiForPrint", function () {
        it("should set empty gfi for print", done => {

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(getGfiForPrint, null, {}, {}, [
                {type: "setGfiForPrint", payload: []}
            ], {}, done, {"Tools/Gfi/currentFeature": null});
        });
        it("should set gfi for print", done => {
            const feature = {
                getTitle: () => "TestTitle",
                getMappedProperties: () => "TestProperties"
            };

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done, rootGetters
            testAction(getGfiForPrint, null, {}, {}, [
                {type: "setGfiForPrint", payload: ["TestProperties", "TestTitle", undefined]}
            ], {}, done, {"Tools/Gfi/currentFeature": feature, "Map/clickCoord": undefined});
        });
    });
});
