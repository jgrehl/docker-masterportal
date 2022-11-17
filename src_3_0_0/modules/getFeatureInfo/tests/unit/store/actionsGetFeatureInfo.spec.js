import {expect} from "chai";
import sinon from "sinon";
import actions from "../../../store/actionsGetFeatureInfo.js";

describe("src_3_0_0/modules/getFeatureInfo/store/actionsGetFeatureInfo.js", () => {
    let commit,
        dispatch;

    beforeEach(() => {
        commit = sinon.spy();
        dispatch = sinon.spy();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("addGfiToMenu", () => {
        beforeEach(() => {
            dispatch = sinon.fake.returns(0);
        });

        it("should add getFeatureInfo to menu and commit the path to gfi state", () => {
            const state = {
                type: "getFeatureInfo",
                menuSide: "secondaryMenu"
            };

            actions.addGfiToMenu({commit, dispatch, state}).then(() => {
                expect(commit.calledOnce).to.be.true;
                expect(commit.firstCall.args[0]).to.equal("setPath");
                expect(commit.firstCall.args[1]).to.equal(["secondaryMenu", "sections", 0, undefined]);

                expect(dispatch.calledOnce).to.be.true;
                expect(dispatch.firstCall.args[0]).to.equal("Menu/addModule");
                expect(dispatch.firstCall.args[1]).to.equal(state);
            });
        });
    });

    describe("updateClick", () => {
        it("should set gfiFeatures to null and start collectGfiFeatures", () => {
            actions.updateClick({commit, dispatch});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.equal("setGfiFeatures");
            expect(commit.firstCall.args[1]).to.be.null;

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equal("collectGfiFeatures");
        });
    });
});
