import {expect} from "chai";
import sinon from "sinon";

import actions from "../../../store/actionsLayerSelection";

const {updateLayerTree} = actions;

describe("src_3_0_0/modules/layerTree/layerSelection/store/actionsLayerSelection", function () {
    let commit, getters, dispatch, rootGetters;

    beforeEach(() => {
        commit = sinon.spy();
        dispatch = sinon.spy();
        getters = {
            layersToAdd: ["1", "2"],
            menuSide: "menuSide"
        };
        rootGetters = {
            determineZIndex: () => 0
        };
    });

    afterEach(sinon.restore);

    describe("updateLayerTree", function () {
        it("updateLayerTree", function () {
            const expectedArg = {
                layerConfigs: [
                    {
                        id: "1",
                        layer: {
                            id: "1",
                            visibility: true,
                            showInLayerTree: true,
                            zIndex: 0
                        }
                    },
                    {
                        id: "2",
                        layer: {
                            id: "2",
                            visibility: true,
                            showInLayerTree: true,
                            zIndex: 0
                        }
                    }
                ]
            };

            updateLayerTree({commit, dispatch, getters, rootGetters});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.be.equals("clearSelectedLayer");
            expect(dispatch.calledThrice).to.be.true;
            expect(dispatch.firstCall.args[0]).to.be.equals("replaceByIdInLayerConfig");
            expect(dispatch.firstCall.args[1]).to.deep.equals(expectedArg);
            expect(dispatch.secondCall.args[0]).to.be.equals("updateAllZIndexes");
            expect(dispatch.thirdCall.args[0]).to.be.equals("Menu/navigateBack");
            expect(dispatch.thirdCall.args[1]).to.be.equals("menuSide");
        });
    });
});
