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
    describe("allVisibleLayerConfigs", () => {
        it("should return all visible layers", () => {
            const greenLayer = {
                    id: "1132",
                    name: "100 Jahre Stadtgruen POIs",
                    visibility: true
                },
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

            expect(getters.allVisibleLayerConfigs(stateAppStore)).to.be.an("array");
            expect(getters.allVisibleLayerConfigs(stateAppStore).length).to.be.equals(0);
            expect(getters.allVisibleLayerConfigs(state)).to.be.an("array");
            expect(getters.allVisibleLayerConfigs(state).length).to.be.equals(2);
            expect(getters.allVisibleLayerConfigs(state)[0].id).to.be.equals("453");
            expect(getters.allVisibleLayerConfigs(state)[0].visibility).to.be.true;
            expect(getters.allVisibleLayerConfigs(state)[1]).to.be.equals(greenLayer);
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
                        Layer: [
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

            expect(getters.allVisibleLayerConfigs(stateAppStore)).to.be.an("array");
            expect(getters.allVisibleLayerConfigs(stateAppStore).length).to.be.equals(0);
            expect(getters.allVisibleLayerConfigs(state)).to.be.an("array");
            expect(getters.allVisibleLayerConfigs(state).length).to.be.equals(1);
            expect(getters.allVisibleLayerConfigs(state)[0]).to.be.equals(layer);
        });

        it("should return all visible layers - grouped layer", () => {
            const layerConfig = {
                    Titel: "Gruppenlayer",
                    Layer: [
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

            expect(getters.allVisibleLayerConfigs(state)).to.be.an("array");
            expect(getters.allVisibleLayerConfigs(state).length).to.be.equals(1);
            expect(getters.allVisibleLayerConfigs(state)[0].children).to.be.an("array");
            expect(getters.allVisibleLayerConfigs(state)[0].children.length).to.be.equals(2);
            expect(getters.allVisibleLayerConfigs(state)[0].children[0].id).to.be.equals("682");
            expect(getters.allVisibleLayerConfigs(state)[0].children[1].id).to.be.equals("1731");
            expect(getters.allVisibleLayerConfigs(state)[0].id).to.be.equals("xyz");
            expect(getters.allVisibleLayerConfigs(state)[0].visibility).to.be.true;
            expect(getters.allVisibleLayerConfigs(state)[0].name).to.be.equals("Kita und Krankenhäuser");
        });
    });
});
