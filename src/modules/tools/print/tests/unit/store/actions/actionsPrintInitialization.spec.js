import VectorLayer from "ol/layer/Vector.js";

import testAction from "../../../../../../../../test/unittests/VueTestUtils";
import actions from "../../../../store/actions/actionsPrintInitialization";

const {
    togglePostrenderListener,
    getGfiForPrint
} = actions;

describe("src/modules/tools/print/store/actions/actionsPrintInitialization.js", () => {
    describe("togglePostrenderListener", function () {
        it("toggle the post render listener with active false and should unregister listener", done => {
            const TileLayer = {},
                state = {
                    active: false,
                    visibleLayerList: [
                        TileLayer,
                        VectorLayer,
                        VectorLayer,
                        VectorLayer,
                        VectorLayer
                    ],
                    eventListener: undefined,
                    layoutList: [{
                        name: "A4 Hochformat"
                    }]
                };

            testAction(togglePostrenderListener, undefined, state, {}, [
                {type: "setVisibleLayer", payload: state.visibleLayerList, commit: true},
                {type: "setEventListener", payload: undefined, commit: true}
            ], {}, done);
        });
    });

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
