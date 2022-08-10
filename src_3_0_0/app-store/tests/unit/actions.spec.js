import axios from "axios";
import sinon from "sinon";
import {expect} from "chai";
import actions from "../../actions";

describe("src_3_0_0/app-store/actions.js", () => {
    let commit, dispatch, state, axiosMock;
    const restConf = "./resources/rest-services-internet.json";

    beforeEach(() => {
        commit = sinon.spy();
        dispatch = sinon.stub().resolves(true);
        state = {
            configJs: {
                portalConf: "./",
                restConf: restConf
            },
            configJson: {
                Themenconfig: {
                    Hintergrundkarten: {
                        Layer: [
                            {
                                id: "453",
                                visibility: true
                            },
                            {
                                id: "452"
                            }
                        ]
                    },
                    Fachdaten: {
                        Layer: [
                            {
                                id: "1132",
                                name: "100 Jahre Stadtgruen POIs",
                                visibility: true
                            },
                            {
                                id: "10220"
                            }
                        ]
                    }
                }
            }
        };
        axiosMock = sinon.stub(axios, "get").returns(Promise.resolve({request: {status: 200, data: []}}));
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("App actions", () => {
        it("loadConfigJs", () => {
            const payLoad = {
                config: "js"
            };

            actions.loadConfigJs({commit}, payLoad);

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("setConfigJs");
            expect(commit.firstCall.args[1]).to.equals(payLoad);
        });
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
        it.skip("enrichVisibleLayers", () => {
            // cannot be tested due to problems mocking imported function getLayerWhere
            actions.enrichVisibleLayers({commit, state});
        });
        it("prepareVisibleLayers", () => {
            const stateCopy = {...state};

            actions.prepareVisibleLayers({dispatch, state});
            expect(dispatch.calledTwice).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("enrichVisibleLayers");
            expect(dispatch.firstCall.args[1]).to.be.deep.equals(stateCopy.layerConfig?.Hintergrundkarten?.Layer);
            expect(dispatch.secondCall.args[0]).to.equals("enrichVisibleLayers");
            expect(dispatch.secondCall.args[1]).to.be.deep.equals(stateCopy.layerConfig?.Fachdaten?.Layer);
        });
    });
});
