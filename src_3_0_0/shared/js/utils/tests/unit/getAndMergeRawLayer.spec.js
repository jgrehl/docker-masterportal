import * as rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";
import {getAllRawLayerSortedByMdId, getAndMergeRawLayer} from "../../getAndMergeRawLayer.js";
import {expect} from "chai";
import sinon from "sinon";

describe("src/utils/getAndMergeRawLayer.js", () => {
    let layerConfig;

    afterEach(() => {
        sinon.restore();
    });

    describe("getAndMergeRawLayer", () => {
        it("should return null if no param is given", () => {
            expect(getAndMergeRawLayer()).to.be.null;
        });
        it("should return a simple raw layer", () => {
            const layerList = [
                {
                    id: "453",
                    name: "layer453"
                },
                {
                    id: "452",
                    name: "layer453"
                },
                {
                    id: "1132",
                    name: "layer1132"
                },
                {
                    id: "10220",
                    name: "layer10220"
                }
            ];
            let result = null;

            layerConfig = {
                Hintergrundkarten: {
                    Layer: [
                        {
                            id: "453",
                            visibility: true
                        }
                    ]
                }
            };
            sinon.stub(rawLayerList, "getLayerWhere").callsFake(function (searchAttributes) {
                return layerList.find(entry => Object.keys(searchAttributes).every(key => entry[key] === searchAttributes[key])) || null;
            });
            sinon.stub(rawLayerList, "getLayerList").returns(layerList);

            result = getAndMergeRawLayer(layerConfig.Hintergrundkarten.Layer[0]);

            expect(result).not.to.be.null;
            expect(result.id).to.be.equals("453");
            expect(result.name).to.be.equals("layer453");
            expect(result.visibility).to.be.true;
        });

        it("should return a merged raw layer, if ids are in an array", () => {
            layerConfig = {
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
                        }
                    ]
                }
            };
            const layerList = [
                {
                    id: "453",
                    name: "layer453"
                },
                {
                    id: "717",
                    name: "name717",
                    layers: "layer717",
                    maxScale: "10000",
                    minScale: "10"
                },
                {
                    id: "718",
                    name: "name718",
                    layers: "layer718",
                    maxScale: "30000",
                    minScale: "30"
                },
                {
                    id: "719",
                    name: "name719",
                    layers: "layer719",
                    maxScale: "20000",
                    minScale: "20"
                }
            ];
            let result = null;

            sinon.stub(rawLayerList, "getLayerWhere").callsFake(function (searchAttributes) {
                return layerList.find(entry => Object.keys(searchAttributes).every(key => entry[key] === searchAttributes[key])) || null;
            });
            sinon.stub(rawLayerList, "getLayerList").returns(layerList);

            result = getAndMergeRawLayer(layerConfig.Hintergrundkarten.Layer[0]);

            expect(result).not.to.be.null;
            expect(result.id).to.be.equals("717");
            expect(result.name).to.be.equals("Geobasiskarten (farbig)");
            expect(result.layers).to.be.equals("layer717,layer718,layer719");
            expect(result.maxScale).to.be.equals(30000);
            expect(result.minScale).to.be.equals(10);
            expect(result.visibility).to.be.true;
        });

        it("should return a merged raw layer, if layer is grouped", () => {
            layerConfig = {
                Fachdaten: {
                    Layer: [
                        {
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
                                    name: "Kita und Krankenhäuser"
                                }
                            ]
                        }
                    ]
                }
            };
            const layerList = [
                {
                    id: "682",
                    name: "name682"
                },
                {
                    id: "1731",
                    name: "name1731",
                    layers: "layer1731"
                }
            ];
            let result = null;

            sinon.stub(rawLayerList, "getLayerWhere").callsFake(function (searchAttributes) {
                return layerList.find(entry => Object.keys(searchAttributes).every(key => entry[key] === searchAttributes[key])) || null;
            });
            sinon.stub(rawLayerList, "getLayerList").returns(layerList);

            result = getAndMergeRawLayer(layerConfig.Fachdaten.Layer[0].Layer[0]);

            expect(result).not.to.be.null;
            expect(result.id).to.be.equals("xyz");
            expect(result.name).to.be.equals("Kita und Krankenhäuser");
            expect(result.typ).to.be.equals("GROUP");
            expect(result.children).to.be.an("array");
            expect(result.children.length).to.be.equals(2);
            expect(result.children[0].id).to.be.equals("682");
            expect(result.children[0].name).to.be.equals("name682");
            expect(result.children[1].id).to.be.equals("1731");
            expect(result.children[1].name).to.be.equals("name1731");
            expect(result.children[1].layers).to.be.equals("layer1731");
        });
    });

    describe("getAllRawLayerSortedByMdId", () => {
        let layerList, layerContainer;

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
                }
            ];
            layerContainer = [
                {
                    id: "453",
                    visibility: true
                }];
            sinon.stub(rawLayerList, "getLayerWhere").callsFake(function (searchAttributes) {
                return layerList.find(entry => Object.keys(searchAttributes).every(key => entry[key] === searchAttributes[key])) || null;
            });
            sinon.stub(rawLayerList, "getLayerList").returns(layerList);
        });

        afterEach(() => {
            sinon.restore();
        });

        it("should filter by typ, datasets and layerContainer (removeConfiguredLayer, filterValidLayer)", () => {
            const result = getAllRawLayerSortedByMdId(layerContainer);

            expect(result).to.be.an("array");
            expect(result.length).to.be.equals(2);
            expect(result[0]).to.be.deep.equals(layerList[1]);
            expect(result[1]).to.be.deep.equals(layerList[2]);
        });

        it("should delete layer with cache=true and same md_id (deleteLayersIncludeCache)", () => {
            let result = null;

            layerList[2].datasets[0].md_id = "B6A59A2B-2D40-4676-9094-efg";
            layerList[2].cache = false;
            layerList[1].cache = true;
            result = getAllRawLayerSortedByMdId(layerContainer);

            expect(result).to.be.an("array");
            expect(result.length).to.be.equals(1);
            expect(result[0]).to.be.deep.equals(layerList[1]);
        });

        it("should create new raw layer if datasets contains more than one entry (createLayerPerDataset)", () => {
            let result = null;

            layerList[1].datasets.push(
                {
                    md_id: "B6A59A2B-2D40-4676-9094-kjkjkjk",
                    md_name: "md_name_10220"
                }
            );
            result = getAllRawLayerSortedByMdId(layerContainer);

            expect(result).to.be.an("array");
            expect(result.length).to.be.equals(3);
            expect(result[0]).to.be.deep.equals(layerList[2]);
            expect(result[1].id).to.be.deep.equals("452_0");
            expect(result[1].name).to.be.deep.equals(layerList[1].name);
            expect(result[1].datasets[0].md_id).to.be.deep.equals("B6A59A2B-2D40-4676-9094-efg");
            expect(result[2].id).to.be.deep.equals("452_1");
            expect(result[2].name).to.be.deep.equals(layerList[1].name);
            expect(result[2].datasets[0].md_id).to.be.deep.equals("B6A59A2B-2D40-4676-9094-kjkjkjk");
        });
    });


});

