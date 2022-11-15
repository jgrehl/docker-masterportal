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
                Layer: [
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
                Layer: [
                  {
                    id: "21999",
                    name: "Quartiere",
                    typ: "WMS",
                    visibility: false,
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
                filteredResult = null;

            sinon.stub(rawLayerList, "getLayerList").returns(layerList);

            getAndMergeAllRawLayers();
            result = buildTreeStructure(layerConfig, categories[0], layerConfig.Fachdaten.Layer);
            layerConfig.Fachdaten.Layer.forEach(layerConf => {
                getAndMergeRawLayer(layerConf, "auto");
            });
            filteredResult = getNestedValues(result, "id").flat(Infinity);            

            expect(result).to.be.an("object");
            expect(filteredResult.indexOf("452")).to.be.equals(-1);
            expect(filteredResult.indexOf("453")).to.be.equals(-1);
            expect(result.Ordner).to.be.an("array").to.have.lengthOf(2);

            expect(result.Ordner[0].Titel).to.be.equals(result.Ordner[0].Ordner[0].Layer[1].datasets[0].kategorie_opendata[0]);
            expect(result.Ordner[1].Titel).to.be.equals(result.Ordner[1].Ordner[0].Layer[1].datasets[0].kategorie_opendata[0]);

            expect(result.Ordner[0].Ordner).to.be.an("array").to.have.lengthOf(1);
            expect(result.Ordner[0].Ordner[0].Layer).to.be.an("array").to.have.lengthOf(2);
            expect(result.Ordner[0].Ordner[0].Layer[0].id).to.be.equals("21999");
            expect(result.Ordner[0].Ordner[0].Layer[0].showInLayerTree).to.be.true;
            expect(result.Ordner[0].Ordner[0].Layer[0].name).not.to.be.equals(result.Ordner[0].Ordner[0].Layer[0].datasets[0].md_name);
            expect(result.Ordner[0].Ordner[0].Layer[1].id).to.be.equals("22000");
            expect(result.Ordner[0].Ordner[0].Layer[1].showInLayerTree).to.be.true;
            expect(result.Ordner[0].Ordner[0].Layer[1].name).not.to.be.equals(result.Ordner[0].Ordner[0].Layer[1].datasets[0].md_name);
            expect(result.Ordner[0].Ordner[0].Titel).to.be.equals(result.Ordner[0].Ordner[0].Layer[1].datasets[0].md_name);
            expect(result.Ordner[0].Layer).to.be.an("array").to.have.lengthOf(2);
            expect(result.Ordner[0].Layer[0].id).to.be.equals("22799");
            expect(result.Ordner[0].Layer[0].name).to.be.equals(result.Ordner[0].Layer[0].datasets[0].md_name);
            expect(result.Ordner[0].Layer[1].id).to.be.equals("7887");
            expect(result.Ordner[0].Layer[1].name).to.be.equals(result.Ordner[0].Layer[1].datasets[0].md_name);


            expect(result.Ordner[1].Ordner).to.be.an("array").to.have.lengthOf(2);
            expect(result.Ordner[1].Layer).to.be.an("array").to.have.lengthOf(2);
            expect(result.Ordner[1].Ordner[0].Layer[0].id).to.be.equals("96");
            expect(result.Ordner[1].Ordner[0].Layer[0].name).not.to.be.equals(result.Ordner[1].Ordner[0].Layer[0].datasets[0].md_name);
            expect(result.Ordner[1].Ordner[0].Layer[1].id).to.be.equals("95");
            expect(result.Ordner[1].Ordner[0].Layer[1].name).not.to.be.equals(result.Ordner[1].Ordner[0].Layer[1].datasets[0].md_name);
            expect(result.Ordner[1].Ordner[0].Titel).to.be.equals(result.Ordner[1].Ordner[0].Layer[1].datasets[0].md_name);
            expect(result.Ordner[1].Ordner[1].Layer[0].id).to.be.equals("1102");
            expect(result.Ordner[1].Ordner[1].Layer[0].name).not.to.be.equals(result.Ordner[1].Ordner[1].Layer[0].datasets[0].md_name);
            expect(result.Ordner[1].Ordner[1].Layer[1].id).to.be.equals("1103");
            expect(result.Ordner[1].Ordner[1].Layer[1].name).not.to.be.equals(result.Ordner[1].Ordner[1].Layer[1].datasets[0].md_name);
            expect(result.Ordner[1].Ordner[1].Titel).to.be.equals(result.Ordner[1].Ordner[1].Layer[1].datasets[0].md_name);
            expect(result.Ordner[1].Ordner[0].Titel).to.be.equals(result.Ordner[1].Ordner[0].Layer[1].datasets[0].md_name);
            expect(result.Ordner[1].Layer).to.be.an("array").to.have.lengthOf(2);
            expect(result.Ordner[1].Layer[0].id).to.be.equals("685");
            expect(result.Ordner[1].Layer[0].name).to.be.equals(result.Ordner[1].Layer[0].datasets[0].md_name);
            expect(result.Ordner[1].Layer[1].id).to.be.equals("182");
            expect(result.Ordner[1].Layer[1].name).to.be.equals(result.Ordner[1].Layer[1].datasets[0].md_name);
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
            expect(result.Ordner[1].Layer).to.be.an("array").to.have.lengthOf(1);
            expect(result.Ordner[1].Layer[0].id).to.be.equals("23555");
            expect(result.Ordner[1].Layer[0].time).to.be.true;
            expect(result.Ordner[1].Layer[0].name).to.be.equals(result.Ordner[1].Layer[0].datasets[0].md_name);
        });

        it("should return tree structured for second category", () => {
            let result = null,
                filteredResult = null;

            sinon.stub(rawLayerList, "getLayerList").returns(layerList);

            getAndMergeAllRawLayers();
            result = buildTreeStructure(layerConfig, categories[1]);
            filteredResult = getNestedValues(result, "id").flat(Infinity);

            expect(result).to.be.an("object");
            expect(filteredResult.indexOf("452")).to.be.equals(-1);
            expect(filteredResult.indexOf("453")).to.be.equals(-1);
            expect(result.Ordner).to.be.an("array").to.have.lengthOf(3);

            expect(result.Ordner[0].Titel).to.be.equals(result.Ordner[0].Ordner[0].Layer[0].datasets[0].kategorie_inspire[0]);
            expect(result.Ordner[1].Titel).to.be.equals(result.Ordner[1].Ordner[0].Layer[0].datasets[0].kategorie_inspire[0]);
            expect(result.Ordner[2].Titel).to.be.equals(result.Ordner[2].Ordner[0].Layer[0].datasets[0].kategorie_inspire[0]);

            expect(result.Ordner[0].Ordner).to.be.an("array").to.have.lengthOf(1);
            expect(result.Ordner[0].Layer).to.be.an("array").to.have.lengthOf(0);
            expect(result.Ordner[0].Ordner[0].Layer).to.be.an("array").to.have.lengthOf(2);
            expect(result.Ordner[0].Ordner[0].Layer[0].id).to.be.equals("1102");
            expect(result.Ordner[0].Ordner[0].Layer[0].name).not.to.be.equals(result.Ordner[0].Ordner[0].Layer[0].datasets[0].md_name);
            expect(result.Ordner[0].Ordner[0].Layer[1].id).to.be.equals("1103");
            expect(result.Ordner[0].Ordner[0].Layer[1].name).not.to.be.equals(result.Ordner[0].Ordner[0].Layer[1].datasets[0].md_name);
            expect(result.Ordner[0].Ordner[0].Titel).to.be.equals(result.Ordner[0].Ordner[0].Layer[1].datasets[0].md_name);

            expect(result.Ordner[1].Ordner).to.be.an("array").to.have.lengthOf(1);
            expect(result.Ordner[1].Layer).to.be.an("array").to.have.lengthOf(0);
            expect(result.Ordner[1].Ordner[0].Layer).to.be.an("array").to.have.lengthOf(2);
            expect(result.Ordner[1].Ordner[0].Layer[0].id).to.be.equals("96");
            expect(result.Ordner[1].Ordner[0].Layer[0].name).not.to.be.equals(result.Ordner[1].Ordner[0].Layer[0].datasets[0].md_name);
            expect(result.Ordner[1].Ordner[0].Layer[1].id).to.be.equals("95");
            expect(result.Ordner[1].Ordner[0].Layer[1].name).not.to.be.equals(result.Ordner[1].Ordner[0].Layer[1].datasets[0].md_name);
            expect(result.Ordner[1].Ordner[0].Titel).to.be.equals(result.Ordner[1].Ordner[0].Layer[1].datasets[0].md_name);

            expect(result.Ordner[2].Ordner).to.be.an("array").to.have.lengthOf(1);
            expect(result.Ordner[2].Layer).to.be.an("array").to.have.lengthOf(4);
            expect(result.Ordner[2].Ordner[0].Layer).to.be.an("array").to.have.lengthOf(2);
            expect(result.Ordner[2].Ordner[0].Layer[0].id).to.be.equals("21999");
            expect(result.Ordner[2].Ordner[0].Layer[0].name).not.to.be.equals(result.Ordner[2].Ordner[0].Layer[0].datasets[0].md_name);
            expect(result.Ordner[2].Ordner[0].Layer[1].id).to.be.equals("22000");
            expect(result.Ordner[2].Ordner[0].Layer[1].name).not.to.be.equals(result.Ordner[1].Ordner[0].Layer[1].datasets[0].md_name);
            expect(result.Ordner[2].Ordner[0].Titel).to.be.equals(result.Ordner[2].Ordner[0].Layer[1].datasets[0].md_name);
            expect(result.Ordner[2].Layer[0].id).to.be.equals("22799");
            expect(result.Ordner[2].Layer[0].name).to.be.equals(result.Ordner[2].Layer[0].datasets[0].md_name);
            expect(result.Ordner[2].Layer[1].id).to.be.equals("685");
            expect(result.Ordner[2].Layer[1].name).to.be.equals(result.Ordner[2].Layer[1].datasets[0].md_name);
            expect(result.Ordner[2].Layer[2].id).to.be.equals("7887");
            expect(result.Ordner[2].Layer[2].name).to.be.equals(result.Ordner[2].Layer[2].datasets[0].md_name);
            expect(result.Ordner[2].Layer[3].id).to.be.equals("182");
            expect(result.Ordner[2].Layer[3].name).to.be.equals(result.Ordner[2].Layer[3].datasets[0].md_name);
        });

        it("should return tree structured for third category", () => {
            let result = null,
                filteredResult = null;

            sinon.stub(rawLayerList, "getLayerList").returns(layerList);

            getAndMergeAllRawLayers();
            result = buildTreeStructure(layerConfig, categories[2]);
            filteredResult = getNestedValues(result, "id").flat(Infinity);

            expect(result).to.be.an("object");
            expect(filteredResult.indexOf("452")).to.be.equals(-1);
            expect(filteredResult.indexOf("453")).to.be.equals(-1);
            expect(result.Ordner).to.be.an("array").to.have.lengthOf(4);

            expect(result.Ordner[0].Titel).to.be.equals(result.Ordner[0].Ordner[0].Layer[0].datasets[0].kategorie_organisation);
            expect(result.Ordner[1].Titel).to.be.equals(result.Ordner[1].Layer[0].datasets[0].kategorie_organisation);
            expect(result.Ordner[2].Titel).to.be.equals(result.Ordner[2].Layer[0].datasets[0].kategorie_organisation);
            expect(result.Ordner[3].Titel).to.be.equals(result.Ordner[3].Ordner[0].Layer[0].datasets[0].kategorie_organisation);

            expect(result.Ordner[0].Ordner).to.be.an("array").to.have.lengthOf(2);
            expect(result.Ordner[0].Layer).to.be.an("array").to.have.lengthOf(2);
            expect(result.Ordner[0].Ordner[0].Layer).to.be.an("array").to.have.lengthOf(2);
            expect(result.Ordner[0].Ordner[0].Layer[0].id).to.be.equals("96");
            expect(result.Ordner[0].Ordner[0].Layer[0].name).not.to.be.equals(result.Ordner[0].Ordner[0].Layer[0].datasets[0].md_name);
            expect(result.Ordner[0].Ordner[0].Layer[1].id).to.be.equals("95");
            expect(result.Ordner[0].Ordner[0].Layer[1].name).not.to.be.equals(result.Ordner[0].Ordner[0].Layer[1].datasets[0].md_name);
            expect(result.Ordner[0].Ordner[0].Titel).to.be.equals(result.Ordner[0].Ordner[0].Layer[0].datasets[0].md_name);
            expect(result.Ordner[0].Layer[0].id).to.be.equals("685");
            expect(result.Ordner[0].Layer[0].name).to.be.equals(result.Ordner[0].Layer[0].datasets[0].md_name);
            expect(result.Ordner[0].Layer[1].id).to.be.equals("182");
            expect(result.Ordner[0].Layer[1].name).to.be.equals(result.Ordner[0].Layer[1].datasets[0].md_name);

            expect(result.Ordner[0].Ordner[1].Layer).to.be.an("array").to.have.lengthOf(2);
            expect(result.Ordner[0].Ordner[1].Layer).to.be.an("array").to.have.lengthOf(2);
            expect(result.Ordner[0].Ordner[1].Layer[0].id).to.be.equals("1102");
            expect(result.Ordner[0].Ordner[1].Layer[0].name).not.to.be.equals(result.Ordner[0].Ordner[1].Layer[0].datasets[0].md_name);
            expect(result.Ordner[0].Ordner[1].Layer[1].id).to.be.equals("1103");
            expect(result.Ordner[0].Ordner[1].Layer[1].name).not.to.be.equals(result.Ordner[0].Ordner[1].Layer[1].datasets[0].md_name);
            expect(result.Ordner[0].Ordner[1].Titel).to.be.equals(result.Ordner[0].Ordner[1].Layer[0].datasets[0].md_name);

            expect(result.Ordner[1].Ordner).to.be.an("array").to.have.lengthOf(0);
            expect(result.Ordner[1].Layer).to.be.an("array").to.have.lengthOf(1);
            expect(result.Ordner[1].Layer[0].id).to.be.equals("22799");
            expect(result.Ordner[1].Layer[0].name).to.be.equals(result.Ordner[1].Layer[0].datasets[0].md_name);

            expect(result.Ordner[2].Ordner).to.be.an("array").to.have.lengthOf(0);
            expect(result.Ordner[2].Layer).to.be.an("array").to.have.lengthOf(1);
            expect(result.Ordner[2].Layer[0].id).to.be.equals("7887");
            expect(result.Ordner[2].Layer[0].name).to.be.equals(result.Ordner[2].Layer[0].datasets[0].md_name);

            expect(result.Ordner[3].Ordner).to.be.an("array").to.have.lengthOf(1);
            expect(result.Ordner[3].Layer).to.be.an("array").to.have.lengthOf(0);
            expect(result.Ordner[3].Ordner[0].Layer).to.be.an("array").to.have.lengthOf(2);
            expect(result.Ordner[3].Ordner[0].Layer[0].id).to.be.equals("21999");
            expect(result.Ordner[3].Ordner[0].Layer[0].name).not.to.be.equals(result.Ordner[3].Ordner[0].Layer[0].datasets[0].md_name);
            expect(result.Ordner[3].Ordner[0].Layer[1].id).to.be.equals("22000");
            expect(result.Ordner[3].Ordner[0].Layer[1].name).not.to.be.equals(result.Ordner[3].Ordner[0].Layer[1].datasets[0].md_name);
            expect(result.Ordner[3].Ordner[0].Titel).to.be.equals(result.Ordner[3].Ordner[0].Layer[0].datasets[0].md_name);
        });
    });
});

