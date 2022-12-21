import rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";
import {buildTreeStructure} from "../../../js/buildTreeStructure.js";
import {getAndMergeRawLayer, getAndMergeAllRawLayers} from "../../../js/getAndMergeRawLayer.js";
import getNestedValues from "../../../../shared/js/utils/getNestedValues";
import {expect} from "chai";
import sinon from "sinon";

describe("src_3_0_0/app-store/js/buildTreeStructure.js", () => {
    const categories = [
            {
                "key": "kategorie_opendata",
                "name": "Opendata",
                "active": true
            },
            {
                "key": "kategorie_inspire",
                "name": "Inspire"
            },
            {
                "key": "kategorie_organisation",
                "name": "Behörde"
            }
        ],
        layerConfig = {
            Hintergrundkarten: {
                elements: [
                    {
                        "id": "452",
                        "name": "Luftbilder DOP 20 (DOP 40 mit Umland)",
                        "visibility": true
                    },
                    {
                        "id": "453"
                    }
                ]
            },
            Fachdaten: {
                elements: [
                    {
                        id: "21999",
                        name: "Quartiere",
                        typ: "WMS",
                        visibility: false,
                        // type: "layer",
                        showInLayerTree: true
                    },
                    {
                        id: "22000",
                        name: "Stadtbereiche",
                        typ: "WMS",
                        visibility: true
                    }
                ]
            }
        };
    let layerList;

    before(() => {
        const fs = require("fs");

        layerList = fs.readFileSync("src_3_0_0/app-store/tests/unit/js/servicesMasterAuto.json", "utf8");
        layerList = JSON.parse(layerList);

    });
    afterEach(() => {
        sinon.restore();
    });

    describe("buildTreeStructure", () => {
        it("should return the unchanged layerlist if no param is given", () => {
            const shortList = [{
                "id": "452",
                "name": "Luftbilder DOP 20 (DOP 40 mit Umland)",
                "visibility": true
            },
            {
                "id": "453"
            }];

            sinon.stub(rawLayerList, "getLayerList").returns(shortList);
            expect(buildTreeStructure()).to.be.deep.equals(shortList);
        });


        it("should return tree structured for active category and respect subject data layer configuration", () => {
            let result = null,
                filteredResult = null,
                firstFolders = null,
                secondFolders = null,
                layersInFirstFolders = null,
                layersInSecondFolders = null;

            sinon.stub(rawLayerList, "getLayerList").returns(layerList);

            getAndMergeAllRawLayers();
            result = buildTreeStructure(layerConfig, categories[0], layerConfig.Fachdaten.elements);
            layerConfig.Fachdaten.elements.forEach(layerConf => {
                getAndMergeRawLayer(layerConf, true);
            });
            filteredResult = getNestedValues(result, "id").flat(Infinity);

            firstFolders = result.elements[0].elements.filter(el => el.type === "folder");
            secondFolders = result.elements[1].elements.filter(el => el.type === "folder");
            layersInFirstFolders = result.elements[0].elements.filter(el => el.type === "layer");
            layersInSecondFolders = result.elements[1].elements.filter(el => el.type === "layer");

            expect(result).to.be.an("object");
            expect(filteredResult.indexOf("452")).to.be.equals(-1);
            expect(filteredResult.indexOf("453")).to.be.equals(-1);

            expect(result.elements).to.be.an("array").to.have.lengthOf(2);
            expect(result.elements[0].name).to.be.equals(result.elements[0].elements[0].datasets[0].kategorie_opendata[0]);
            expect(result.elements[1].name).to.be.equals(result.elements[1].elements[0].datasets[0].kategorie_opendata[0]);

            expect(firstFolders).to.be.an("array").to.have.lengthOf(1);
            expect(firstFolders[0].elements).to.be.an("array").to.have.lengthOf(2);
            expect(firstFolders[0].elements[0].id).to.be.equals("21999");
            expect(firstFolders[0].elements[0].showInLayerTree).to.be.true;
            expect(firstFolders[0].elements[0].type).to.be.equals("layer");
            expect(firstFolders[0].elements[0].name).not.to.be.equals(firstFolders[0].elements[0].datasets[0].md_name);
            expect(firstFolders[0].elements[1].id).to.be.equals("22000");
            expect(firstFolders[0].elements[1].showInLayerTree).to.be.true;
            expect(firstFolders[0].elements[1].name).not.to.be.equals(firstFolders[0].elements[1].datasets[0].md_name);
            expect(firstFolders[0].name).to.be.equals(firstFolders[0].elements[1].datasets[0].md_name);
            expect(layersInFirstFolders).to.be.an("array").to.have.lengthOf(2);
            expect(layersInFirstFolders[0].id).to.be.equals("22799");
            expect(layersInFirstFolders[0].name).to.be.equals(layersInFirstFolders[0].datasets[0].md_name);
            expect(layersInFirstFolders[1].id).to.be.equals("7887");
            expect(layersInFirstFolders[1].name).to.be.equals(layersInFirstFolders[1].datasets[0].md_name);

            expect(secondFolders).to.be.an("array").to.have.lengthOf(2);
            expect(secondFolders[0].elements).to.be.an("array").to.have.lengthOf(2);
            expect(secondFolders[0].elements[0].id).to.be.equals("96");
            expect(secondFolders[0].elements[0].name).not.to.be.equals(secondFolders[0].elements[0].datasets[0].md_name);
            expect(secondFolders[0].elements[1].id).to.be.equals("95");
            expect(secondFolders[0].elements[1].name).not.to.be.equals(secondFolders[0].elements[1].datasets[0].md_name);
            expect(secondFolders[0].name).to.be.equals(secondFolders[0].elements[1].datasets[0].md_name);
            expect(secondFolders[1].elements[0].id).to.be.equals("1102");
            expect(secondFolders[1].elements[0].name).not.to.be.equals(secondFolders[1].elements[0].datasets[0].md_name);
            expect(secondFolders[1].elements[1].id).to.be.equals("1103");
            expect(secondFolders[1].elements[1].name).not.to.be.equals(secondFolders[1].elements[1].datasets[0].md_name);
            expect(secondFolders[1].name).to.be.equals(secondFolders[1].elements[1].datasets[0].md_name);
            expect(secondFolders[0].name).to.be.equals(secondFolders[0].elements[1].datasets[0].md_name);
            expect(layersInSecondFolders).to.be.an("array").to.have.lengthOf(2);
            expect(layersInSecondFolders[0].id).to.be.equals("685");
            expect(layersInSecondFolders[0].name).to.be.equals(layersInSecondFolders[0].datasets[0].md_name);
            expect(layersInSecondFolders[1].id).to.be.equals("182");
            expect(layersInSecondFolders[1].name).to.be.equals(layersInSecondFolders[1].datasets[0].md_name);
        });

        it("should return tree structured for active category containing a wms-time layer", () => {
            const wmsTimeLayer = {
                    "id": "23555",
                    "name": "Satellitenbilder Sentinel-2 CIR",
                    "typ": "WMS",
                    "datasets": [
                        {
                            "md_id": "98A63379-C7EC-4F78-919D-1DFD311C566F",
                            "md_name": "Satellitenbilder Sentinel-2 Hamburg",
                            "kategorie_opendata": [
                                "Umwelt"
                            ],
                            "kategorie_inspire": [
                                "Gebäude"
                            ],
                            "kategorie_organisation": "Landesbetrieb Geoinformation und Vermessung"
                        }
                    ],
                    "time": true
                },
                layerListWithMWSTime = layerList.concat([wmsTimeLayer]);
            let result = null,
                filteredResult = null;

            sinon.stub(rawLayerList, "getLayerList").returns(layerListWithMWSTime);

            getAndMergeAllRawLayers();
            result = buildTreeStructure(layerConfig, categories[0]);
            filteredResult = getNestedValues(result, "id").flat(Infinity);

            expect(result).to.be.an("object");
            expect(filteredResult.indexOf("452")).to.be.equals(-1);
            expect(filteredResult.indexOf("453")).to.be.equals(-1);
            expect(filteredResult.indexOf("23555")).not.to.be.equals(-1);
            expect(result.elements[1].elements).to.be.an("array").to.have.lengthOf(1);
            expect(result.elements[1].elements[0].id).to.be.equals("23555");
            expect(result.elements[1].elements[0].time).to.be.true;
            expect(result.elements[1].elements[0].name).to.be.equals(result.elements[1].elements[0].datasets[0].md_name);
        });

        it("should return tree structured for second category", () => {
            let result = null,
                filteredResult = null,
                folders = null,
                firstFolders = null,
                thirdFolders = null,
                secondFolders = null,
                layersInFirstFolders = null,
                layersInSecondFolders = null,
                layersInThirdFolders = null;

            sinon.stub(rawLayerList, "getLayerList").returns(layerList);

            getAndMergeAllRawLayers();
            result = buildTreeStructure(layerConfig, categories[1]);
            filteredResult = getNestedValues(result, "id").flat(Infinity);
            folders = result.elements.filter(el => el.type === "folder");
            firstFolders = result.elements[0].elements.filter(el => el.type === "folder");
            secondFolders = result.elements[1].elements.filter(el => el.type === "folder");
            thirdFolders = result.elements[2].elements.filter(el => el.type === "folder");
            layersInFirstFolders = result.elements[0].elements.filter(el => el.type === "layer");
            layersInSecondFolders = result.elements[1].elements.filter(el => el.type === "layer");
            layersInThirdFolders = result.elements[2].elements.filter(el => el.type === "layer");

            expect(result).to.be.an("object");
            expect(filteredResult.indexOf("452")).to.be.equals(-1);
            expect(filteredResult.indexOf("453")).to.be.equals(-1);
            expect(result.elements).to.be.an("array").to.have.lengthOf(3);

            expect(folders[0].name).to.be.equals(firstFolders[0].elements[0].datasets[0].kategorie_inspire[0]);
            expect(folders[1].name).to.be.equals(secondFolders[0].elements[0].datasets[0].kategorie_inspire[0]);
            expect(folders[2].name).to.be.equals(thirdFolders[0].elements[0].datasets[0].kategorie_inspire[0]);

            expect(firstFolders).to.be.an("array").to.have.lengthOf(1);
            expect(layersInFirstFolders).to.be.an("array").to.have.lengthOf(0);
            expect(firstFolders[0].elements).to.be.an("array").to.have.lengthOf(2);
            expect(firstFolders[0].elements[0].id).to.be.equals("1102");
            expect(firstFolders[0].elements[0].name).not.to.be.equals(firstFolders[0].elements[0].datasets[0].md_name);
            expect(firstFolders[0].elements[1].id).to.be.equals("1103");
            expect(firstFolders[0].elements[1].name).not.to.be.equals(firstFolders[0].elements[1].datasets[0].md_name);
            expect(firstFolders[0].name).to.be.equals(firstFolders[0].elements[1].datasets[0].md_name);

            expect(secondFolders).to.be.an("array").to.have.lengthOf(1);
            expect(layersInSecondFolders).to.be.an("array").to.have.lengthOf(0);
            expect(secondFolders[0].elements).to.be.an("array").to.have.lengthOf(2);
            expect(secondFolders[0].elements[0].id).to.be.equals("96");
            expect(secondFolders[0].elements[0].name).not.to.be.equals(secondFolders[0].elements[0].datasets[0].md_name);
            expect(secondFolders[0].elements[1].id).to.be.equals("95");
            expect(secondFolders[0].elements[1].name).not.to.be.equals(secondFolders[0].elements[1].datasets[0].md_name);
            expect(secondFolders[0].name).to.be.equals(secondFolders[0].elements[1].datasets[0].md_name);

            expect(thirdFolders).to.be.an("array").to.have.lengthOf(1);
            expect(layersInThirdFolders).to.be.an("array").to.have.lengthOf(4);
            expect(thirdFolders[0].elements).to.be.an("array").to.have.lengthOf(2);
            expect(thirdFolders[0].elements[0].id).to.be.equals("21999");
            expect(thirdFolders[0].elements[0].name).not.to.be.equals(thirdFolders[0].elements[0].datasets[0].md_name);
            expect(thirdFolders[0].elements[1].id).to.be.equals("22000");
            expect(thirdFolders[0].elements[1].name).not.to.be.equals(thirdFolders[0].elements[1].datasets[0].md_name);
            expect(thirdFolders[0].name).to.be.equals(thirdFolders[0].elements[0].datasets[0].md_name);
            expect(layersInThirdFolders[0].id).to.be.equals("22799");
            expect(layersInThirdFolders[0].name).to.be.equals(layersInThirdFolders[0].datasets[0].md_name);
            expect(layersInThirdFolders[1].id).to.be.equals("685");
            expect(layersInThirdFolders[1].name).to.be.equals(layersInThirdFolders[1].datasets[0].md_name);
            expect(layersInThirdFolders[2].id).to.be.equals("7887");
            expect(layersInThirdFolders[2].name).to.be.equals(layersInThirdFolders[2].datasets[0].md_name);
            expect(layersInThirdFolders[3].id).to.be.equals("182");
            expect(layersInThirdFolders[3].name).to.be.equals(layersInThirdFolders[3].datasets[0].md_name);
        });

        it("should return tree structured for third category", () => {
            let result = null,
                filteredResult = null,
                folders = null,
                firstFolders = null,
                secondFolders = null,
                thirdFolders = null,
                fourthFolders = null,
                layersInFirstFolders = null,
                layersInSecondFolders = null,
                layersInThirdFolders = null,
                layersInFourthFolders = null;

            sinon.stub(rawLayerList, "getLayerList").returns(layerList);

            getAndMergeAllRawLayers();
            result = buildTreeStructure(layerConfig, categories[2]);
            filteredResult = getNestedValues(result, "id").flat(Infinity);
            folders = result.elements.filter(el => el.type === "folder");
            firstFolders = result.elements[0].elements.filter(el => el.type === "folder");
            secondFolders = result.elements[1].elements.filter(el => el.type === "folder");
            thirdFolders = result.elements[2].elements.filter(el => el.type === "folder");
            fourthFolders = result.elements[3].elements.filter(el => el.type === "folder");
            layersInFirstFolders = result.elements[0].elements.filter(el => el.type === "layer");
            layersInSecondFolders = result.elements[1].elements.filter(el => el.type === "layer");
            layersInThirdFolders = result.elements[2].elements.filter(el => el.type === "layer");
            layersInFourthFolders = result.elements[3].elements[0].elements.filter(el => el.type === "layer");

            expect(result).to.be.an("object");
            expect(filteredResult.indexOf("452")).to.be.equals(-1);
            expect(filteredResult.indexOf("453")).to.be.equals(-1);
            expect(folders).to.be.an("array").to.have.lengthOf(4);

            expect(folders[0].name).to.be.equals(layersInFirstFolders[0].datasets[0].kategorie_organisation);
            expect(folders[1].name).to.be.equals(layersInSecondFolders[0].datasets[0].kategorie_organisation);
            expect(folders[2].name).to.be.equals(layersInThirdFolders[0].datasets[0].kategorie_organisation);
            expect(folders[3].name).to.be.equals(layersInFourthFolders[0].datasets[0].kategorie_organisation);

            expect(firstFolders).to.be.an("array").to.have.lengthOf(2);
            expect(layersInFirstFolders).to.be.an("array").to.have.lengthOf(2);
            expect(firstFolders[0].elements).to.be.an("array").to.have.lengthOf(2);
            expect(firstFolders[0].elements[0].id).to.be.equals("96");
            expect(firstFolders[0].elements[0].name).not.to.be.equals(firstFolders[0].elements[0].datasets[0].md_name);
            expect(firstFolders[0].elements[1].id).to.be.equals("95");
            expect(firstFolders[0].elements[1].name).not.to.be.equals(firstFolders[0].elements[1].datasets[0].md_name);
            expect(firstFolders[0].name).to.be.equals(firstFolders[0].elements[0].datasets[0].md_name);
            expect(layersInFirstFolders[0].id).to.be.equals("685");
            expect(layersInFirstFolders[0].name).to.be.equals(layersInFirstFolders[0].datasets[0].md_name);
            expect(layersInFirstFolders[1].id).to.be.equals("182");
            expect(layersInFirstFolders[1].name).to.be.equals(layersInFirstFolders[1].datasets[0].md_name);

            expect(firstFolders[1].elements).to.be.an("array").to.have.lengthOf(2);
            expect(firstFolders[1].elements[0].id).to.be.equals("1102");
            expect(firstFolders[1].elements[0].name).not.to.be.equals(firstFolders[1].elements[0].datasets[0].md_name);
            expect(firstFolders[1].elements[1].id).to.be.equals("1103");
            expect(firstFolders[1].elements[1].name).not.to.be.equals(firstFolders[1].elements[1].datasets[0].md_name);

            expect(secondFolders).to.be.an("array").to.have.lengthOf(0);
            expect(layersInSecondFolders).to.be.an("array").to.have.lengthOf(1);
            expect(layersInSecondFolders[0].id).to.be.equals("22799");
            expect(layersInSecondFolders[0].name).to.be.equals(layersInSecondFolders[0].datasets[0].md_name);

            expect(thirdFolders).to.be.an("array").to.have.lengthOf(0);
            expect(layersInThirdFolders).to.be.an("array").to.have.lengthOf(1);
            expect(layersInThirdFolders[0].id).to.be.equals("7887");
            expect(layersInThirdFolders[0].name).to.be.equals(layersInThirdFolders[0].datasets[0].md_name);

            expect(fourthFolders).to.be.an("array").to.have.lengthOf(1);
            expect(result.elements[3].elements.filter(el => el.type === "layer")).to.be.an("array").to.have.lengthOf(0);
            expect(layersInFourthFolders).to.be.an("array").to.have.lengthOf(2);
            expect(layersInFourthFolders[0].id).to.be.equals("21999");
            expect(layersInFourthFolders[0].name).not.to.be.equals(layersInFourthFolders[0].datasets[0].md_name);
            expect(layersInFourthFolders[1].id).to.be.equals("22000");
            expect(layersInFourthFolders[1].name).not.to.be.equals(layersInFourthFolders[1].datasets[0].md_name);
            expect(fourthFolders[0].name).to.be.equals(layersInFourthFolders[0].datasets[0].md_name);
        });
    });
});

