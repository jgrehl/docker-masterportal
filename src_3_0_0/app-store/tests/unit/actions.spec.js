import axios from "axios";
import rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";
import sinon from "sinon";
import {expect} from "chai";
import actions from "../../actions";

describe("src_3_0_0/app-store/actions.js", () => {
    let axiosMock,
        commit,
        state,
        layerList,
        layerConfig,
        layerConfigCustom,
        initializeLayerListSpy;
    const restConf = "./resources/rest-services-internet.json",
        layerConf = "./services.json";

    beforeEach(() => {
        layerList = [
            {
                id: "453",
                name: "name453",
                typ: "WMS",
                datasets: [{
                    md_id: "B6A59A2B-2D40-4676-9094-0EB73039ED34",
                    md_name: "md_name_453"
                }
                ]
            },
            {
                id: "452",
                name: "name452",
                typ: "WMS",
                datasets: [{
                    md_id: "B6A59A2B-2D40-4676-9094-efg",
                    md_name: "md_name_452"
                }
                ]
            },
            {
                id: "1132",
                name: "name1132",
                typ: "SENSORTHINGS",
                datasets: [{
                    md_id: "B6A59A2B-2D40-4676-9094-abc",
                    md_name: "md_name_1132"
                }
                ]
            },
            {
                id: "10220",
                name: "layer10220",
                typ: "WFS",
                datasets: [{
                    md_id: "B6A59A2B-2D40-4676-9094-hghghg",
                    md_name: "md_name_10220"
                }
                ]
            },
            {
                id: "451",
                name: "name451",
                typ: "WFS"
            },
            {
                id: "1103",
                name: "Überschwemmungsgebiete",
                typ: "WMS",
                transparent: true,
                transparency: 0,
                datasets: [{
                    md_id: "0879B86F-4F44-45AA-BA5B-021D9D30AAEF"
                }]
            },
            {
                id: "717",
                name: "name717",
                layers: "layer717",
                maxScale: "10000",
                minScale: "10",
                typ: "WMS"
            },
            {
                id: "718",
                name: "name718",
                layers: "layer718",
                maxScale: "30000",
                minScale: "30",
                typ: "WMS"
            },
            {
                id: "719",
                name: "name719",
                layers: "layer719",
                maxScale: "20000",
                minScale: "20",
                typ: "WMS"
            }
        ];
        layerConfig = {
            Hintergrundkarten: {
                elements: [
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
                elements: [
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
        };
        layerConfigCustom = {
            Hintergrundkarten: {
                elements: [
                    {
                        id: [
                            "717",
                            "718",
                            "719"
                        ],
                        visibility: true,
                        name: "Geobasiskarten (farbig)"
                    },
                    {
                        id: "453"
                    }
                ]
            },
            Fachdaten: {
                elements: [
                    {
                        name: "Lage und Gebietszugehörigkeit",
                        type: "folder",
                        elements: [
                            {
                                name: "Überschwemmungsgebiete",
                                type: "folder",
                                elements: [
                                    {
                                        name: "Überschwemmungsgebiete",
                                        type: "folder",
                                        elements: [
                                            {
                                                id: "1103"
                                            }
                                        ]
                                    },
                                    {
                                        id: "10220"
                                    }
                                ]
                            },
                            {
                                id: "10220"
                            },
                            {
                                id: "10220"
                            },
                            {
                                id: "451"
                            }
                        ]
                    }
                ]
            }
        };
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
