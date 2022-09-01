import {expect} from "chai";
import mutations from "../../mutationsControls";

const {registerControl, unregisterControl} = mutations;

describe("src_3_0_0/modules/controls/mutationsControls.js", () => {
    describe("registerControl", () => {
        it("add new control to componentMap", () => {
            const state = {
                    componentMap: {
                        backForward: {id: "backForward"},
                        fullScreen: {id: "fullScreen"}
                    }
                },
                name = "name",
                control = {id: "controlId"};

            registerControl(state, {name, control});

            expect(Object.keys(state.componentMap).length).to.equals(3);
            expect(state.componentMap).to.deep.equals({
                backForward: {id: "backForward"},
                fullScreen: {id: "fullScreen"},
                name: {id: "controlId"}
            });
        });
    });

    describe("unregisterControl", () => {
        it("remove a control from componentMap", () => {
            const state = {
                    componentMap: {
                        backForward: {id: "backForward"},
                        fullScreen: {id: "fullScreen"},
                        name: {id: "controlId"}
                    },
                    mobileHiddenControls: [],
                    bottomControls: []
                },
                name = "name";

            unregisterControl(state, name);

            expect(Object.keys(state.componentMap).length).to.equals(2);
            expect(state.componentMap).to.deep.equals({
                backForward: {id: "backForward"},
                fullScreen: {id: "fullScreen"}
            });
        });
    });
});
