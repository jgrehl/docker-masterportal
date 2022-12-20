import rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";
import sinon from "sinon";
import {expect} from "chai";
import actions from "../../actionsLayerConfig";

describe("src_3_0_0/app-store/actionsLayerConfig.js", () => {
    let commit,
        dispatch,
        state,
        layerList,
        layerConfig,
        layerConfigCustom;
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
                                id: "451"
                            }
                        ]
                    }
                ]
            }
        };
        commit = sinon.spy();
        dispatch = sinon.spy();
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
        sinon.stub(rawLayerList, "getLayerWhere").callsFake(function (searchAttributes) {
            return layerList.find(entry => Object.keys(searchAttributes).every(key => entry[key] === searchAttributes[key])) || null;
        });
        sinon.stub(rawLayerList, "getLayerList").returns(layerList);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("addLayerToLayerConfig", () => {
        it("addLayerToLayerConfig", () => {
            layerConfig = {
                Fachdaten: {
                    elements: []
                }
            };
            state.layerConfig = layerConfig;
            const layerToAdd = {
                id: "I_m_the_id",
                name: "Trees in Hamburg",
                typ: "WMS",
                layers: "trees",
                url: "https://geodienste.hamburg.de/trees",
                version: "1.4.3",
                visibility: true,
                showInLayerTree: true,
                maxScale: 2000,
                minScale: 12

            };

            actions.addLayerToLayerConfig({state}, {layerConfig: layerToAdd, parentKey: "Fachdaten"});
            expect(state.layerConfig?.Fachdaten?.elements.length).to.equal(1);
            expect(state.layerConfig?.Fachdaten?.elements[0]).to.deep.equal(layerToAdd);
        });
    });

    describe("extendLayers", () => {
        it("extend layers for simple tree", () => {
            state.layerConfig = layerConfig;
            actions.extendLayers({dispatch, state});

            expect(dispatch.callCount).to.equals(3);
            expect(dispatch.firstCall.args[0]).to.equals("addBackgroundLayerAttribute");
            expect(dispatch.firstCall.args[1]).to.be.undefined;
            expect(dispatch.secondCall.args[0]).to.equals("updateLayerConfigs");
            expect(dispatch.secondCall.args[1]).to.deep.equals([
                {
                    id: "452"
                },
                {
                    id: "453",
                    visibility: true
                }
            ]);
            expect(dispatch.thirdCall.args[0]).to.equals("updateLayerConfigs");
            expect(dispatch.thirdCall.args[1]).to.deep.equals([
                {
                    id: "10220"
                },
                {
                    id: "1132",
                    name: "100 Jahre Stadtgruen POIs",
                    visibility: true
                }
            ]);
        });

        it("extend layer configs for custom tree", () => {
            state.layerConfig = layerConfigCustom;
            actions.extendLayers({dispatch, state});

            expect(dispatch.callCount).to.be.equals(3);
            expect(dispatch.firstCall.args[0]).to.equals("addBackgroundLayerAttribute");
            expect(dispatch.firstCall.args[1]).to.be.undefined;
            expect(dispatch.secondCall.args[0]).to.equals("updateLayerConfigs");
            expect(dispatch.secondCall.args[1]).to.deep.equals([
                {
                    id: "453"
                },
                {
                    id: ["717", "718", "719"],
                    visibility: true,
                    name: "Geobasiskarten (farbig)"
                }
            ]);
            expect(dispatch.thirdCall.args[0]).to.equals("updateLayerConfigs");
            expect(dispatch.thirdCall.args[1]).to.deep.equals([
                {
                    id: "1103"
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
            ]);
        });

        it("extend layers for special configuration with folders", () => {
            layerConfig = {
                Fachdaten: {
                    elements: [
                        {
                            id: "1132",
                            name: "100 Jahre Stadtgruen POIs",
                            visibility: true
                        },
                        {
                            id: "10220"
                        },
                        {
                            name: "Titel",
                            type: "folder",
                            elements: [
                                {
                                    name: "3 Layer",
                                    type: "folder",
                                    elements: [
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
                                        },
                                        {
                                            name: "Überschwemmungsgebiete",
                                            type: "folder",
                                            elements: [
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

            actions.extendLayers({dispatch, state});
            expect(dispatch.callCount).to.be.equals(2);
            expect(dispatch.firstCall.args[0]).to.equals("addBackgroundLayerAttribute");
            expect(dispatch.firstCall.args[1]).to.be.undefined;
            expect(dispatch.secondCall.args[0]).to.equals("updateLayerConfigs");
            expect(dispatch.secondCall.args[1]).to.deep.equals([
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
                },
                {
                    id: "1103",
                    visibility: true
                },
                {
                    id: "10220"
                },
                {
                    id: "1132",
                    name: "100 Jahre Stadtgruen POIs",
                    visibility: true
                }
            ]);
        });

        describe("addBackgroundLayerAttribute", () => {
            it("add the attribute background to Hintergrundkarten", () => {
                state.layerConfig = layerConfig;

                actions.addBackgroundLayerAttribute({state});

                expect(state.layerConfig.Hintergrundkarten.elements).to.deep.equals([
                    {
                        id: "453",
                        visibility: true,
                        backgroundLayer: true
                    },
                    {
                        id: "452",
                        backgroundLayer: true
                    }
                ]);
            });
        });

        describe("processTreeTypeAuto", () => {
            it("process raw layers in auto tree", () => {
                const getters = {
                    activeOrFirstCategory: () => {
                        return {
                            active: true,
                            key: "kategorie_opendata",
                            name: "common:tree.categoryOpendata"
                        };
                    }
                };

                state.portalConfig = {
                    tree: {
                        type: "auto",
                        validLayerTypesAutoTree: ["WMS", "SENSORTHINGS", "TERRAIN3D", "TILESET3D", "OBLIQUE"]
                    }
                };

                state.layerConfig = layerConfig;
                delete state.layerConfig.Fachdaten;

                layerList.splice(3, 2);
                layerList.splice(4, 3);

                actions.processTreeTypeAuto({commit, getters, state}, layerConfig.Hintergrundkarten.elements);

                expect(commit.calledOnce).to.be.true;
                expect(commit.firstCall.args[0]).to.equals("setLayerConfigByParentKey");
                expect(commit.firstCall.args[1]).to.deep.equals({
                    layerConfigs: {
                        elements: []
                    },
                    parentKey: "Fachdaten"
                });
            });
        });

        describe("updateLayerConfigs", () => {
            it("update layer configs", () => {
                actions.updateLayerConfigs({commit, state}, layerList);

                expect(commit.callCount).to.be.equals(9);
                expect(commit.alwaysCalledWith("replaceByIdInLayerConfig"));
                expect(commit.firstCall.args[1].layerConfigs[0].layer).to.deep.equals(layerList[0]);
                expect(commit.secondCall.args[1].layerConfigs[0].layer).to.deep.equals(layerList[1]);
                expect(commit.thirdCall.args[1].layerConfigs[0].layer).to.deep.equals(layerList[2]);
                expect(commit.lastCall.args[1].layerConfigs[0].layer).to.deep.equals(layerList[8]);
            });
        });
    });
});
