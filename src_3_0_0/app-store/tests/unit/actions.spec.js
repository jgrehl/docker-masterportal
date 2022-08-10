import axios from "axios";
import sinon from "sinon";
import {expect} from "chai";
import actions from "../../actions";


describe("src/app-store/actions.js", () => {
    let commit, state, axiosMock;
    const restConf = "./resources/rest-services-internet.json";

    beforeEach(() => {
        commit = sinon.spy();
        state = {
            configJs: {
                portalConf: "./",
                restConf: restConf
            }
        };
        axiosMock = sinon.stub(axios, "get").returns(Promise.resolve({request: {status: 200, data: []}}));
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("App actions", () => {
        it("loadConfigJson", () => {
            actions.loadConfigJson({commit, state});

            expect(axiosMock.calledOnce).to.be.true;
            expect(axiosMock.calledWith("config.json")).to.be.true;

        });
        it("loadRestServicesJson", () => {
            actions.loadRestServicesJson({commit, state});

            expect(axiosMock.calledOnce).to.be.true;
            expect(axiosMock.calledWith(restConf)).to.be.true;
        });
    });
});
