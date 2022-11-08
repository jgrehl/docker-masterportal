import {expect} from "chai";
import sinon from "sinon";
import actions from "../../../store/actionsOpenConfig";

const {
    processConfigJsonOnload
} = actions;


describe("src_3_0_0/modules/openConfig/store/actionsOpenConfig.js", () => {
    let commit,
        dispatch;

    beforeEach(() => {
        commit = sinon.spy();
        dispatch = sinon.spy();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("processConfigJsonOnload", () => {
        it("should set Portalconfig set Layerconfig to the state and start extendLayers", () => {
            const event = {
                target: {
                    result: "{\r\n  \"Portalconfig\": {},\r\n  \"Themenconfig\": {}\r\n}\r\n"
                }
            };

            processConfigJsonOnload({commit, dispatch}, event);

            expect(commit.calledTwice).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("setPortalConfig");
            expect(commit.firstCall.args[1]).to.deep.equals({});
            expect(commit.secondCall.args[0]).to.equals("setLayerConfig");
            expect(commit.secondCall.args[1]).to.deep.equals({});

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("extendLayers");
            expect(dispatch.firstCall.args[1]).to.equals(null);
        });
    });
});
