import {expect} from "chai";
import Feature from "ol/Feature.js";
import {Icon} from "ol/style.js";
import Point from "ol/geom/Point.js";
import sinon from "sinon";

import layerCollection from "../../../../../core/layers/js/layerCollection";
import SearchInterface from "../../../searchInterfaces/searchInterface.js";
import SearchInterfaceVisibleVector from "../../../searchInterfaces/searchInterfaceVisibleVector.js";

describe("src/modules/searchBar/searchInterfaces/searchInterfaceVisibleVector.js", () => {
    let feature1,
        feature2,
        layer1,
        SearchInterface1 = null;

    before(() => {
        SearchInterface1 = new SearchInterfaceVisibleVector();
    });

    beforeEach(() => {
        feature1 = new Feature({
            geometry: new Point([10, 10]),
            name: "Hospital",
            searchField: "name",
            street: "Example-Street 1"
        });
        feature2 = new Feature({
            geometry: new Point([20, 20]),
            name: "School",
            searchField: "name"
        });
        feature1.setId("1");
        feature2.setId("2");

        layer1 = {
            attributes: {
                id: "123",
                additionalInfoField: "street",
                name: "The layer",
                searchField: "name",
                style: () => {
                    return {
                        getImage: () => sinon.stub()
                    };
                }
            },
            getLayerSource: () => {
                return {
                    getFeatures: () => {
                        return [feature1, feature2];
                    }
                };
            }
        };

        sinon.stub(layerCollection, "getLayerById").returns(layer1);
    });

    afterEach(() => {
        SearchInterface1.clearSearchResults();
        sinon.restore();
    });

    describe("prototype", () => {
        it("SearchInterfaceVisibleVector should have the prototype SearchInterface", () => {
            expect(SearchInterface1).to.be.an.instanceof(SearchInterface);
        });
    });

    describe("findMatchingFeatures", () => {
        it("should return one matched feature", () => {
            const visibleVectorLayerConfigs = [{
                    id: "123",
                    name: "The layer",
                    searchField: "name"
                }],
                searchInput = "hos";

            expect(SearchInterface1.findMatchingFeatures(visibleVectorLayerConfigs, searchInput)).to.deep.equals([
                {
                    events: {
                        onClick: {
                            openGetFeatureInfo: {
                                closeResults: true,
                                featureId: "1",
                                layerId: "123"
                            },
                            setMarker: {
                                closeResults: true,
                                coordinates: [
                                    10,
                                    10
                                ]
                            },
                            zoomToFeature: {
                                closeResults: true,
                                coordinates: [
                                    10,
                                    10
                                ]
                            }
                        },
                        onHover: {
                            setMarker: {
                                closeResults: true,
                                coordinates: [
                                    10,
                                    10
                                ]
                            }
                        }
                    },
                    category: "The layer",
                    displayedInfo: "Example-Street 1",
                    imagePath: "",
                    id: feature1.ol_uid,
                    name: "Hospital",
                    toolTip: "Hospital"
                }
            ]);
        });
    });

    describe("normalizeLayerResult", () => {
        it("should normalize result", () => {
            const searchField = "name";

            expect(SearchInterface1.normalizeResult(feature1, layer1, searchField)).to.deep.equals(
                {
                    events: {
                        onClick: {
                            openGetFeatureInfo: {
                                closeResults: true,
                                featureId: "1",
                                layerId: "123"
                            },
                            setMarker: {
                                closeResults: true,
                                coordinates: [
                                    10,
                                    10
                                ]
                            },
                            zoomToFeature: {
                                closeResults: true,
                                coordinates: [
                                    10,
                                    10
                                ]
                            }
                        },
                        onHover: {
                            setMarker: {
                                closeResults: true,
                                coordinates: [
                                    10,
                                    10
                                ]
                            }
                        }
                    },
                    category: "The layer",
                    displayedInfo: "Example-Street 1",
                    imagePath: "",
                    id: feature1.ol_uid,
                    name: "Hospital",
                    toolTip: "Hospital"
                }
            );
        });
    });

    describe("getAdditionalInfo", () => {
        it("should return the additional info field of the feature", () => {
            expect(SearchInterface1.getAdditionalInfo(feature1, layer1)).to.equals("Example-Street 1");
        });

        it("should return an empty string, if the feature has no additional field", () => {
            expect(SearchInterface1.getAdditionalInfo(feature2, layer1)).to.equals("");
        });
    });

    describe("getImageSource", () => {
        it("should return an empty string, if the feature has no image", () => {
            expect(SearchInterface1.getImageSource(feature2, layer1)).to.equals("");
        });
    });

    describe("getImageSourceFromStyle", () => {
        it("should return the image source", () => {
            const layerStyle = {
                getImage: () => new Icon({
                    src: "test.url"
                })
            };

            expect(SearchInterface1.getImageSourceFromStyle(layerStyle)).to.equals("test.url");
        });

        it("should return an empty string, if layer style has no image", () => {
            const layerStyle = {
                getImage: () => sinon.stub()
            };

            expect(SearchInterface1.getImageSourceFromStyle(layerStyle)).to.equals("");
        });
    });

    describe("createPossibleActions", () => {
        it("should create possible events from search result", () => {
            expect(SearchInterface1.createPossibleActions(feature1, layer1)).to.deep.equals(
                {
                    openGetFeatureInfo: {
                        closeResults: true,
                        featureId: "1",
                        layerId: "123"
                    },
                    setMarker: {
                        closeResults: true,
                        coordinates: [
                            10,
                            10
                        ]
                    },
                    zoomToFeature: {
                        closeResults: true,
                        coordinates: [
                            10,
                            10
                        ]
                    }
                }
            );
        });
    });
});
