import layerUrlParams from "../../../js/layerUrlParams";
import store from "../../../../../app-store";
import {expect} from "chai";
import rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";
import sinon from "sinon";

describe("src_3_0_0/core/layers/js/layerUrlParams.js", () => {
    let dispatchCalls = [],
        zIndex;

    beforeEach(() => {
        zIndex = 1;
        dispatchCalls = [];

        store.dispatch = (arg1, arg2) => {
            const dispatchCall = {};

            dispatchCall[arg1] = arg2 !== undefined ? arg2 : "called";
            dispatchCalls.push(dispatchCall);
        };

        store.getters = {
            layerConfigsByAttributes: () => {
                return [];
            },
            layerConfigById: () => true
        };
    });

    describe("setLayers", () =>{
        it("should replace the layers from the params", () => {
            const params = {
                LAYERS: "[{\"id\": \"2426\"},{\"id\":\"1711\",\"visibility\":false},{\"id\":\"452\",\"visibility\":true,\"transparency\":50}]"
            };

            layerUrlParams.setLayers(params);

            expect(dispatchCalls.length).to.equals(3);
            expect(dispatchCalls[0].replaceByIdInLayerConfig).to.deep.equals({
                layerConfigs: [
                    {
                        id: "2426",
                        layer: {
                            id: "2426",
                            showInLayerTree: true,
                            visibility: true,
                            zIndex: 1
                        }
                    }
                ]
            });
            expect(dispatchCalls[1].replaceByIdInLayerConfig).to.deep.equals({
                layerConfigs: [
                    {
                        id: "1711",
                        layer: {
                            id: "1711",
                            showInLayerTree: true,
                            visibility: false,
                            zIndex: 2
                        }
                    }
                ]
            });
            expect(dispatchCalls[2].replaceByIdInLayerConfig).to.deep.equals({
                layerConfigs: [
                    {
                        id: "452",
                        layer: {
                            id: "452",
                            showInLayerTree: true,
                            transparency: 50,
                            visibility: true,
                            zIndex: 3
                        }
                    }
                ]
            });
        });
    });

    describe("setLayerIds", () =>{
        it("should replace the layers from the params", () => {
            const params = {
                "MAP/LAYERIDS": "452,1711",
                TRANSPARENCY: "50,0",
                VISIBILITY: "true,false"
            };

            layerUrlParams.setLayerIds(params);

            expect(dispatchCalls.length).to.equals(2);
            expect(dispatchCalls[0].replaceByIdInLayerConfig).to.deep.equals({
                layerConfigs: [
                    {
                        id: "452",
                        layer: {
                            id: "452",
                            showInLayerTree: true,
                            transparency: "50",
                            visibility: true,
                            zIndex: 1
                        }
                    }
                ]
            });
            expect(dispatchCalls[1].replaceByIdInLayerConfig).to.deep.equals({
                layerConfigs: [
                    {
                        id: "1711",
                        layer: {
                            id: "1711",
                            showInLayerTree: true,
                            transparency: "0",
                            visibility: false,
                            zIndex: 2
                        }
                    }
                ]
            });
        });
    });

    describe("setLayersByMetadataId", () =>{
        beforeEach(() => {
            store.getters = {
                allLayerConfigs: [
                    {
                        id: "2425",
                        datasets: [
                            {
                                md_id: "F35EAC11-C236-429F-B1BF-751C0C18E8B7"
                            }
                        ]
                    },
                    {
                        id: "2426",
                        datasets: [
                            {
                                md_id: "F35EAC11-C236-429F-B1BF-751C0C18E8B7"
                            }
                        ]
                    }
                ],
                determineZIndex: () => zIndex++,
                layerConfigsByAttributes: () => {
                    return [
                        {
                            id: "452"
                        }
                    ];
                },
                layerConfigById: () => true
            };
        });

        it("should replace the layers from the params", () => {
            const params = {
                MDID: "F35EAC11-C236-429F-B1BF-751C0C18E8B7"
            };

            layerUrlParams.setLayersByMetadataId(params);

            expect(dispatchCalls.length).to.equals(4);
            expect(dispatchCalls[0].replaceByIdInLayerConfig).to.deep.equals({
                layerConfigs: [
                    {
                        id: "452",
                        layer: {
                            id: "452",
                            showInLayerTree: false,
                            visibility: false
                        }
                    }
                ]
            });
            expect(dispatchCalls[1].replaceByIdInLayerConfig).to.deep.equals({
                layerConfigs: [
                    {
                        id: "452",
                        layer: {
                            id: "452",
                            showInLayerTree: true,
                            visibility: true,
                            zIndex: 1
                        }
                    }
                ]
            });
            expect(dispatchCalls[2].replaceByIdInLayerConfig).to.deep.equals({
                layerConfigs: [
                    {
                        id: "2425",
                        layer: {
                            id: "2425",
                            showInLayerTree: true,
                            visibility: true,
                            zIndex: 2
                        }
                    }
                ]
            });
            expect(dispatchCalls[3].replaceByIdInLayerConfig).to.deep.equals({
                layerConfigs: [
                    {
                        id: "2426",
                        layer: {
                            id: "2426",
                            showInLayerTree: true,
                            visibility: true,
                            zIndex: 3
                        }
                    }
                ]
            });
        });
    });

    describe("removeCurrentLayerFromLayerTree", () => {
        beforeEach(() => {
            store.getters = {
                layerConfigsByAttributes: () => {
                    return [
                        {
                            id: "123"
                        },
                        {
                            id: "452"
                        }
                    ];
                }
            };
        });

        it("should set all layers invisible and remove from layer tree", () => {
            layerUrlParams.removeCurrentLayerFromLayerTree();

            expect(dispatchCalls.length).to.equals(2);
            expect(dispatchCalls[0].replaceByIdInLayerConfig).to.deep.equals({
                layerConfigs: [
                    {
                        id: "123",
                        layer: {
                            id: "123",
                            showInLayerTree: false,
                            visibility: false
                        }
                    }
                ]
            });
            expect(dispatchCalls[1].replaceByIdInLayerConfig).to.deep.equals({
                layerConfigs: [
                    {
                        id: "452",
                        layer: {
                            id: "452",
                            showInLayerTree: false,
                            visibility: false
                        }
                    }
                ]
            });
        });
    });

    describe("addLayerToLayerTree", () => {
        beforeEach(() => {
            store.getters = {
                layerConfigById: () => true
            };
        });
        it("should add all layers", () => {
            const layers = [
                {
                    id: "123"
                },
                {
                    id: "456"
                }
            ];

            layerUrlParams.addLayerToLayerTree(layers);

            expect(dispatchCalls.length).to.equals(2);
            expect(dispatchCalls[0].replaceByIdInLayerConfig).to.deep.equals({
                layerConfigs: [
                    {
                        id: "123",
                        layer: {
                            id: "123",
                            showInLayerTree: true,
                            visibility: true,
                            zIndex: 1
                        }
                    }
                ]
            });
            expect(dispatchCalls[1].replaceByIdInLayerConfig).to.deep.equals({
                layerConfigs: [
                    {
                        id: "456",
                        layer: {
                            id: "456",
                            showInLayerTree: true,
                            visibility: true,
                            zIndex: 2
                        }
                    }
                ]
            });
        });
        it("should add a layer that isn't in the config.json", () => {
            store.getters = {
                layerConfigById: () => false
            };
            const layers = [
                {
                    id: "123"
                }
            ];

            sinon.stub(rawLayerList, "getLayerWhere").returns({
                id: "123",
                showInLayerTree: true,
                type: "layer",
                visibility: true,
                zIndex: 1
            });

            layerUrlParams.addLayerToLayerTree(layers);

            expect(dispatchCalls.length).to.equals(1);
            expect(dispatchCalls[0].addLayerToLayerConfig).to.deep.equals({
                layerConfig: {
                    id: "123",
                    showInLayerTree: true,
                    type: "layer",
                    visibility: true,
                    zIndex: 1
                },
                parentKey: "Fachdaten"
            });
        });
    });
});
