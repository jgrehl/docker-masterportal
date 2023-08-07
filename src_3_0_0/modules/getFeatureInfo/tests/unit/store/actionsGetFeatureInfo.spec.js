import {expect} from "chai";
import sinon from "sinon";
import actions from "../../../store/actionsGetFeatureInfo.js";

describe("src_3_0_0/modules/getFeatureInfo/store/actionsGetFeatureInfo.js", () => {
    let commit,
        getters,
        rootGetters,
        dispatch,
        gfiFeaturesAtPixel;

    beforeEach(() => {
        gfiFeaturesAtPixel = [];

        commit = sinon.spy();
        dispatch = sinon.spy();
        getters = {
            gfiFeaturesAtPixel: sinon.stub().returns(gfiFeaturesAtPixel)
        };
        rootGetters = {
            "Maps/clickCoordinate": [1, 2],
            "Maps/resolution": 123,
            "Maps/projection": sinon.stub()
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("TODO collectGfiFeatures", () => {
        it("TODO", () => {
            // actions.collectGfiFeatures({getters, commit, dispatch, rootGetters});

            // expect(true).to.be.true;
            // expect(commit.firstCall.args[0]).to.equal("setGfiFeatures");
            // expect(commit.firstCall.args[1]).to.be.null;

            // expect(dispatch.calledTwice).to.be.true;
            // expect(dispatch.firstCall.args[0]).to.equal("Maps/removePolygonMarker");
            // expect(dispatch.firstCall.args[1]).to.be.null;
            // expect(dispatch.secondCall.args[0]).to.equal("collectGfiFeatures");
        });
    });
});
