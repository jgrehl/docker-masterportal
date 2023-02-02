import rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";
import sinon from "sinon";
import {expect} from "chai";
import {treeTopicConfigKey, treeBackgroundsKey, treeSubjectsKey} from "../../../shared/js/utils/constants";
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
                }],
                zIndex: 0
            },
            {
                id: "452",
                name: "name452",
                typ: "WMS",
                datasets: [{
                    md_id: "B6A59A2B-2D40-4676-9094-efg",
                    md_name: "md_name_452"
                }],
                zIndex: 1
            },
            {
                id: "1132",
                name: "name1132",
                typ: "SENSORTHINGS",
                datasets: [{
                    md_id: "B6A59A2B-2D40-4676-9094-abc",
                    md_name: "md_name_1132"
                }],
                zIndex: 2
            },
            {
                id: "10220",
                name: "layer10220",
                typ: "WFS",
                datasets: [{
                    md_id: "B6A59A2B-2D40-4676-9094-hghghg",
                    md_name: "md_name_10220"
                }],
                zIndex: 3
            },
            {
                id: "451",
                name: "name451",
                typ: "WFS",
                zIndex: 4
            },
            {
                id: "1103",
                name: "Überschwemmungsgebiete",
                typ: "WMS",
                transparent: true,
                transparency: 0,
                datasets: [{
                    md_id: "0879B86F-4F44-45AA-BA5B-021D9D30AAEF"
                }],
                zIndex: 5
            },
            {
                id: "717",
                name: "name717",
                layers: "layer717",
                maxScale: "10000",
                minScale: "10",
                typ: "WMS",
                zIndex: 6
            },
            {
                id: "718",
                name: "name718",
                layers: "layer718",
                maxScale: "30000",
                minScale: "30",
                typ: "WMS",
                zIndex: 7
            },
            {
                id: "719",
                name: "name719",
                layers: "layer719",
                maxScale: "20000",
                minScale: "20",
                typ: "WMS",
                zIndex: 8
            }
        ];
        layerConfig = {};
        layerConfig[treeBackgroundsKey] =
        {
            elements: [
                {
                    id: "453",
                    visibility: true
                },
                {
                    id: "452"
                }
            ]
        };
        layerConfig[treeSubjectsKey] = {
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
        };
        layerConfigCustom = {};
        layerConfigCustom[treeBackgroundsKey] = {
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
        };
        layerConfigCustom[treeSubjectsKey] = {
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
                [treeTopicConfigKey]: layerConfig
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
            layerConfig[treeSubjectsKey] = {
                elements: []
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

                },
                getters = {
                    allLayerConfigs: [],
                    allLayerConfigsByParentKey: () => []
                };

            actions.addLayerToLayerConfig({dispatch, getters, state}, {layerConfig: layerToAdd, parentKey: treeSubjectsKey});
            expect(dispatch.callCount).to.equals(2);
            expect(dispatch.firstCall.args[0]).to.equals("updateLayerConfigZIndex");
            expect(dispatch.firstCall.args[1]).to.deep.equals({
                layerContainer: [],
                maxZIndex: -Infinity
            });
            expect(dispatch.secondCall.args[0]).to.equals("addBackgroundLayerAttribute");
            expect(dispatch.secondCall.args[1]).to.be.undefined;
            expect(state.layerConfig[treeSubjectsKey]?.elements.length).to.equal(1);
            expect(state.layerConfig[treeSubjectsKey]?.elements[0]).to.deep.equal(layerToAdd);
        });
    });

    describe("updateLayerConfigZIndex", () => {
        it("Should set new zindex for layer with zIndex greater than maxZIndex", () => {
            const layerContainer = layerList.slice(0, 5),
                maxZIndex = 2,
                resultZIndex = [0, 1, 2, 4, 5];

            actions.updateLayerConfigZIndex({}, {layerContainer, maxZIndex});

            layerContainer.forEach((layerContainerConf, index) => {
                expect(layerContainerConf.zIndex).to.equals(resultZIndex[index]);
            });
        });
    });

    describe("extendLayers", () => {
        it("extend layers for simple tree", () => {
            state.layerConfig = layerConfig;
            actions.extendLayers({dispatch, state});

            expect(dispatch.callCount).to.equals(2);
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

        it("extend layer configs for custom tree", () => {
            state.layerConfig = layerConfigCustom;
            actions.extendLayers({dispatch, state});

            expect(dispatch.callCount).to.be.equals(2);
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
                },
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
                [treeSubjectsKey]: {
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
                const getters = {
                    allLayerConfigsByParentKey: () => layerConfig[treeBackgroundsKey].elements
                };

                actions.addBackgroundLayerAttribute({getters});

                expect(layerConfig[treeBackgroundsKey].elements).to.deep.equals([
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
                delete state.layerConfig[treeSubjectsKey];

                layerList.splice(3, 2);
                layerList.splice(4, 3);

                actions.processTreeTypeAuto({commit, getters, state}, layerConfig[treeBackgroundsKey].elements);

                expect(commit.calledOnce).to.be.true;
                expect(commit.firstCall.args[0]).to.equals("setLayerConfigByParentKey");
                expect(commit.firstCall.args[1]).to.deep.equals({
                    layerConfigs: {
                        elements: []
                    },
                    parentKey: treeSubjectsKey
                });
            });
        });

        describe("replaceByIdInLayerConfig", () => {
            it("replaceByIdInLayerConfig layer is contained in layerConfig", () => {
                const toReplace = {
                    id: "453",
                    visibility: true,
                    att1: "bla",
                    att2: [{
                        foo: "foo",
                        bar: "bar"
                    }]
                };

                state.layerConfig = layerConfig;

                actions.replaceByIdInLayerConfig({state}, {layerConfigs: [{layer: toReplace, id: "453"}]});

                expect(state.layerConfig[treeBackgroundsKey].elements).to.be.an("array");
                expect(state.layerConfig[treeBackgroundsKey].elements.length).to.be.equals(2);
                expect(Object.keys(state.layerConfig[treeBackgroundsKey]?.elements[0]).length).to.be.equals(4);
                expect(state.layerConfig[treeBackgroundsKey]?.elements[0].id).to.be.equals("453");
                expect(state.layerConfig[treeBackgroundsKey]?.elements[0].visibility).to.be.true;
                expect(state.layerConfig[treeBackgroundsKey]?.elements[0].att1).to.be.equals("bla");
                expect(state.layerConfig[treeBackgroundsKey]?.elements[0].att2).to.be.deep.equals(toReplace.att2);
                expect(state.layerConfig[treeBackgroundsKey]?.elements[1].id).to.be.equals("452");
                expect(Object.keys(state.layerConfig[treeBackgroundsKey]?.elements[1]).length).to.be.equals(1);

                expect(state.layerConfig[treeSubjectsKey]?.elements).to.be.an("array");
                expect(state.layerConfig[treeSubjectsKey]?.elements.length).to.be.equals(2);
                expect(state.layerConfig[treeSubjectsKey]?.elements[0].id).to.be.equals("1132");
                expect(Object.keys(state.layerConfig[treeSubjectsKey]?.elements[0]).length).to.be.equals(3);
                expect(state.layerConfig[treeSubjectsKey]?.elements[1].id).to.be.equals("10220");
                expect(Object.keys(state.layerConfig[treeSubjectsKey]?.elements[1]).length).to.be.equals(1);
            });

            it("replaceByIdInLayerConfig layer is not contained in layerConfig", () => {
                const toReplace = {
                    id: "unknown",
                    visibility: true,
                    att1: "bla",
                    att2: [{
                        foo: "foo",
                        bar: "bar"
                    }]
                };
                let stateCopy = null;

                state.layerConfig = layerConfig;
                stateCopy = {...state};

                actions.replaceByIdInLayerConfig({state}, {layerConfigs: [{layer: toReplace, id: "unknown"}]});
                expect(state).to.be.deep.equals(stateCopy);
            });

            it("replaceByIdInLayerConfig toReplace-layer is undefined", () => {
                let stateCopy = null;

                state.layerConfig = layerConfig;
                stateCopy = {...state};

                actions.replaceByIdInLayerConfig({state}, undefined);
                expect(state).to.be.deep.equals(stateCopy);
            });
        });

        describe("updateAllZIndexes", () => {
            it("updateAllZIndexes does not set zIndexes, if no zIndexes are set before", () => {
                const getters = {
                    allLayerConfigsByParentKey: (key) => {
                        if (key === treeBackgroundsKey) {
                            return layerConfig[treeBackgroundsKey].elements;
                        }
                        return layerConfig[treeSubjectsKey].elements;
                    }
                };

                actions.updateAllZIndexes({dispatch, getters});
                expect(layerConfig[treeBackgroundsKey].elements[0].zIndex).to.be.undefined;
                expect(layerConfig[treeBackgroundsKey].elements[1].zIndex).to.be.undefined;
                expect(layerConfig[treeSubjectsKey].elements[0].zIndex).to.be.undefined;
                expect(layerConfig[treeSubjectsKey].elements[1].zIndex).to.be.undefined;
            });

            it("updateAllZIndexes with all zIndexes are set before", () => {
                const getters = {
                    allLayerConfigsByParentKey: (key) => {
                        if (key === treeBackgroundsKey) {
                            return layerConfig[treeBackgroundsKey].elements;
                        }
                        return layerConfig[treeSubjectsKey].elements;
                    }
                };

                layerConfig[treeBackgroundsKey].elements[0].zIndex = 0;
                layerConfig[treeBackgroundsKey].elements[1].zIndex = 1;
                layerConfig[treeSubjectsKey].elements[0].zIndex = 5;
                layerConfig[treeSubjectsKey].elements[1].zIndex = 6;
                actions.updateAllZIndexes({getters});

                expect(layerConfig[treeBackgroundsKey].elements[0].zIndex).to.be.equals(0);
                expect(layerConfig[treeBackgroundsKey].elements[1].zIndex).to.be.equals(1);
                expect(layerConfig[treeSubjectsKey].elements[0].zIndex).to.be.equals(2);
                expect(layerConfig[treeSubjectsKey].elements[1].zIndex).to.be.equals(3);
            });

            it("updateAllZIndexes with some zIndexes are set before", () => {
                const getters = {
                    allLayerConfigsByParentKey: (key) => {
                        if (key === treeBackgroundsKey) {
                            return layerConfig[treeBackgroundsKey].elements;
                        }
                        return layerConfig[treeSubjectsKey].elements;
                    }
                };

                layerConfig[treeBackgroundsKey].elements[0].zIndex = 0;
                layerConfig[treeSubjectsKey].elements[0].zIndex = 5;
                layerConfig[treeSubjectsKey].elements[1].zIndex = 6;
                actions.updateAllZIndexes({getters});

                expect(layerConfig[treeBackgroundsKey].elements[0].zIndex).to.be.equals(0);
                expect(layerConfig[treeBackgroundsKey].elements[1].zIndex).to.be.equals(undefined);
                expect(layerConfig[treeSubjectsKey].elements[0].zIndex).to.be.equals(1);
                expect(layerConfig[treeSubjectsKey].elements[1].zIndex).to.be.equals(2);
            });
        });
    });
});
