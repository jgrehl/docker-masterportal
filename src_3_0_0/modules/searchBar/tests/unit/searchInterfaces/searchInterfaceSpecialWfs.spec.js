import {expect} from "chai";
import SearchInterface from "../../../searchInterfaces/searchInterface.js";
import SearchInterfaceSpecialWfs from "../../../searchInterfaces/searchInterfaceSpecialWfs.js";

describe("src_3_0_0/modules/searchBar/searchInterfaces/searchInterfaceSpecialWfs.js", () => {
    let SearchInterface1 = null;

    before(() => {
        SearchInterface1 = new SearchInterfaceSpecialWfs();

        i18next.init({
            lng: "cimode",
            debug: false
        });
    });

    afterEach(() => {
        SearchInterface1.clearSearchResults();
    });

    describe("prototype", () => {
        it("SearchInterfaceSpecialWfs should has the prototype SearchInterface", () => {
            expect(SearchInterface1).to.be.an.instanceof(SearchInterface);
        });
    });

    describe("normalizeResults", () => {
        it("should normalize a search result", () => {
            const searchResults = [
                {
                    geometry: ["565931.982", "5935196.323", "565869.067", "5935016.323"],
                    geometryType: "MultiPolygon",
                    icon: "bi-house-fill",
                    identifier: "Rotherbaum37",
                    type: "common:modules.searchBar.specialWFS.ongoing"
                }];

            expect(SearchInterface1.normalizeResults(searchResults)).to.deep.equals([
                {
                    category: "modules.searchBar.specialWFS.ongoing",
                    events: {
                        onClick: {
                            highligtFeature: {
                                closeResults: false,
                                hit: {
                                    coordinate: ["565931.982", "5935196.323", "565869.067", "5935016.323"],
                                    geometryType: "MultiPolygon"
                                }
                            },
                            setMarker: {
                                closeResults: true,
                                coordinates: ["565931.982", "5935196.323", "565869.067", "5935016.323"]
                            },
                            zoomToFeature: {
                                coordinates: ["565931.982", "5935196.323", "565869.067", "5935016.323"],
                                closeResults: true
                            }
                        },
                        onHover: {
                            highligtFeature: {
                                hit: {
                                    coordinate: ["565931.982", "5935196.323", "565869.067", "5935016.323"],
                                    geometryType: "MultiPolygon"
                                },
                                closeResults: false
                            },
                            setMarker: {
                                coordinates: ["565931.982", "5935196.323", "565869.067", "5935016.323"],
                                closeResults: true
                            }
                        }
                    },
                    icon: "bi-house-fill",
                    id: "SpecialWFS1",
                    name: "Rotherbaum37",
                    toolTip: "Rotherbaum37"
                }
            ]);
        });
    });

    describe("WFSXML", () => {
        it("should build the correct request", () => {
            const definitions = [
                {
                    "url": "https://geodienste.hamburg.de/HH_WFS_Bebauungsplaene",
                    "typeName": "app:hh_hh_festgestellt",
                    "propertyNames": [
                        "app:geltendes_planrecht"
                    ],
                    "geometryName": "app:geom",
                    "name": "common:modules.searchBar.specialWFS.terminated",
                    "namespaces": "xmlns:app='http://www.deegree.org/app'"
                }
            ];

            expect(SearchInterface1.getWFS110Xml(definitions[0], "abc")).to.equals(
                "<wfs:GetFeature service='WFS' xmlns:wfs='http://www.opengis.net/wfs' xmlns:ogc='http://www.opengis.net/ogc' xmlns:gml='http://www.opengis.net/gml' xmlns:app='http://www.deegree.org/app' traverseXlinkDepth='*' version='1.1.0'>" +
                "<wfs:Query typeName='app:hh_hh_festgestellt'>" +
                "<wfs:PropertyName>app:geltendes_planrecht</wfs:PropertyName>" +
                "<wfs:PropertyName>app:geom</wfs:PropertyName>" +
                "<wfs:maxFeatures>20</wfs:maxFeatures>" +
                "<ogc:Filter>" +
                "<ogc:PropertyIsLike matchCase='false' wildCard='*' singleChar='#' escapeChar='!'><ogc:PropertyName>app:geltendes_planrecht</ogc:PropertyName><ogc:Literal>*abc*</ogc:Literal></ogc:PropertyIsLike>" +
                "</ogc:Filter></wfs:Query></wfs:GetFeature>"
            );
        });
    });
});
