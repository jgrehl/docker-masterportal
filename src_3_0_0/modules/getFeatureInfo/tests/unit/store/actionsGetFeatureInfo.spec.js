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
