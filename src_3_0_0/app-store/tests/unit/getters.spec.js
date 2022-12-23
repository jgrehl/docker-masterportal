import {expect} from "chai";
import getters from "../../getters";
import stateAppStore from "../../state";

describe("src_3_0_0/app-store/getters.js", () => {
    describe("allConfigsLoaded", () => {
        it("should return true, if all configs are loaded", () => {
            const state = {
                loadedConfigs: {
                    configJson: true,
                    restServicesJson: true,
                    servicesJson: true
                }
            };

            expect(getters.allConfigsLoaded(stateAppStore)).to.be.false;
            expect(getters.allConfigsLoaded(state)).to.be.true;
        });
    });

    describe("allLayerConfigs", () => {
        it("should returns the configs of all layers", () => {
            const state = {
                layerConfig: {
                    Fachdaten: {
                        elements: [
                            {
                                id: 1
                            },
                            {
                                id: 2,
                                visibility: true
                            }
                        ]
                    },
                    Hintergrundkarten: {
                        elements: [
                            {
                                id: 100,
                                visibility: true
                            },
                            {
                                id: 200
                            }
                        ]
                    }
                }
            };

            expect(getters.allLayerConfigs(stateAppStore)).to.be.an("array").that.is.empty;
            expect(getters.allLayerConfigs(state)).to.be.an("array").to.deep.equals([
                {
                    id: 1
                },
                {
                    id: 2,
                    visibility: true
                },
                {
                    id: 100,
                    visibility: true
                },
                {
                    id: 200
                }
            ]);
        });
    });

    describe("visibleLayerConfigs", () => {
        it("should return all visible layers", () => {
            const greenLayer = {
                    id: "1132",
                    name: "100 Jahre Stadtgruen POIs",
                    visibility: true
                },
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
                            greenLayer,
                            {
                                id: "10220"
                            }
                        ]
                    }
                },
                state = {
                    layerConfig: layerConfig
                };

            expect(getters.visibleLayerConfigs(stateAppStore)).to.be.an("array");
            expect(getters.visibleLayerConfigs(stateAppStore).length).to.be.equals(0);
            expect(getters.visibleLayerConfigs(state)).to.be.an("array");
            expect(getters.visibleLayerConfigs(state).length).to.be.equals(2);
            expect(getters.visibleLayerConfigs(state)[0].id).to.be.equals("453");
            expect(getters.visibleLayerConfigs(state)[0].visibility).to.be.true;
            expect(getters.visibleLayerConfigs(state)[1]).to.be.equals(greenLayer);
        });

        it("should return all visible layers - ids as array", () => {
            const layer = {
                    "id": [
                        "717",
                        "718",
                        "719",
                        "720",
                        "13712",
                        "13709",
                        "13714",
                        "13716"
                    ],
                    visibility: true,
                    name: "Geobasiskarten (farbig)"
                },
                layerConfig = {
                    Hintergrundkarten: {
                        elements: [
                            layer,
                            {
                                id: "453"
                            }
                        ]
                    }
                },
                state = {
                    layerConfig: layerConfig
                };

            expect(getters.visibleLayerConfigs(stateAppStore)).to.be.an("array");
            expect(getters.visibleLayerConfigs(stateAppStore).length).to.be.equals(0);
            expect(getters.visibleLayerConfigs(state)).to.be.an("array");
            expect(getters.visibleLayerConfigs(state).length).to.be.equals(1);
            expect(getters.visibleLayerConfigs(state)[0]).to.be.equals(layer);
        });

        it("should return all visible layers - grouped layer", () => {
            const layerConfig = {
                    name: "Gruppenlayer",
                    type: "group",
                    elements: [
                        {
                            id: "xyz",
                            children: [
                                {
                                    id: "682"
                                },
                                {
                                    id: "1731"
                                }
                            ],
                            visibility: true,
                            name: "Kita und Krankenhäuser"
                        }
                    ]
                },
                state = {
                    layerConfig: layerConfig
                };

            expect(getters.visibleLayerConfigs(state)).to.be.an("array");
            expect(getters.visibleLayerConfigs(state).length).to.be.equals(1);
            expect(getters.visibleLayerConfigs(state)[0].children).to.be.an("array");
            expect(getters.visibleLayerConfigs(state)[0].children.length).to.be.equals(2);
            expect(getters.visibleLayerConfigs(state)[0].children[0].id).to.be.equals("682");
            expect(getters.visibleLayerConfigs(state)[0].children[1].id).to.be.equals("1731");
            expect(getters.visibleLayerConfigs(state)[0].id).to.be.equals("xyz");
            expect(getters.visibleLayerConfigs(state)[0].visibility).to.be.true;
            expect(getters.visibleLayerConfigs(state)[0].name).to.be.equals("Kita und Krankenhäuser");
        });
    });

    describe("allLayerConfigsStructured", () => {
        let state,
            layerConfig,
            layersWithFolder;

        beforeEach(() => {
            layersWithFolder = [
                {
                    name: "Titel Ebene 1",
                    type: "folder",
                    elements: [
                        {
                            name: "Titel Ebene 2",
                            type: "folder",
                            elements: [{
                                "id": "1"
                            },
                            {
                                id: "2"
                            },
                            {
                                name: "Titel Ebene 3",
                                type: "folder",
                                elements: [{
                                    id: "3"
                                }]
                            }]
                        }
                    ]
                }];
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
                    elements: layersWithFolder
                }
            };
            state = {
                layerConfig: layerConfig
            };
        });
        it("should return all layerConfigs of first level", () => {
            const configs = getters.allLayerConfigsStructured(state)();

            expect(configs).to.be.an("array");
            expect(configs.length).to.be.equals(3);
            expect(configs[0].id).to.be.equals("453");
            expect(configs[1].id).to.be.equals("452");
            expect(configs[2].type).to.be.equals("folder");
            expect(configs[2].name).to.be.equals("Titel Ebene 1");
            expect(configs[2].elements.length).to.be.equals(1);
            expect(configs[2].elements).to.be.deep.equals(layersWithFolder[0].elements);
        });

        it("should return all layerConfigs of first level by key 'Fachdaten'", () => {
            const configs = getters.allLayerConfigsStructured(state)("Fachdaten");

            expect(configs).to.be.an("array");
            expect(configs.length).to.be.equals(1);
            expect(configs[0].type).to.be.equals("folder");
            expect(configs[0].name).to.be.equals("Titel Ebene 1");
            expect(configs[0].elements.length).to.be.equals(1);
            expect(configs[0].elements).to.be.deep.equals(layersWithFolder[0].elements);
        });
        it("should return all layerConfigs of first level by key 'Hintergrundkarten'", () => {
            const configs = getters.allLayerConfigsStructured(state)("Hintergrundkarten");

            expect(configs).to.be.an("array");
            expect(configs.length).to.be.equals(2);
            expect(configs[0].id).to.be.equals("453");
            expect(configs[1].id).to.be.equals("452");
        });
    });

    describe("layerConfigsByArributes", () => {

        it("should return the layers for requested attributes", () => {
            const greenLayer = {
                    id: "1132",
                    name: "100 Jahre Stadtgruen POIs",
                    visibility: true
                },
                bgLayer = {
                    id: "453",
                    gfiAttributes: {
                        "standort": "Standort",
                        "adresse": "Adresse"
                    },
                    visibility: true
                },
                layerConfig = {
                    Hintergrundkarten: {
                        elements: [
                            bgLayer,
                            {
                                id: "452"
                            }
                        ]
                    },
                    Fachdaten: {
                        elements: [
                            greenLayer,
                            {
                                id: "10220"
                            }
                        ]
                    }
                },
                state = {
                    layerConfig: layerConfig
                };

            expect(getters.layerConfigsByArributes(state)(undefined)).to.be.an("array");
            expect(getters.layerConfigsByArributes(state)({id: "1132"})).to.be.an("array");
            expect(getters.layerConfigsByArributes(state)({id: "1132"}).length).to.be.equals(1);
            expect(getters.layerConfigsByArributes(state)({id: "1132"})[0]).to.be.deep.equals(greenLayer);
            expect(getters.layerConfigsByArributes(state)({visibility: true}).length).to.be.equals(2);
            expect(getters.layerConfigsByArributes(state)({visibility: true})).to.be.deep.equals([bgLayer, greenLayer]);
            expect(getters.layerConfigsByArributes(state)({visibility: true, id: "1132"}).length).to.be.equals(1);
            expect(getters.layerConfigsByArributes(state)({visibility: true, id: "453"}).length).to.be.equals(1);
            // @todo testen
            // expect(getters.layerConfigsByArributes(state)({ gfiAttributes : {
            //     "standort" : "Standort",
            //     "adresse" : "Adresse"
            // },}).length).to.be.equals(1);
        });
    });
});
