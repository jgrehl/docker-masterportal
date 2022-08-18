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

    // global.Config = {
    // };

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
                "typ": "WMS"
            },
            {
                id: "718",
                name: "name718",
                layers: "layer718",
                maxScale: "30000",
                minScale: "30",
                "typ": "WMS"
            },
            {
                id: "719",
                name: "name719",
                layers: "layer719",
                maxScale: "20000",
                minScale: "20",
                "typ": "WMS"
            }
        ];
        layerConfig = {
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
        };
        layerConfigCustom = {
            Hintergrundkarten: {
                Layer: [
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
                Ordner: [
                    {
                        Titel: "Lage und Gebietszugehörigkeit",
                        Ordner: [
                            {
                                Titel: "Überschwemmungsgebiete",
                                Ordner: [
                                    {
                                        Titel: "Überschwemmungsgebiete",
                                        Layer: [
                                            {
                                                id: "1103"
                                            }
                                        ]
                                    }
                                ],
                                Layer: [
                                    {
                                        id: "10220"
                                    }
                                ]
                            }
                        ],
                        Layer: [
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
            configJson: {
                Themenconfig: layerConfig
            },
            portalConfigDefaults: {
                tree: {
                    validLayerTypesAutoTree: ["WMS", "SENSORTHINGS", "TERRAIN3D", "TILESET3D", "OBLIQUE"]
                }
            }
        };
        global.XMLHttpRequest = sinon.useFakeXMLHttpRequest();
        axiosMock = sinon.stub(axios, "get").returns(Promise.resolve({request: {status: 200, data: []}}));
        sinon.stub(rawLayerList, "getLayerWhere").callsFake(function (searchAttributes) {
            return layerList.find(entry => Object.keys(searchAttributes).every(key => entry[key] === searchAttributes[key])) || null;
        });
        sinon.stub(rawLayerList, "getLayerList").returns(layerList);
        initializeLayerListSpy = sinon.spy(rawLayerList, "initializeLayerList");
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
        it("loadServicesJson", () => {
            actions.loadServicesJson({state, commit});

            expect(initializeLayerListSpy.calledOnce).to.be.true;
            expect(initializeLayerListSpy.calledWith(layerConf)).to.be.true;
        });
        it("extendLayers for simple tree", () => {
            state.layerConfig = layerConfig;
            actions.extendLayers({commit, state});
            expect(commit.callCount).to.be.equals(4);
            expect(commit.alwaysCalledWith("replaceByIdInLayerConfig"));
            expect(commit.firstCall.args[1]).to.deep.equals({layerConfigs: [{layer: Object.assign({...layerList[0]}, {visibility: true}), id: layerList[0].id}]});
            expect(commit.secondCall.args[1]).to.deep.equals({layerConfigs: [{layer: {...layerList[1]}, id: layerList[1].id}]});
            expect(commit.thirdCall.args[1]).to.deep.equals({layerConfigs: [{layer: Object.assign({...layerList[2]}, {visibility: true}), id: layerList[2].id}]});
            expect(commit.lastCall.args[1]).to.deep.equals({layerConfigs: [{layer: {...layerList[3]}, id: layerList[3].id}]});
        });
        it("extendLayers for custom tree", () => {
            const mergedLayer = {
                id: "717",
                layers: "layer717,layer718,layer719",
                visibility: true,
                name: "Geobasiskarten (farbig)",
                maxScale: 30000,
                minScale: 10,
                selected: true,
                typ: "WMS"
            };
            state.portalConfig = {tree: {
                type: "custom"
            }};

            state.layerConfig = layerConfigCustom;
            actions.extendLayers({commit, state});
            expect(commit.callCount).to.be.equals(6);
            expect(commit.alwaysCalledWith("replaceByIdInLayerConfig"));
            expect(commit.firstCall.args[1].layerConfigs[0].layer).to.deep.equals(mergedLayer);
            expect(commit.secondCall.args[1].layerConfigs[0].layer).to.deep.equals(layerList[0]);
            expect(commit.thirdCall.args[1].layerConfigs[0].layer).to.deep.equals(layerList[5]);
            expect(commit.lastCall.args[1].layerConfigs[0].layer).to.deep.equals(layerList[4]);
        });
        it("extendLayers for auto tree with all filtered raw layers", () => {
            const getters = {activeCategory: {
                "key": "kategorie_opendata",
                "name": "Opendata",
                "active": true
            }};
            let expectedFirstCallArg = null;

            state.portalConfig = {tree: {
                type: "auto",
                validLayerTypesAutoTree: ["WMS", "SENSORTHINGS", "TERRAIN3D", "TILESET3D", "OBLIQUE"]
            }};
            state.layerConfig = layerConfig;
            delete state.layerConfig.Fachdaten;

            actions.extendLayers({commit, getters, state});

            layerList.splice(3, 2);
            layerList.splice(4, 3);
            expectedFirstCallArg = {layerConfigs: layerList, parentKey: "Fachdaten"};

            expect(commit.callCount).to.be.equals(3);
            expect(commit.firstCall.args[0]).to.equals("addToLayerConfig");
            expect(commit.firstCall.args[1]).to.deep.equals(expectedFirstCallArg);
            expect(commit.secondCall.args[0]).to.equals("replaceByIdInLayerConfig");
            expect(commit.secondCall.args[1].layerConfigs[0].layer).to.deep.equals(Object.assign({...layerList[0]}, {visibility: true}));
            expect(commit.thirdCall.args[0]).to.equals("replaceByIdInLayerConfig");
            expect(commit.thirdCall.args[1].layerConfigs[0].layer).to.deep.equals(layerList[1]);

        });

        it("extendLayers for special configuration with 'Ordner'", () => {
            layerConfig = {
                Fachdaten: {
                    Layer: [
                        {
                            id: "1132",
                            name: "100 Jahre Stadtgruen POIs",
                            visibility: true
                        },
                        {
                            id: "10220"
                        },
                        {
                            Titel: "Titel",
                            Ordner: [
                                {
                                    Titel: "3 Layer",
                                    Layer: [
                                        {
                                            id: "717",
                                            visibility: true
                                        },
                                        {
                                            id: "718",
                                            visibility: true
                                        },
                                        {
                                            id: "719"
                                        }
                                    ],
                                    Ordner: [
                                        {
                                            Titel: "Überschwemmungsgebiete",
                                            Layer: [
                                                {
                                                    id: "1103",
                                                    visibility: true
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            };
            state.layerConfig = layerConfig;

            actions.extendLayers({commit, state});
            expect(commit.callCount).to.be.equals(6);
            expect(commit.alwaysCalledWith("replaceByIdInLayerConfig"));
            expect(commit.firstCall.args[1].layerConfigs[0].layer).to.deep.equals(layerList[2]);
            expect(commit.secondCall.args[1].layerConfigs[0].layer).to.deep.equals(layerList[3]);
            expect(commit.thirdCall.args[1].layerConfigs[0].layer).to.deep.equals(layerList[6]);
            expect(commit.lastCall.args[1].layerConfigs[0].layer).to.deep.equals(layerList[5]);
        });
    });
});
