import {expect} from "chai";
import sinon from "sinon";
import actions from "../../../store/actionsGetFeatureInfo.js";

describe("src_3_0_0/modules/getFeatureInfo/store/actionsGetFeatureInfo.js", () => {
    describe("updateClick: Listener for click on the map", () => {
        it("commits setGfiFeatures and start collectGfiFeatures", () => {
            const dispatch = sinon.spy(),
                commit = sinon.spy();

            actions.updateClick({commit, dispatch});
            expect(commit.calledOnce).to.be.true;
            expect(dispatch.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.equal("setGfiFeatures");
            expect(dispatch.firstCall.args[0]).to.equal("collectGfiFeatures");

            /**
             * @todo MapMarker
             */
            // expect(dispatch.calledTwice).to.be.true;
            // expect(dispatch.firstCall.args[0]).to.equal("MapMarker/removePolygonMarker");
            // expect(dispatch.secondCall.args[0]).to.equal("collectGfiFeatures");
        });
    });
});
