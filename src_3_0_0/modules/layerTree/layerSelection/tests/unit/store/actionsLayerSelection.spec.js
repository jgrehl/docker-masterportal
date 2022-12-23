import {expect} from "chai";
import sinon from "sinon";

import actions from "../../../store/actionsLayerSelection";

const {updateLayerTree} = actions;

describe("src_3_0_0/modules/layerTree/layerSelection/store/actionsLayerSelection", function () {
    let commit, getters, dispatch;

    beforeEach(() => {
        commit = sinon.spy();
        dispatch = sinon.spy();
        getters = {
            layersToAdd: ["1", "2"]
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
                            showInLayerTree: true
                        }
                    },
                    {
                        id: "2",
                        layer: {
                            id: "2",
                            visibility: true,
                            showInLayerTree: true
                        }
                    }
                ]
            };

            updateLayerTree({commit, dispatch, getters});

            expect(commit.calledTwice).to.be.true;
            expect(commit.firstCall.args[0]).to.be.equals("replaceByIdInLayerConfig");
            expect(commit.firstCall.args[1]).to.deep.equals(expectedArg);
            expect(commit.secondCall.args[0]).to.be.equals("clearSelectedLayer");
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.be.equals("navigateBackToMainMenu");
        });
    });
});
