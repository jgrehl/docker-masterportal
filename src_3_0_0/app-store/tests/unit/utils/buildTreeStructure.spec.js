import * as rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";
import {buildTreeStructure} from "../../../utils/buildTreeStructure.js";
import {getAndMergeAllRawLayers} from "../../../utils/getAndMergeRawLayer.js";
import getNestedValues from "../../../../utils/getNestedValues";
import {expect} from "chai";
import sinon from "sinon";

describe("src_3_0_0/utils/buildTreeStructure.js", () => {
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
    ];
    let layerList;

    before(() => {
        const fs = require("fs");

        layerList = fs.readFileSync("src_3_0_0/app-store/tests/unit/utils/servicesMasterDefault.json", "utf8");
        layerList = JSON.parse(layerList);

    });
    afterEach(() => {
        sinon.restore();
    });

    describe("buildTreeStructure", () => {
        it("should return the unchanged layerlist if no param is given", () => {
            layerList = [{id: "id"}];
            sinon.stub(rawLayerList, "getLayerList").returns(layerList);

            expect(buildTreeStructure()).to.be.deep.equals(layerList);
        });


        it.only("should return tree structured for active category", () => {
            const layerConfig = {
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
                }
            };

            let result = null,
                filteredResult = null;

            sinon.stub(rawLayerList, "getLayerList").returns(layerList);

            getAndMergeAllRawLayers();
            result = buildTreeStructure(layerConfig, categories[0]);
            filteredResult = getNestedValues(result, "id").flat(Infinity);

            expect(result).to.be.an("object");
            expect(filteredResult.indexOf("452")).to.be.equals(-1);
            expect(filteredResult.indexOf("453")).to.be.equals(-1);
            expect(result.Ordner).to.be.an("array").to.have.lengthOf(2);

            expect(result.Ordner[0].Ordner).to.be.an("array").to.have.lengthOf(1);
            expect(result.Ordner[0].Ordner[0].Layer).to.be.an("array").to.have.lengthOf(2);
            expect(result.Ordner[0].Ordner[0].Layer[0].id).to.be.equals("21999");
            expect(result.Ordner[0].Ordner[0].Layer[0].name).not.to.be.equals(result.Ordner[0].Ordner[0].Layer[0].datasets[0].md_name);
            expect(result.Ordner[0].Ordner[0].Layer[1].id).to.be.equals("22000");
            expect(result.Ordner[0].Ordner[0].Layer[1].name).not.to.be.equals(result.Ordner[0].Ordner[0].Layer[1].datasets[0].md_name);
            expect(result.Ordner[0].Titel).to.be.equals(result.Ordner[0].Ordner[0].Layer[1].datasets[0].kategorie_opendata[0]);
            expect(result.Ordner[0].Ordner[0].Titel).to.be.equals(result.Ordner[0].Ordner[0].Layer[1].datasets[0].md_name);
            expect(result.Ordner[0].Layer).to.be.an("array").to.have.lengthOf(2);
            expect(result.Ordner[0].Layer[0].id).to.be.equals("22799");
            expect(result.Ordner[0].Layer[0].name).to.be.equals(result.Ordner[0].Layer[0].datasets[0].md_name);
            expect(result.Ordner[0].Layer[1].id).to.be.equals("7887");
            expect(result.Ordner[0].Layer[1].name).to.be.equals(result.Ordner[0].Layer[1].datasets[0].md_name);

            expect(result.Ordner[1].Titel).to.be.equals("Umwelt und Klima");
            expect(result.Ordner[1].Ordner).to.be.an("array").to.have.lengthOf(2);
            expect(result.Ordner[1].Layer).to.be.an("array").to.have.lengthOf(2);
        });
    });
});

