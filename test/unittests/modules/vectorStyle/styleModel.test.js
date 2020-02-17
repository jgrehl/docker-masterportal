import {expect} from "chai";
import Model from "@modules/vectorStyle/styleModel";
import {GeoJSON} from "ol/format.js";
import {Text, Style, Stroke, Fill} from "ol/style.js";

describe("vectorStyleModel", function () {
    const geojsonReader = new GeoJSON(),
        jsonFeatures = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [10.082125662581083, 53.518872973925404]
                    },
                    "properties": {
                        "id": "test1",
                        "name": "myName",
                        "value": 50,
                        "min": 10,
                        "max": 100,
                        "myObj": {
                            "myCascade": 10,
                            "myArray": [
                                {
                                    "myValue": 20
                                }
                            ]
                        }
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [[10.082125662581083, 53.518872973925404], [11.01, 53.6]]
                    },
                    "properties": {
                        "id": "test2",
                        "value": 50,
                        "min": 10,
                        "max": 100
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [[10.082125662581083, 53.518872973925404], [11.01, 53.6], [11.5, 54.0]]
                    },
                    "properties": {
                        "id": "test1",
                        "value": 50,
                        "min": 10,
                        "max": 100
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "MultiPoint",
                        "coordinates": [[11.01, 53.6], [11.5, 54.0]]
                    },
                    "properties": {
                        "id": "test1",
                        "value": 50,
                        "min": 10,
                        "max": 100
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "MultiLineString",
                        "coordinates": [
                            [[10, 10], [20, 20], [10, 40]],
                            [[40, 40], [30, 30], [40, 20], [30, 10]]
                        ]
                    },
                    "properties": {
                        "id": "test1",
                        "value": 50,
                        "min": 10,
                        "max": 100
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "MultiPolygon",
                        "coordinates": [
                            [
                                [[30, 20], [45, 40], [10, 40], [30, 20]]
                            ],
                            [
                                [[15, 5], [40, 10], [10, 20], [5, 10], [15, 5]]
                            ]
                        ]
                    },
                    "properties": {
                        "id": "test1",
                        "value": 50,
                        "min": 10,
                        "max": 100
                    }
                },
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "GeometryCollection",
                        "geometries": [
                            {
                                "type": "Point",
                                "coordinates": [100.0, 0.0]
                            },
                            {
                                "type": "LineString",
                                "coordinates": [
                                    [101.0, 0.0], [102.0, 1.0]
                                ]
                            }
                        ]
                    },
                    "properties": {
                        "@test": "test",
                        "id": "test1",
                        "value": 50,
                        "min": 10,
                        "max": 100
                    }
                }
            ]
        },
        rules = [
            {
                "conditions": {
                    "properties": {
                        "id": "test1"
                    }
                },
                "style": {
                    "circleStrokeColor": [255, 0, 0, 1],
                    "type": "circle",
                    "lineStrokeColor": [100, 0, 0, 1],
                    "polygonStrokeColor": [100, 100, 0, 1]
                }
            },
            {
                "conditions": {
                    "properties": {
                        "value": [0, 100]
                    }
                },
                "style": {
                    "circleStrokeColor": [255, 0, 0, 1]
                }
            },
            {
                "conditions": {
                    "properties": {
                        "value": [0, 50, "@min", "@max"]
                    }
                },
                "style": {
                    "circleStrokeColor": [255, 0, 0, 1]
                }
            },
            {
                "style": {
                    "circleStrokeColor": [255, 255, 255, 1]
                }
            }
        ],
        rules2 = [
            {
                "conditions": {
                    "properties": {
                        "id": "test1"
                    },
                    "sequence": [1, 1]
                },
                "style": {
                    "polygonStrokeColor": [100, 0, 0, 1],
                    "labelField": "name"
                }
            },
            {
                "conditions": {
                    "properties": {
                        "id": "test1"
                    }
                },
                "style": {
                    "polygonStrokeColor": [100, 100, 0, 1]
                }
            },
            {
                "style": {
                    "polygonStrokeColor": [100, 100, 100, 1]
                }
            }
        ];

    let styleModel,
        jsonObjects;

    before(function () {
        styleModel = new Model();
        jsonObjects = geojsonReader.readFeatures(jsonFeatures);
    });

    describe("createLegendId", function () {
        it("returns correct id for Point and null", function () {
            expect(styleModel.createLegendId("Point", {})).to.equal("UG9pbnRudWxs");
        });
        it("returns correct id for Linestring with some conditions", function () {
            expect(styleModel.createLegendId("Point", {conditions: {properties: {name: "name"}}})).to.equal("UG9pbnR7InByb3BlcnRpZXMiOnsibmFtZSI6Im5hbWUifX0=");
        });
        it("returns correct id for Linestring with other conditions", function () {
            expect(styleModel.createLegendId("Point", {conditions: {properties: {name: "name2"}}})).to.equal("UG9pbnR7InByb3BlcnRpZXMiOnsibmFtZSI6Im5hbWUyIn19");
        });
    });

    describe("addLegendInfo", function () {
        it("legendInfos should be empty", function () {
            expect(styleModel.get("legendInfos")).to.be.an("array").to.have.lengthOf(0);
        });
        it("addLegendInfo should insert one item", function () {
            styleModel.addLegendInfo("myId", "Point", "test");
            expect(styleModel.get("legendInfos")).to.be.an("array").to.have.lengthOf(1);
            expect(styleModel.get("legendInfos")[0]).to.deep.include({geometryType: "Point", id: "myId", styleObject: "test"});
        });
        it("but should not insert it twice", function () {
            styleModel.addLegendInfo("myId", "Point", "test");
            expect(styleModel.get("legendInfos")).to.be.an("array").to.have.lengthOf(1);
            expect(styleModel.get("legendInfos")[0]).to.deep.include({geometryType: "Point", id: "myId", styleObject: "test"});
        });
        it("as long the id is not a bit different", function () {
            styleModel.addLegendInfo("myId2", "Point", "test");
            expect(styleModel.get("legendInfos")).to.be.an("array").to.have.lengthOf(2);
            expect(styleModel.get("legendInfos")[0]).to.deep.include({geometryType: "Point", id: "myId", styleObject: "test"});
            expect(styleModel.get("legendInfos")[1]).to.deep.include({geometryType: "Point", id: "myId2", styleObject: "test"});
        });
    });

    describe("isMultiGeometry", function () {
        it("should return true with multi geometries", function () {
            expect(styleModel.isMultiGeometry("MultiPoint")).to.equal(true);
            expect(styleModel.isMultiGeometry("MultiLineString")).to.equal(true);
            expect(styleModel.isMultiGeometry("MultiPolygon")).to.equal(true);
            expect(styleModel.isMultiGeometry("GeometryCollection")).to.equal(true);
            expect(styleModel.isMultiGeometry("Point")).to.equal(false);
        });
    });

    describe("getGeometryStyle", function () {
        it("should return ol style with correct settings", function () {
            expect(styleModel.getGeometryStyle(jsonObjects[0], rules, false)).to.be.an.instanceof(Style);
            expect(styleModel.getGeometryStyle(jsonObjects[0], rules, false).getImage().getStroke().getColor()).to.be.an("array").to.include.ordered.members([255, 0, 0, 1]);
        });
    });

    describe("getSimpleGeometryStyle", function () {
        it("should return ol point style", function () {
            expect(styleModel.getSimpleGeometryStyle("Point", jsonObjects[0], rules[0], false)).to.be.an.instanceof(Style);
            expect(styleModel.getSimpleGeometryStyle("Point", jsonObjects[0], rules[0], false).getImage().getStroke().getColor()).to.be.an("array").to.include.ordered.members([255, 0, 0, 1]);
        });
        it("should return ol linestring style", function () {
            expect(styleModel.getSimpleGeometryStyle("LineString", jsonObjects[1], rules[0], false)).to.be.an.instanceof(Style);
            expect(styleModel.getSimpleGeometryStyle("LineString", jsonObjects[1], rules[0], false).getStroke().getColor()).to.be.an("array").to.include.ordered.members([100, 0, 0, 1]);
        });
        it("should return ol polygon style", function () {
            expect(styleModel.getSimpleGeometryStyle("Polygon", jsonObjects[2], rules[0], false)).to.be.an.instanceof(Style);
            expect(styleModel.getSimpleGeometryStyle("Polygon", jsonObjects[2], rules[0], false).getStroke().getColor()).to.be.an("array").to.include.ordered.members([100, 100, 0, 1]);
        });
        it("should return ol default style", function () {
            expect(styleModel.getSimpleGeometryStyle("not exist", jsonObjects[2], rules[0], false)).to.be.an.instanceof(Style);
        });
    });

    describe("getMultiGeometryStyle", function () {
        it("should return style array for multipoint", function () {
            expect(styleModel.getMultiGeometryStyle("MultiPoint", jsonObjects[3], rules, false)).to.be.an("array").to.have.lengthOf(2);
        });
        it("should include ol point style", function () {
            expect(styleModel.getMultiGeometryStyle("MultiPoint", jsonObjects[3], rules, false)[0]).to.be.an.instanceof(Style);
            expect(styleModel.getMultiGeometryStyle("MultiPoint", jsonObjects[3], rules, false)[0].getImage().getStroke().getColor()).to.be.an("array").to.include.ordered.members([255, 0, 0, 1]);
        });
        it("should return style array for MultiLineString", function () {
            expect(styleModel.getMultiGeometryStyle("MultiLineString", jsonObjects[4], rules, false)).to.be.an("array").to.have.lengthOf(2);
        });
        it("should include ol stroke style", function () {
            expect(styleModel.getMultiGeometryStyle("MultiLineString", jsonObjects[4], rules, false)[0]).to.be.an.instanceof(Style);
            expect(styleModel.getMultiGeometryStyle("MultiLineString", jsonObjects[4], rules, false)[0].getStroke()).to.be.an.instanceof(Stroke);
            expect(styleModel.getMultiGeometryStyle("MultiLineString", jsonObjects[4], rules, false)[0].getStroke().getColor()).to.be.an("array").to.include.ordered.members([100, 0, 0, 1]);
        });
        it("should return style array for MultiPolygon", function () {
            expect(styleModel.getMultiGeometryStyle("MultiPolygon", jsonObjects[5], rules, false)).to.be.an("array").to.have.lengthOf(2);
        });
        it("should include ol line style", function () {
            expect(styleModel.getMultiGeometryStyle("MultiPolygon", jsonObjects[5], rules, false)[0]).to.be.an.instanceof(Style);
            expect(styleModel.getMultiGeometryStyle("MultiPolygon", jsonObjects[5], rules, false)[0].getStroke()).to.be.an.instanceof(Stroke);
            expect(styleModel.getMultiGeometryStyle("MultiPolygon", jsonObjects[5], rules, false)[0].getFill()).to.be.an.instanceof(Fill);
            expect(styleModel.getMultiGeometryStyle("MultiPolygon", jsonObjects[5], rules, false)[0].getStroke().getColor()).to.be.an("array").to.include.ordered.members([100, 100, 0, 1]);
        });
        it("should return style array for GeometryCollection", function () {
            expect(styleModel.getMultiGeometryStyle("GeometryCollection", jsonObjects[6], rules, false)).to.be.an("array").to.have.lengthOf(2);
        });
        it("should include ol line style", function () {
            expect(styleModel.getMultiGeometryStyle("GeometryCollection", jsonObjects[6], rules, false)[0]).to.be.an.instanceof(Style);
            expect(styleModel.getMultiGeometryStyle("GeometryCollection", jsonObjects[6], rules, false)[0].getImage().getStroke()).to.be.an.instanceof(Stroke);
            expect(styleModel.getMultiGeometryStyle("GeometryCollection", jsonObjects[6], rules, false)[0].getImage().getStroke().getColor()).to.be.an("array").to.include.ordered.members([255, 0, 0, 1]);
            expect(styleModel.getMultiGeometryStyle("GeometryCollection", jsonObjects[6], rules, false)[1].getStroke()).to.be.an.instanceof(Stroke);
        });
    });

    describe("getRuleForIndex", function () {
        it("should return rule with conditions but without sequence", function () {
            expect(styleModel.getRuleForIndex(rules2, 0)).to.be.an("object").to.have.nested.property("style.polygonStrokeColor");
            expect(styleModel.getRuleForIndex(rules2, 0).style.polygonStrokeColor).to.be.an("array").to.include.ordered.members([100, 100, 0, 1]);
        });
        it("should return rule with conditions and sequence", function () {
            expect(styleModel.getRuleForIndex(rules2, 1)).to.be.an("object").to.have.nested.property("style.polygonStrokeColor");
            expect(styleModel.getRuleForIndex(rules2, 1).style.polygonStrokeColor).to.be.an("array").to.include.ordered.members([100, 0, 0, 1]);
        });
        it("should return fallback rule", function () {
            const newArray = [];

            newArray.push(rules2[2]);
            expect(styleModel.getRuleForIndex(newArray, 0)).to.be.an("object").to.have.nested.property("style.polygonStrokeColor");
            expect(styleModel.getRuleForIndex(newArray, 0).style.polygonStrokeColor).to.be.an("array").to.include.ordered.members([100, 100, 100, 1]);
        });
        it("should return null if no rule can be used", function () {
            const newArray = [];

            newArray.push(rules2[0]);
            expect(styleModel.getRuleForIndex(newArray, 0)).to.be.null;
        });
    });

    describe("getIndexedRule", function () {
        it("should return rule with fitting sequence", function () {
            expect(styleModel.getIndexedRule(rules2, 1)).to.be.an("object").to.have.nested.property("style.polygonStrokeColor");
            expect(styleModel.getIndexedRule(rules2, 1).style.polygonStrokeColor).to.be.an("array").to.include.ordered.members([100, 0, 0, 1]);
        });
        it("should return undefined if no rule fits sequence", function () {
            expect(styleModel.getIndexedRule(rules2, 0)).to.be.undefined;
        });
    });

    describe("getLabelStyle", function () {
        it("should return text style", function () {
            expect(styleModel.getLabelStyle(jsonObjects[0], rules2[0].style, false)).to.be.an.instanceof(Text);
            expect(styleModel.getLabelStyle(jsonObjects[0], rules2[0].style, false).getText()).to.equal("myName");
        });
    });

    describe("getRulesForFeature", function () {
        it("should return correct list of rules for feature1", function () {
            styleModel.set("rules", rules2, {silent: true});
            expect(styleModel.getRulesForFeature(jsonObjects[0])).to.be.an("array").to.have.lengthOf(3);
        });
        it("should return correct list of rules for feature2", function () {
            styleModel.set("rules", rules2, {silent: true});
            expect(styleModel.getRulesForFeature(jsonObjects[1])).to.be.an("array").to.have.lengthOf(1);
        });
    });

    describe("checkProperties", function () {
        it("should return true for rule that fits all properties even with sequences", function () {
            expect(styleModel.checkProperties(jsonObjects[0], rules2[0])).to.be.true;
        });
        it("should return true for rule that fits all properties without sequences", function () {
            expect(styleModel.checkProperties(jsonObjects[0], rules2[1])).to.be.true;
        });
        it("should return true for rule that has no properties", function () {
            expect(styleModel.checkProperties(jsonObjects[0], rules2[2])).to.be.true;
        });
        it("should return false for rule that has not fitting properties", function () {
            expect(styleModel.checkProperties(jsonObjects[1], rules2[1])).to.be.false;
        });
    });

    describe("checkProperty", function () {
        it("should return true for fitting property", function () {
            expect(styleModel.checkProperty(jsonObjects[0].getProperties(), "id", "test1")).to.be.true;
        });
        it("should return false for non-fitting property", function () {
            expect(styleModel.checkProperty(jsonObjects[0].getProperties(), "id", "invalidId")).to.be.false;
        });
        it("should return false for invalid key / value", function () {
            expect(styleModel.checkProperty(jsonObjects[0].getProperties(), null, "test1")).to.be.false;
            expect(styleModel.checkProperty(jsonObjects[0].getProperties(), "id", null)).to.be.false;
            expect(styleModel.checkProperty(jsonObjects[0].getProperties(), "id", [0])).to.be.false;
            expect(styleModel.checkProperty(jsonObjects[0].getProperties(), "id", [0, 1, 2])).to.be.false;
        });
    });

    describe("getReferenceValue", function () {
        it("should return plain reference value", function () {
            expect(styleModel.getReferenceValue(jsonObjects[0].getProperties(), "test1")).to.equal("test1");
        });
        it("should return reference value in object path", function () {
            expect(styleModel.getReferenceValue(jsonObjects[0].getProperties(), "@id")).to.equal("test1");
        });
        it("should return array of reference values", function () {
            expect(styleModel.getReferenceValue(jsonObjects[0].getProperties(), [0, 50])).to.be.an("array").to.include.ordered.members([0, 50]);
        });
        it("should return array of reference values in object path", function () {
            expect(styleModel.getReferenceValue(jsonObjects[0].getProperties(), ["@min", "@max"])).to.be.an("array").to.include.ordered.members([10, 100]);
        });
    });

    describe("getFeatureValue", function () {
        it("should return plain feature property", function () {
            expect(styleModel.getFeatureValue(jsonObjects[0].getProperties(), "id")).to.equal("test1");
        });
        it("should return feature property in object path", function () {
            expect(styleModel.getFeatureValue(jsonObjects[0].getProperties(), "@id")).to.equal("test1");
        });
    });

    describe("getFeaturePropertyByPath", function () {
        it("should return direct property", function () {
            expect(styleModel.getFeaturePropertyByPath(jsonObjects[0].getProperties(), "@id")).to.equal("test1");
        });
        it("should return object property", function () {
            expect(styleModel.getFeaturePropertyByPath(jsonObjects[0].getProperties(), "@myObj.myCascade")).to.equal(10);
        });
        it("should return object property in array", function () {
            expect(styleModel.getFeaturePropertyByPath(jsonObjects[0].getProperties(), "@myObj.myArray.0.myValue")).to.equal(20);
        });
        it("should return null if path is invalid", function () {
            expect(styleModel.getFeaturePropertyByPath(jsonObjects[0].getProperties(), "@myObj.myArray.1.myValue")).to.be.null;
        });
        it("should return null if path is invalid", function () {
            expect(styleModel.getFeaturePropertyByPath(jsonObjects[6].getProperties(), "@@test")).to.equal("test");
        });
    });

    describe("compareValues", function () {
        it("should return true if values are the same", function () {
            expect(styleModel.compareValues("test", "test")).to.be.true;
        });
        it("should return true if values are the same but of different type", function () {
            expect(styleModel.compareValues("20", 20)).to.be.true;
            expect(styleModel.compareValues("20.0", 20)).to.be.true;
        });
        it("should return false if values cannot be parsed to same type", function () {
            expect(styleModel.compareValues("abc", 20)).to.be.false;
        });
        it("should return false if reference value is an invalid array", function () {
            expect(styleModel.compareValues(1, [0])).to.be.false;
            expect(styleModel.compareValues(1, [0, 1, 2])).to.be.false;
            expect(styleModel.compareValues(1, [0, 1, 2, 4, 5])).to.be.false;
            expect(styleModel.compareValues(1, ["0", 1])).to.be.false;
            expect(styleModel.compareValues(1, ["0", 1, 2, 3])).to.be.false;
        });
        it("should return false if feature value cannot be parsed to float and reference value is an array", function () {
            expect(styleModel.compareValues("abc", [0, 1, 2, 3])).to.be.false;
        });
        it("should return true if feature value is in range of reference values", function () {
            expect(styleModel.compareValues(20, [20, 25])).to.be.true;
            expect(styleModel.compareValues(21, [20, 25])).to.be.true;
        });
        it("should return false if feature value is not in range of reference values", function () {
            expect(styleModel.compareValues(19, [20, 25])).to.be.false;
            expect(styleModel.compareValues(25, [20, 25])).to.be.false;
        });
        it("should return true if feature value is in range of reference values defined by range", function () {
            expect(styleModel.compareValues(15, [0, 50, 10, 100])).to.be.true;
        });
        it("should return false if feature value is not in range of reference values defined by range", function () {
            expect(styleModel.compareValues(9, [0, 50, 10, 100])).to.be.false;
        });
    });

    describe("isObjectPath", function () {
        it("should return true if value is an object path", function () {
            expect(styleModel.isObjectPath("@id")).to.be.true;
        });
        it("should return false if value is not an object path", function () {
            expect(styleModel.isObjectPath(123)).to.be.false;
            expect(styleModel.isObjectPath("123")).to.be.false;
            expect(styleModel.isObjectPath("foo@id")).to.be.false;
        });
    });
});
