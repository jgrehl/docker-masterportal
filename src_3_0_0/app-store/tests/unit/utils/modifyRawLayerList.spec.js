import {modifyRawLayerList} from "../../../utils/modifyRawLayerList.js";
import {expect} from "chai";
import sinon from "sinon";

describe("src_3_0_0/utils/modifyRawLayerList.js", () => {
    let treeConfig = {},
        layerList;

    beforeEach(() => {
        treeConfig = {};
        layerList = [
            {
                id: "453",
                name: "layer453",
                typ: "WMS",
                datasets: [{
                    md_id: "md_id_453",
                    md_name: "md_name_453"
                }]
            },
            {
                id: "452",
                name: "layer452",
                typ: "WMS",
                datasets: [{
                    md_id: "md_id_452",
                    md_name: "md_name_452"
                }]
            },
            {
                id: "1132",
                name: "layer1132",
                foo: "bar",
                typ: "WMS",
                gfiAttributes: "ignore",
                layers: "layer1",
                maxScale: "1000",
                minScale: "10",
                datasets: [{
                    md_id: "md_id_1132",
                    md_name: "md_name_1132"
                }]
            },
            {
                id: "10220",
                name: "layer10220",
                typ: "WMS",
                datasets: [{
                    md_id: "md_id_10220",
                    md_name: "md_name_10220"
                }]
            }
        ];
    });
    afterEach(() => {
        sinon.restore();
    });

    describe("modifyRawLayerList", () => {
        it("should return undefined if no layerlist is given", () => {
            treeConfig.layerIDsToIgnore = ["1", "2"];
            expect(modifyRawLayerList(undefined, treeConfig)).to.be.undefined;
        });
        it("should return undefined if no treeConfig is given", () => {
            expect(modifyRawLayerList([], undefined)).to.be.an("array");
        });
        it("should return undefined if no treeConfig  and no layerlist is given", () => {
            expect(modifyRawLayerList(undefined, undefined)).to.be.undefined;
        });
        it("layers contained in layerIDsToIgnore should be removed from layerlist", () => {
            let result = null;

            treeConfig.layerIDsToIgnore = ["453", "452"];
            result = modifyRawLayerList(layerList, treeConfig);
            expect(result.length).to.be.equals(2);
        });
        it("layers not contained in layerIDsToIgnore should not removed from layerlist", () => {
            let result = null;

            treeConfig.layerIDsToIgnore = ["45333", "45222"];
            result = modifyRawLayerList(layerList, treeConfig);
            expect(result.length).to.be.equals(4);
        });
        it("layers contained in metaIDsToIgnore should be removed from layerlist", () => {
            let result = null;

            treeConfig.metaIDsToIgnore = ["md_id_453", "md_id_452"];
            result = modifyRawLayerList(layerList, treeConfig);
            expect(result.length).to.be.equals(2);
        });
        it("layers not contained in metaIDsToIgnore should not removed from layerlist", () => {
            let result = null;

            treeConfig.metaIDsToIgnore = ["md_id_45333", "md_id_45222"];
            result = modifyRawLayerList(layerList, treeConfig);
            expect(result.length).to.be.equals(4);
        });
        it("WMS layers contained in metaIDsToMerge should be merged", () => {
            const layerConf = {
                id: "11322",
                name: "layer11322",
                typ: "WMS",
                gfiAttributes: {
                    "name": "Name"
                },
                layers: "layer2",
                maxScale: "5000",
                minScale: "50",
                datasets: [{
                    md_id: "md_id_1132",
                    md_name: "md_name_1132"
                }]
            };
            let result = null,
                filteredResult = null;

            layerList.push(layerConf);
            treeConfig.metaIDsToMerge = ["md_id_1132"];

            result = modifyRawLayerList(layerList, treeConfig);
            filteredResult = result.filter(layer => layer.name === "layer11322");
            expect(result.length).to.be.equals(4);
            expect(filteredResult.length).to.be.equals(0);
            expect(result[result.length - 1].id).to.be.equals("1132");
            expect(result[result.length - 1].foo).to.be.equals("bar");
            expect(result[result.length - 1].name).to.be.equals("md_name_1132");
            expect(result[result.length - 1].gfiAttributes).to.be.deep.equals({
                "name": "Name"
            });
            expect(result[result.length - 1].layers).to.be.equals("layer1,layer2");
            expect(result[result.length - 1].maxScale).to.be.equals(5000);
            expect(result[result.length - 1].minScale).to.be.equals(10);
        });

        it("WMS layers contained in metaIDsToMerge should be merged - merged layer should have gfiAttributes from first layer in list", () => {
            const layerConf = {
                id: "11322",
                name: "layer11322",
                typ: "WMS",
                gfiAttributes: {
                    "name": "Name"
                },
                datasets: [{
                    md_id: "md_id_1132",
                    md_name: "md_name_1132"
                }]
            };
            let result = null;

            layerList[2].gfiAttributes = {
                "foo": "bar"
            };
            layerList.push(layerConf);
            treeConfig.metaIDsToMerge = ["md_id_1132"];

            result = modifyRawLayerList(layerList, treeConfig);
            expect(result.length).to.be.equals(4);
            expect(result[result.length - 1].id).to.be.equals("1132");
            expect(result[result.length - 1].foo).to.be.equals("bar");
            expect(result[result.length - 1].name).to.be.equals("md_name_1132");
            expect(result[result.length - 1].gfiAttributes).to.be.deep.equals({
                "foo": "bar"
            });
        });
        it("WMS layers contained in layerIDsToStyle should be extended or splitted", () => {
            const legendUrls = ["https://geoportal.metropolregion.hamburg.de/legende_mrh/hvv-faehre.png", "https://geoportal.metropolregion.hamburg.de/legende_mrh/hvv-bahn.png", "https://geoportal.metropolregion.hamburg.de/legende_mrh/hvv-bus.png", "https://geoportal.metropolregion.hamburg.de/legende_mrh/hvv-bus.png"],
                names = ["Fährverbindungen", "Bahnlinien", "Buslinien", "Busliniennummern"],
                styles = ["geofox_Faehre", "geofox-bahn", "geofox-bus", "geofox_BusName"],
                layerIDsToStyle = [{
                    id: "10220",
                    styles: "geofox_stations",
                    name: "Haltestellen",
                    legendURL: "https://geoportal.metropolregion.hamburg.de/legende_mrh/hvv-bus.png"
                },
                {
                    id: "452",
                    styles: styles,
                    name: names,
                    legendURL: legendUrls
                }];
            let result = null,
                filteredResult = null;

            treeConfig.layerIDsToStyle = layerIDsToStyle;

            result = modifyRawLayerList(layerList, treeConfig);
            filteredResult = result.filter(layer => layer.name === "452");
            expect(result.length).to.be.equals(7);
            expect(filteredResult.length).to.be.equals(0);
            for (let index = 0; index < 4; index++) {
                expect(result[index + 1].id).to.be.equals("452" + styles[index]);
                expect(result[index + 1].style).to.be.equals(styles[index]);
                expect(result[index + 1].legendURL).to.be.equals(legendUrls[index]);
                expect(result[index + 1].name).to.be.equals(names[index]);
                expect(result[index + 1].styles).to.be.equals(styles[index]);
            }

            expect(result[result.length - 1].id).to.be.equals("10220");
            expect(result[result.length - 1].legendURL).to.be.equals("https://geoportal.metropolregion.hamburg.de/legende_mrh/hvv-bus.png");
            expect(result[result.length - 1].name).to.be.equals("Haltestellen");
            expect(result[result.length - 1].styles).to.be.equals("geofox_stations");
        });
    });
});

