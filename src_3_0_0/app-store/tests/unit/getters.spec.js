import {expect} from "chai";
import {treeBaselayersKey, treeSubjectsKey} from "../../../shared/js/utils/constants";
import getters from "../../getters";
import stateAppStore from "../../state";
import sinon from "sinon";

describe("src_3_0_0/app-store/getters.js", () => {
    let warn;

    beforeEach(() => {
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);
    });

    afterEach(() => {
        sinon.restore();
    });

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
                    [treeSubjectsKey]: {
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
                    [treeBaselayersKey]: {
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
                    [treeBaselayersKey]: {
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
                    [treeSubjectsKey]: {
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
                    [treeBaselayersKey]: {
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

    describe("visibleBaselayerConfigs", () => {
        it("should return all visible baselayers", () => {
            const greenLayer = {
                    id: "1132",
                    name: "100 Jahre Stadtgruen POIs",
                    visibility: true
                },
                layerConfig = {
                    [treeBaselayersKey]: {
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
                    [treeSubjectsKey]: {
                        elements: [
                            greenLayer,
                            {
                                id: "10220",
                                visibility: true
                            }
                        ]
                    }
                },
                state = {
                    layerConfig: layerConfig
                };

            expect(getters.visibleBaselayerConfigs(state)[0]).to.deep.equal(layerConfig[treeBaselayersKey].elements[0]);
            expect(getters.visibleBaselayerConfigs(state)[0].id).to.deep.equal("453");
        });
    });

    describe("allLayerConfigsStructured and allLayerConfigsByParentKey", () => {
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
                [treeBaselayersKey]: {
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
                [treeSubjectsKey]: {
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
            const configs = getters.allLayerConfigsStructured(state)(treeSubjectsKey);

            expect(configs).to.be.an("array");
            expect(configs.length).to.be.equals(1);
            expect(configs[0].type).to.be.equals("folder");
            expect(configs[0].name).to.be.equals("Titel Ebene 1");
            expect(configs[0].elements.length).to.be.equals(1);
            expect(configs[0].elements).to.be.deep.equals(layersWithFolder[0].elements);
        });
        it("should return all layerConfigs of first level by key 'Baselayer'", () => {
            const configs = getters.allLayerConfigsStructured(state)(treeBaselayersKey);

            expect(configs).to.be.an("array");
            expect(configs.length).to.be.equals(2);
            expect(configs[0].id).to.be.equals("453");
            expect(configs[1].id).to.be.equals("452");
        });

        it("allLayerConfigsByParentKey should return all layerConfigs key 'Baselayer'", () => {
            const configs = getters.allLayerConfigsByParentKey(state)(treeBaselayersKey);

            expect(configs).to.be.an("array");
            expect(configs.length).to.be.equals(2);
            expect(configs[0].id).to.be.equals("453");
            expect(configs[1].id).to.be.equals("452");
        });

        it("allLayerConfigsByParentKey should return all layerConfigs key 'Fachdaten'", () => {
            const configs = getters.allLayerConfigsByParentKey(state)(treeSubjectsKey);

            expect(configs).to.be.an("array");
            expect(configs.length).to.be.equals(3);
            expect(configs[0].id).to.be.equals("1");
            expect(configs[1].id).to.be.equals("2");
            expect(configs[2].id).to.be.equals("3");
        });
    });

    describe("layerConfigsByAttributes", () => {
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
                    [treeBaselayersKey]: {
                        elements: [
                            bgLayer,
                            {
                                id: "452"
                            }
                        ]
                    },
                    [treeSubjectsKey]: {
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

            expect(getters.layerConfigsByAttributes(state)(undefined)).to.be.an("array");
            expect(getters.layerConfigsByAttributes(state)({id: "1132"})).to.be.an("array");
            expect(getters.layerConfigsByAttributes(state)({id: "1132"}).length).to.be.equals(1);
            expect(getters.layerConfigsByAttributes(state)({id: "1132"})[0]).to.be.deep.equals(greenLayer);
            expect(getters.layerConfigsByAttributes(state)({visibility: true}).length).to.be.equals(2);
            expect(getters.layerConfigsByAttributes(state)({visibility: true})).to.be.deep.equals([bgLayer, greenLayer]);
            expect(getters.layerConfigsByAttributes(state)({visibility: true, id: "1132"}).length).to.be.equals(1);
            expect(getters.layerConfigsByAttributes(state)({visibility: true, id: "453"}).length).to.be.equals(1);
            // @todo testen
            // expect(getters.layerConfigsByAttributes(state)({ gfiAttributes : {
            //     "standort" : "Standort",
            //     "adresse" : "Adresse"
            // },}).length).to.be.equals(1);
        });
    });

    describe("layerUrlParams", () => {
        it("should return the layers in tree for url params", () => {
            const state = {
                layerConfig: {
                    Fachdaten: {
                        elements: [
                            {
                                id: "1",
                                showInLayerTree: true,
                                visibility: true,
                                a: "b"
                            },
                            {
                                id: "2",
                                showInLayerTree: true,
                                visibility: false
                            },
                            {
                                id: "3",
                                showInLayerTree: false,
                                visibility: false
                            }
                        ]
                    },
                    Baselayer: {
                        elements: [
                            {
                                id: "100",
                                transparency: "50",
                                showInLayerTree: true,
                                visibility: true
                            }
                        ]
                    }
                }
            };

            expect(getters.layerUrlParams(state)).to.deep.equals([
                {
                    id: "1",
                    visibility: true
                },
                {
                    id: "2",
                    visibility: false
                },
                {
                    id: "100",
                    transparency: "50",
                    visibility: true
                }
            ]);
        });
    });

    describe("determineZIndex", () => {
        let layerConfig, state;

        beforeEach(() => {
            layerConfig = {
                [treeBaselayersKey]: {
                    elements: [
                        {
                            id: "453",
                            baselayer: true,
                            zIndex: 0
                        },
                        {
                            id: "452",
                            baselayer: true
                        },
                        {
                            id: "451",
                            baselayer: true
                        }
                    ]
                },
                [treeSubjectsKey]: {
                    elements: [
                        {
                            id: "1132",
                            name: "100 Jahre Stadtgruen POIs",
                            visibility: true
                        },
                        {
                            id: "10220",
                            baselayer: false
                        }
                    ]
                }
            };
            state = {
                layerConfig: layerConfig
            };
        });
        it("determineZIndex for unknown layer", () => {
            expect(getters.determineZIndex(state)("unknown")).to.be.null;
        });
        it("determineZIndex for first layer with zIndex under parentKey", () => {
            expect(getters.determineZIndex(state)("10220")).to.be.equals(0);
        });
        it("determineZIndex for second layer with zIndex under parentKey", () => {
            expect(getters.determineZIndex(state)("452")).to.be.equals(1);
        });
        it("determineZIndex for third layer with zIndex under parentKey", () => {
            layerConfig[treeBaselayersKey].elements[1].zIndex = 1;
            expect(getters.determineZIndex(state)("451")).to.be.equals(2);
        });
        it("determineZIndex for layer with existing zIndex", () => {
            layerConfig[treeBaselayersKey].elements[0].zIndex = 100;
            expect(getters.determineZIndex(state)("453")).to.be.equals(100);
        });
    });

    describe("invisibleBaselayerConfigs", () => {
        it("should return all invisible baselayers", () => {
            const layerConfig = {
                    [treeBaselayersKey]: {
                        elements: [
                            {
                                id: "453",
                                visibility: true
                            },
                            {
                                id: "452"
                            },
                            {
                                id: "1132",
                                name: "Luftbild",
                                visibility: false
                            }
                        ]
                    },
                    [treeSubjectsKey]: {
                        elements: [
                            {
                                id: "10220"
                            }
                        ]
                    }
                },
                state = {
                    layerConfig: layerConfig
                };

            expect(getters.invisibleBaselayerConfigs(state)).to.be.an("array");
            expect(getters.invisibleBaselayerConfigs(state).length).to.be.equals(2);
            expect(getters.invisibleBaselayerConfigs(state)[0].id).to.be.equals("452");
            expect(getters.invisibleBaselayerConfigs(state)[1].id).to.be.equals("1132");
        });
    });
    describe("isModuleAvailable", () => {
        it("should return true, if module is configured in config.json by type and false if not", () => {
            const state = {
                portalConfig: {
                    mainMenu: {
                        expanded: true,
                        title: {
                            text: "Basic 3 alpha"
                        },
                        sections: [
                            [
                                {
                                    type: "fileImport"
                                },
                                {
                                    type: "openConfig"
                                },
                                {
                                    type: "contact",
                                    serviceId: "80001",
                                    includeSystemInfo: true,
                                    from: [
                                        {
                                            email: "lgvgeoportal-hilfe@gv.hamburg.de",
                                            name: "LGVGeoportalHilfe"
                                        }
                                    ],
                                    to: [
                                        {
                                            email: "lgvgeoportal-hilfe@gv.hamburg.de",
                                            name: "LGVGeoportalHilfe"
                                        }
                                    ]
                                },
                                {
                                    type: "language"
                                }
                            ]
                        ]
                    }
                }
            };

            expect(getters.isModuleAvailable(state)("language")).to.be.true;
            expect(getters.isModuleAvailable(state)("contact")).to.be.true;
            expect(getters.isModuleAvailable(state)("routing")).to.be.false;
            expect(getters.isModuleAvailable(state)()).to.be.false;

        });
    });
});
