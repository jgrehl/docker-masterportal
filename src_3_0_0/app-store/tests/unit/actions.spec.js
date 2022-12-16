import axios from "axios";
import rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";
import sinon from "sinon";
import {expect} from "chai";
import actions from "../../actions";

describe("src_3_0_0/app-store/actions.js", () => {
    let axiosMock,
        commit,
        state,
        initializeLayerListSpy;
    const restConf = "./resources/rest-services-internet.json",
        layerConf = "./services.json";

    beforeEach(() => {
        commit = sinon.spy();
        state = {
            configJs: {
                portalConf: "./",
                layerConf: layerConf,
                restConf: restConf
            },
            portalConfigDefaults: {
                tree: {
                    validLayerTypesAutoTree: ["WMS", "SENSORTHINGS", "TERRAIN3D", "TILESET3D", "OBLIQUE"]
                }
            }
        };
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        axiosMock = sinon.stub(axios, "get").returns(Promise.resolve({request: {status: 200, data: []}}));
        initializeLayerListSpy = sinon.spy(rawLayerList, "initializeLayerList");
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("app-store actions", () => {
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
        it("loadServicesJson", () => {
            actions.loadServicesJson({state, commit});

            expect(initializeLayerListSpy.calledOnce).to.be.true;
            expect(initializeLayerListSpy.calledWith(layerConf)).to.be.true;
        });
    });
});
