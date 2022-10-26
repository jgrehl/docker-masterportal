import Cluster from "ol/source/Cluster.js";
import {expect} from "chai";
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import sinon from "sinon";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";

import Layer2dVectorSensorThings from "../../layer2dVectorSensorThings";
import SensorThingsHttp from "../../utils/sensorThingsHttp";
import sensorThingsMqtt from "../../utils/sensorThingsMqtt";

describe("src_3_0_0/core/layers/layer2dVectorSensorThings.js", () => {
    let attributes,
        errorStub,
        sensorThingsLayer,
        warn;

    before(() => {
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);
        sinon.stub(console, "error").callsFake(errorStub);

        mapCollection.clear();
        const map = {
            id: "ol",
            mode: "2D",
            getView: () => {
                return {
                    getProjection: () => {
                        return {
                            getCode: () => "EPSG:25832"
                        };
                    }
                };
            }
        };

        mapCollection.addMap(map, "2D");

        sinon.stub(sensorThingsMqtt, "SensorThingsMqtt").returns({
            on: () => sinon.stub()
        });
        sinon.stub(SensorThingsHttp, "SensorThingsHttp").returns({
            get: () => sinon.stub()
        });
    });

    beforeEach(() => {
        attributes = {
            id: "id",
            layers: "layer1,layer2",
            name: "sensorThingsTestLayer",
            typ: "SensorThings",
            url: "https://url.de",
            version: "1.1"
        };

        sensorThingsLayer = new Layer2dVectorSensorThings(attributes);
    });


    after(() => {
        sinon.restore();
    });

    describe("createLayer", () => {
        it("new Layer2dVectorSensorThings should create an layer with no warning", () => {
            const staLayer = new Layer2dVectorSensorThings({});

            expect(staLayer).not.to.be.undefined;
            expect(warn.notCalled).to.be.true;
        });

        it("should create an ol/VectorLayer with source and style", () => {
            const staLayer = new Layer2dVectorSensorThings(attributes),
                layer = staLayer.getLayer();

            expect(layer).to.be.an.instanceof(VectorLayer);
            expect(layer.getSource()).to.be.an.instanceof(VectorSource);
            expect(typeof layer.getStyleFunction()).to.be.equals("function");
            expect(layer.get("id")).to.be.equals(attributes.id);
            expect(layer.get("name")).to.be.equals(attributes.name);
            expect(layer.get("gfiTheme")).to.be.equals(attributes.gfiTheme);
        });

        it("createLayer shall create an ol/VectorLayer with cluster-source", () => {
            attributes.clusterDistance = 60;
            const staLayer = new Layer2dVectorSensorThings(attributes),
                layer = staLayer.getLayer();

            expect(layer).to.be.an.instanceof(VectorLayer);
            expect(layer.getSource()).to.be.an.instanceof(Cluster);
            expect(layer.getSource().getDistance()).to.be.equals(attributes.clusterDistance);
            expect(typeof layer.getStyleFunction()).to.be.equals("function");
        });
    });

    describe("getRawLayerAttributes", () => {
        let localAttributes;

        beforeEach(() => {
            localAttributes = {
                clusterDistance: 10,
                id: "1234",
                url: "exmpale.url",
                version: "1.1"
            };
        });

        it("should return the raw layer attributes", () => {
            expect(sensorThingsLayer.getRawLayerAttributes(localAttributes)).to.deep.equals({
                clusterDistance: 10,
                id: "1234",
                url: "exmpale.url",
                version: "1.1"
            });
        });
    });

    describe("getOptions", () => {
        let options;

        beforeEach(() => {
            options = [
                "clusterGeometryFunction",
                "featuresFilter",
                "onLoadingError"
            ];
        });

        it("should return the options that includes the correct keys", () => {
            expect(Object.keys(sensorThingsLayer.getOptions(attributes))).to.deep.equals(options);
        });
    });

    describe("getMqttHostFromUrl", () => {
        it("should call the error handler if anything but a string is given as first parameter and should return an empty string", () => {
            let lastError = null;
            const result = sensorThingsLayer.getMqttHostFromUrl(undefined, error => {
                lastError = error;
            });

            expect(result).to.be.a("string").and.to.be.empty;
            expect(lastError).to.be.an.instanceof(Error);
        });

        it("should call the error handler if the given url is not valid", () => {
            let lastError = null;
            const result = sensorThingsLayer.getMqttHostFromUrl("https:/iot.hamburg.de", error => {
                lastError = error;
            });

            expect(result).to.be.a("string").and.to.be.empty;
            expect(lastError).to.be.an.instanceof(Error);
        });

        it("should return the mqtt host from the given url", () => {
            let lastError = null;
            const result = sensorThingsLayer.getMqttHostFromUrl("https://iot.hamburg.de", error => {
                lastError = error;
            });

            expect(result).to.equal("iot.hamburg.de");
            expect(lastError).to.not.be.an.instanceof(Error);
        });
    });

    describe("getDatastreamIdFromMqttTopic", () => {
        it("should return an empty string if anything but a string is given", () => {
            expect(sensorThingsLayer.getDatastreamIdFromMqttTopic(undefined)).to.be.a("string").and.to.be.empty;
            expect(sensorThingsLayer.getDatastreamIdFromMqttTopic(null)).to.be.a("string").and.to.be.empty;
            expect(sensorThingsLayer.getDatastreamIdFromMqttTopic(1234)).to.be.a("string").and.to.be.empty;
            expect(sensorThingsLayer.getDatastreamIdFromMqttTopic(true)).to.be.a("string").and.to.be.empty;
            expect(sensorThingsLayer.getDatastreamIdFromMqttTopic(false)).to.be.a("string").and.to.be.empty;
            expect(sensorThingsLayer.getDatastreamIdFromMqttTopic([])).to.be.a("string").and.to.be.empty;
            expect(sensorThingsLayer.getDatastreamIdFromMqttTopic({})).to.be.a("string").and.to.be.empty;
        });

        it("should return an empty string if a string without a certain indicator is given", () => {
            expect(sensorThingsLayer.getDatastreamIdFromMqttTopic("test")).to.be.a("string").and.to.be.empty;
        });

        it("should return the first occurence of an id within certain indicators", () => {
            expect(sensorThingsLayer.getDatastreamIdFromMqttTopic("test.Datastreams(1234).Observations(5678)")).to.equal("1234");
        });
    });

    describe("getFeatureByDatastreamId", () => {
        it("should return null if the first parameter is anything but an array", () => {
            expect(sensorThingsLayer.getFeatureByDatastreamId({}, "6789")).to.be.null;
            expect(sensorThingsLayer.getFeatureByDatastreamId(null, "6789")).to.be.null;
            expect(sensorThingsLayer.getFeatureByDatastreamId(undefined, "6789")).to.be.null;
            expect(sensorThingsLayer.getFeatureByDatastreamId(123, "6789")).to.be.null;
            expect(sensorThingsLayer.getFeatureByDatastreamId(true, "6789")).to.be.null;
            expect(sensorThingsLayer.getFeatureByDatastreamId(false, "6789")).to.be.null;
            expect(sensorThingsLayer.getFeatureByDatastreamId("string", "6789")).to.be.null;
        });

        it("should return null if the second parameter is anything but a string", () => {
            expect(sensorThingsLayer.getFeatureByDatastreamId([], {})).to.be.null;
            expect(sensorThingsLayer.getFeatureByDatastreamId([], null)).to.be.null;
            expect(sensorThingsLayer.getFeatureByDatastreamId([], undefined)).to.be.null;
            expect(sensorThingsLayer.getFeatureByDatastreamId([], 123)).to.be.null;
            expect(sensorThingsLayer.getFeatureByDatastreamId([], true)).to.be.null;
            expect(sensorThingsLayer.getFeatureByDatastreamId([], false)).to.be.null;
            expect(sensorThingsLayer.getFeatureByDatastreamId([], [])).to.be.null;
        });

        it("should return null if the given features are an empty array", () => {
            expect(sensorThingsLayer.getFeatureByDatastreamId([], "string")).to.be.null;
        });

        it("should return null if the given id is not included in any dataStreamId of the given features", () => {
            const features = [
                {get: () => "1234 | 5678"},
                {get: () => "2345 | 6789"},
                {get: () => "3456 | 7890"}
            ];

            expect(sensorThingsLayer.getFeatureByDatastreamId(features, "4321")).to.be.null;
        });

        it("should return the feature where id equals the dataStreamId", () => {
            const features = [
                    {get: () => "1234 | 5678"},
                    {get: () => "2345"},
                    {get: () => "3456 | 7890"}
                ],
                result = sensorThingsLayer.getFeatureByDatastreamId(features, "2345");

            expect(result).to.be.an("object");
            expect(result.get).to.be.a("function");
            expect(result.get()).to.equal("2345");
        });

        it("should return the feature where id is found in a piped dataStreamId string", () => {
            const features = [
                    {get: () => "1234 | 5678"},
                    {get: () => "2345 | 6789"},
                    {get: () => "3456 | 7890"}
                ],
                result = sensorThingsLayer.getFeatureByDatastreamId(features, "6789");

            expect(result).to.be.an("object");
            expect(result.get).to.be.a("function");
            expect(result.get()).to.equal("2345 | 6789");
        });

        it("should return null if the given id is only a sub part of an id of a piped dataStreamId string", () => {
            const features = [
                {get: () => "1234 | 5678"},
                {get: () => "2345 | 6789"},
                {get: () => "3456 | 7890"}
            ];

            expect(sensorThingsLayer.getFeatureByDatastreamId(features, "23")).to.be.null;
        });
    });

    describe("getDatastreamIdsHelper", () => {
        it("should return false if the first parameter is not an object", () => {
            expect(sensorThingsLayer.getDatastreamIdsHelper([], [])).to.be.false;
            expect(sensorThingsLayer.getDatastreamIdsHelper(null, [])).to.be.false;
            expect(sensorThingsLayer.getDatastreamIdsHelper(undefined, [])).to.be.false;
            expect(sensorThingsLayer.getDatastreamIdsHelper(123, [])).to.be.false;
            expect(sensorThingsLayer.getDatastreamIdsHelper(true, [])).to.be.false;
            expect(sensorThingsLayer.getDatastreamIdsHelper(false, [])).to.be.false;
            expect(sensorThingsLayer.getDatastreamIdsHelper("string", [])).to.be.false;
        });

        it("should return false if the first parameter is an object but has no get function", () => {
            expect(sensorThingsLayer.getDatastreamIdsHelper({}, [])).to.be.false;
        });

        it("should return false if the first parameter has not string value under dataStreamId received by getter", () => {
            expect(sensorThingsLayer.getDatastreamIdsHelper({get: () => undefined}, [])).to.be.false;
            expect(sensorThingsLayer.getDatastreamIdsHelper({get: () => null}, [])).to.be.false;
            expect(sensorThingsLayer.getDatastreamIdsHelper({get: () => 123}, [])).to.be.false;
            expect(sensorThingsLayer.getDatastreamIdsHelper({get: () => true}, [])).to.be.false;
            expect(sensorThingsLayer.getDatastreamIdsHelper({get: () => false}, [])).to.be.false;
            expect(sensorThingsLayer.getDatastreamIdsHelper({get: () => []}, [])).to.be.false;
            expect(sensorThingsLayer.getDatastreamIdsHelper({get: () => {
                return {};
            }}, [])).to.be.false;
        });

        it("should return false if the second parameter is not an array", () => {
            expect(sensorThingsLayer.getDatastreamIdsHelper({get: () => "string"}, undefined)).to.be.false;
            expect(sensorThingsLayer.getDatastreamIdsHelper({get: () => "string"}, null)).to.be.false;
            expect(sensorThingsLayer.getDatastreamIdsHelper({get: () => "string"}, 123)).to.be.false;
            expect(sensorThingsLayer.getDatastreamIdsHelper({get: () => "string"}, true)).to.be.false;
            expect(sensorThingsLayer.getDatastreamIdsHelper({get: () => "string"}, false)).to.be.false;
            expect(sensorThingsLayer.getDatastreamIdsHelper({get: () => "string"}, {})).to.be.false;
            expect(sensorThingsLayer.getDatastreamIdsHelper({get: () => "string"}, "string")).to.be.false;
        });

        it("should push a pipeless value into the second parameter", () => {
            const feature = {
                    get: () => "1234"
                },
                result = [];

            expect(sensorThingsLayer.getDatastreamIdsHelper(feature, result)).to.be.true;
            expect(result).to.deep.equal(["1234"]);
        });

        it("should push all value splitted by pipe into the second parameter", () => {
            const feature = {
                    get: () => "1234 | 5678"
                },
                result = [];

            expect(sensorThingsLayer.getDatastreamIdsHelper(feature, result)).to.be.true;
            expect(result).to.deep.equal(["1234", "5678"]);
        });
    });

    describe("getDatastreamIds", () => {
        it("should return an empty array if the given parameter is not an array", () => {
            expect(sensorThingsLayer.getDatastreamIds(undefined)).to.be.an("array").and.to.be.empty;
            expect(sensorThingsLayer.getDatastreamIds(null)).to.be.an("array").and.to.be.empty;
            expect(sensorThingsLayer.getDatastreamIds(123)).to.be.an("array").and.to.be.empty;
            expect(sensorThingsLayer.getDatastreamIds(true)).to.be.an("array").and.to.be.empty;
            expect(sensorThingsLayer.getDatastreamIds(false)).to.be.an("array").and.to.be.empty;
            expect(sensorThingsLayer.getDatastreamIds("string")).to.be.an("array").and.to.be.empty;
            expect(sensorThingsLayer.getDatastreamIds({})).to.be.an("array").and.to.be.empty;
        });

        it("should return an empty array if the given parameter is an array but is empty", () => {
            expect(sensorThingsLayer.getDatastreamIds([])).to.be.an("array").and.to.be.empty;
        });

        it("should return an empty array if the features are not objects", () => {
            expect(sensorThingsLayer.getDatastreamIds([undefined, null, 123, true, false, "string", []])).to.be.an("array").and.to.be.empty;
        });

        it("should return an empty array if the features are objects but have no get function", () => {
            expect(sensorThingsLayer.getDatastreamIds([{}, {get: false}])).to.be.an("array").and.to.be.empty;
        });

        it("should collect the datastream ids of the features if the features have no sub features", () => {
            const features = [
                {get: key => key === "features" ? undefined : "123"},
                {get: key => key === "features" ? undefined : "456 | 789"}
            ];

            expect(sensorThingsLayer.getDatastreamIds(features)).to.deep.equal(["123", "456", "789"]);
        });

        it("should collect all datastream ids of all sub features if any given features have sub features", () => {
            const features = [
                {
                    get: () => [
                        {get: key => key === "features" ? undefined : "321"},
                        {get: key => key === "features" ? undefined : "654 | 987"}
                    ]
                },
                {get: key => key === "features" ? undefined : "123"},
                {get: key => key === "features" ? undefined : "456 | 789"}
            ];

            expect(sensorThingsLayer.getDatastreamIds(features)).to.deep.equal(["321", "654", "987", "123", "456", "789"]);
        });
    });

    describe("replaceValueInArrayByReference", () => {
        it("should return false if the given result is not an array", () => {
            expect(sensorThingsLayer.replaceValueInArrayByReference(undefined, [], "string", "value")).to.be.false;
            expect(sensorThingsLayer.replaceValueInArrayByReference(null, [], "string", "value")).to.be.false;
            expect(sensorThingsLayer.replaceValueInArrayByReference(123, [], "string", "value")).to.be.false;
            expect(sensorThingsLayer.replaceValueInArrayByReference(true, [], "string", "value")).to.be.false;
            expect(sensorThingsLayer.replaceValueInArrayByReference(false, [], "string", "value")).to.be.false;
            expect(sensorThingsLayer.replaceValueInArrayByReference("string", [], "string", "value")).to.be.false;
            expect(sensorThingsLayer.replaceValueInArrayByReference({}, [], "string", "value")).to.be.false;
        });

        it("should return false if the given referenceArray is not an array", () => {
            expect(sensorThingsLayer.replaceValueInArrayByReference([], undefined, "string", "value")).to.be.false;
            expect(sensorThingsLayer.replaceValueInArrayByReference([], null, "string", "value")).to.be.false;
            expect(sensorThingsLayer.replaceValueInArrayByReference([], 123, "string", "value")).to.be.false;
            expect(sensorThingsLayer.replaceValueInArrayByReference([], true, "string", "value")).to.be.false;
            expect(sensorThingsLayer.replaceValueInArrayByReference([], false, "string", "value")).to.be.false;
            expect(sensorThingsLayer.replaceValueInArrayByReference([], "string", "string", "value")).to.be.false;
            expect(sensorThingsLayer.replaceValueInArrayByReference([], {}, "string", "value")).to.be.false;
        });

        it("should replace value in array by reference and return true", () => {
            const resArr = [];

            expect(sensorThingsLayer.replaceValueInArrayByReference(resArr, ["3"], "3", "5")).to.be.true;
            expect(resArr).to.deep.equal(["5"]);
        });

        it("should return empty array if reference array does not includes the given reference", () => {
            const resArr = [];

            expect(sensorThingsLayer.replaceValueInArrayByReference(resArr, ["3"], "4", "5")).to.be.true;
            expect(resArr).to.deep.equal([]);
        });
    });

    describe("replaceValueInPipedProperty", () => {
        it("should return an empty string if the given parameters are not correct", () => {
            expect(sensorThingsLayer.replaceValueInPipedProperty({}, "dataStreamValue", "8805", "available")).to.be.a("string").and.to.be.empty;
            expect(sensorThingsLayer.replaceValueInPipedProperty([], "dataStreamValue", "8805", "available")).to.be.a("string").and.to.be.empty;
            expect(sensorThingsLayer.replaceValueInPipedProperty([], undefined, "8805", "available")).to.be.a("string").and.to.be.empty;
            expect(sensorThingsLayer.replaceValueInPipedProperty([], "dataStreamValue", undefined, "available")).to.be.a("string").and.to.be.empty;
            expect(sensorThingsLayer.replaceValueInPipedProperty([], "dataStreamValue", "8805", undefined)).to.be.a("string").and.to.be.empty;
            expect(sensorThingsLayer.replaceValueInPipedProperty(undefined, undefined, undefined, undefined)).to.be.a("string").and.to.be.empty;
        });

        it("should return an empty string if the given feature has no dataStreamId", () => {
            const feature = {
                get: key => key === "dataStreamId" ? undefined : "foo | bar"
            };

            expect(sensorThingsLayer.replaceValueInPipedProperty(feature, "property", "dataStreamId", "value")).to.be.a("string").and.to.be.empty;
        });

        it("should return an empty string if the given feature has not the expected property", () => {
            const feature = {
                get: key => key === "dataStreamId" ? "1 | 2" : undefined
            };

            expect(sensorThingsLayer.replaceValueInPipedProperty(feature, "property", "dataStreamId", "value")).to.be.a("string").and.to.be.empty;
        });

        it("should replace value in piped properties", () => {
            const feature = {
                get: key => key === "dataStreamId" ? "1 | 2" : "foo | bar"
            };

            expect(sensorThingsLayer.replaceValueInPipedProperty(feature, "property", "2", "baz")).to.equal("foo | baz");
        });
    });

    describe("updateFeatureProperties", () => {
        it("should return false if the given feature has no get function", () => {
            expect(sensorThingsLayer.updateFeatureProperties(undefined)).to.be.false;
            expect(sensorThingsLayer.updateFeatureProperties(null)).to.be.false;
            expect(sensorThingsLayer.updateFeatureProperties(1234)).to.be.false;
            expect(sensorThingsLayer.updateFeatureProperties(true)).to.be.false;
            expect(sensorThingsLayer.updateFeatureProperties(false)).to.be.false;
            expect(sensorThingsLayer.updateFeatureProperties([])).to.be.false;
            expect(sensorThingsLayer.updateFeatureProperties({})).to.be.false;
        });

        it("should return false if the given feature has not set function", () => {
            expect(sensorThingsLayer.updateFeatureProperties({get: () => false})).to.be.false;
        });

        it("should return false if the feature has no dataStreamId property", () => {
            expect(sensorThingsLayer.updateFeatureProperties({get: () => false, set: () => false})).to.be.false;
        });

        it("should return false if the feature has no dataStreamName property", () => {
            expect(sensorThingsLayer.updateFeatureProperties({get: key => key === "dataStreamId" ? "str" : false, set: () => false})).to.be.false;
        });

        it("should return false if the feature has no dataStreamName property", () => {
            expect(sensorThingsLayer.updateFeatureProperties({get: key => key === "dataStreamId" ? "str" : false, set: () => false})).to.be.false;
        });

        it("should return true and change the feature", () => {
            const setLogger = [],
                feature = {
                    get: key => {
                        if (key === "dataStreamId") {
                            return "1 | 2";
                        }
                        else if (key === "dataStreamName") {
                            return "nameA | nameB";
                        }
                        else if (key === "dataStreamValue") {
                            return "nameA | nameB";
                        }
                        else if (key === "dataStreamPhenomenonTime") {
                            return "phenomenonTimeA | phenomenonTimeB";
                        }
                        return undefined;
                    },
                    set: (key, value) => {
                        setLogger.push({key, value});
                    }
                },
                expected = [
                    {
                        key: "dataStream_2_nameB",
                        value: "result"
                    },
                    {
                        key: "dataStream_2_nameB_phenomenonTime",
                        value: "phenomenonTime"
                    },
                    {
                        key: "dataStreamValue",
                        value: "nameA | result"
                    },
                    {
                        key: "dataStreamPhenomenonTime",
                        value: "phenomenonTimeA | phenomenonTime"
                    }
                ];

            expect(sensorThingsLayer.updateFeatureProperties(feature, "2", "result", "phenomenonTime", "showNoDataValue", "noDataValue", "funcChangeFeatureGFI")).to.be.true;
            expect(setLogger).to.deep.equal(expected);
        });

        it("should return true and change the feature with showNoDataValue and noDataValue", () => {
            const setLogger = [],
                feature = {
                    get: key => {
                        if (key === "dataStreamId") {
                            return "1 | 2";
                        }
                        else if (key === "dataStreamName") {
                            return "nameA | nameB";
                        }
                        else if (key === "dataStreamValue") {
                            return "nameA | nameB";
                        }
                        else if (key === "dataStreamPhenomenonTime") {
                            return "phenomenonTimeA | phenomenonTimeB";
                        }
                        return undefined;
                    },
                    set: (key, value) => {
                        setLogger.push({key, value});
                    }
                },
                expected = [
                    {
                        key: "dataStream_2_nameB",
                        value: "noDataValue"
                    },
                    {
                        key: "dataStream_2_nameB_phenomenonTime",
                        value: "phenomenonTime"
                    },
                    {
                        key: "dataStreamValue",
                        value: "nameA | noDataValue"
                    },
                    {
                        key: "dataStreamPhenomenonTime",
                        value: "phenomenonTimeA | phenomenonTime"
                    }
                ];

            expect(sensorThingsLayer.updateFeatureProperties(feature, "2", "", "phenomenonTime", true, "noDataValue", "funcChangeFeatureGFI")).to.be.true;
            expect(setLogger).to.deep.equal(expected);
        });
    });

    describe("updateObservationForDatastreams", () => {
        const feature = new Feature({
            Datastreams: [{
                "@iot.id": "foo",
                Observations: []
            }, {
                "@iot.id": "bar",
                Observations: []
            }]
        });

        it("should add the given observation to the property Datastreams where the datastream id equals the given datastream id", () => {
            sensorThingsLayer.updateObservationForDatastreams(feature, "foo", "qox");

            expect(feature.get("Datastreams")[0].Observations).to.deep.equal(["qox"]);
            expect(feature.get("Datastreams")[1].Observations).to.be.empty;
        });
    });

    describe("enlargeExtent", () => {
        it("should return correctly enlarged extent", () => {
            expect(sensorThingsLayer.enlargeExtent([100, 100, 200, 200], 0.1)).to.be.an("array").to.have.ordered.members([90, 90, 210, 210]);
        });
        it("should return correctly reduced extent", () => {
            expect(sensorThingsLayer.enlargeExtent([100, 100, 200, 200], -0.1)).to.be.an("array").to.have.ordered.members([110, 110, 190, 190]);
        });
    });

    describe("getFeaturesInExtent", () => {
        it("should return no feature within extent", () => {
            const features = [],
                feature1 = new Feature({
                    geometry: new Point([50, 50])
                }),
                currentExtent = [100, 100, 200, 200];

            features.push(feature1);
            expect(sensorThingsLayer.getFeaturesInExtent(features, currentExtent)).to.be.an("array").that.is.empty;
        });

        it("should return only one feature within extent", () => {
            const features = [],
                feature1 = new Feature({
                    geometry: new Point([50, 50])
                }),
                feature2 = new Feature({
                    geometry: new Point([150, 150])
                }),
                currentExtent = [100, 100, 200, 200];

            features.push(feature1);
            features.push(feature2);

            expect(sensorThingsLayer.getFeaturesInExtent(features, currentExtent)).to.be.an("array").to.have.lengthOf(1);
        });

        it("should also return a feature inside enlarged extent", () => {
            const features = [],
                feature1 = new Feature({
                    geometry: new Point([50, 50])
                }),
                feature2 = new Feature({
                    geometry: new Point([150, 150])
                }),
                feature3 = new Feature({
                    geometry: new Point([201, 201])
                }),
                currentExtent = [100, 100, 200, 200];

            features.push(feature1);
            features.push(feature2);
            features.push(feature3);

            expect(sensorThingsLayer.getFeaturesInExtent(features, currentExtent)).to.be.an("array").to.have.lengthOf(2);
        });
    });

    describe("getDatastreamIds", () => {
        it("should return a empty array for undefined input", () => {
            expect(sensorThingsLayer.getDatastreamIds(undefined)).to.be.an("array").that.is.empty;
            expect(sensorThingsLayer.getDatastreamIds(null)).to.be.an("array").that.is.empty;
            expect(sensorThingsLayer.getDatastreamIds({})).to.be.an("array").that.is.empty;
            expect(sensorThingsLayer.getDatastreamIds(123)).to.be.an("array").that.is.empty;
            expect(sensorThingsLayer.getDatastreamIds("string")).to.be.an("array").that.is.empty;
            expect(sensorThingsLayer.getDatastreamIds(true)).to.be.an("array").that.is.empty;
            expect(sensorThingsLayer.getDatastreamIds(false)).to.be.an("array").that.is.empty;
        });

        it("should return an array with Strings for features input", () => {
            const feature0 = new Feature({
                    geometry: new Point([100, 100]),
                    dataStreamId: "1 | 2"
                }),
                feature1 = new Feature({
                    geometry: new Point([100, 100]),
                    dataStreamId: "3 | 4"
                }),
                features = [feature0, feature1];

            expect(sensorThingsLayer.getDatastreamIds(features)).to.be.an("array").that.includes("1", "2", "3", "4");
        });
    });

    describe("getFeatureByDatastreamId", () => {
        it("should return null on undefined inputs", () => {
            expect(sensorThingsLayer.getFeatureByDatastreamId(undefined, undefined)).to.be.null;
        });

        it("should return null on undefined array", () => {
            expect(sensorThingsLayer.getFeatureByDatastreamId(undefined, "1")).to.be.null;
        });

        it("should return null on empty array and undefined datastreamid", () => {
            expect(sensorThingsLayer.getFeatureByDatastreamId([], undefined)).to.be.null;
        });

        it("should return null on empty array", () => {
            expect(sensorThingsLayer.getFeatureByDatastreamId([], "1")).to.be.null;
        });

        it("should return a Feature", () => {
            const feature0 = new Feature({
                    dataStreamId: "1",
                    geometry: new Point([100, 100])
                }),
                feature1 = new Feature({
                    dataStreamId: "2",
                    geometry: new Point([100, 100])
                }),
                features = [feature0, feature1];

            expect(sensorThingsLayer.getFeatureByDatastreamId(features, "1")).to.be.an.instanceof(Feature);
        });

        it("should return a Feature with combined dataStreamId", () => {
            const feature0 = new Feature({
                    dataStreamId: "1",
                    geometry: new Point([100, 100])
                }),
                feature1 = new Feature({
                    dataStreamId: "2 | 3",
                    geometry: new Point([100, 100])
                }),
                features = [feature0, feature1];

            expect(sensorThingsLayer.getFeatureByDatastreamId(features, "3")).to.be.an.instanceof(Feature);
        });
    });

    describe("aggregatePropertiesOfThings", () => {
        it("should set one Thing in a simple way without aggregation", () => {
            const allThings = [
                    {
                        "@iot.id": "quix",
                        name: "foo",
                        description: "bar",
                        properties: {
                            "baz": "qux"
                        },
                        Locations: [{
                            location: {
                                type: "Feature",
                                geometry: {
                                    type: "Point",
                                    coordinates: [1, 2, 3]
                                }
                            }
                        }],
                        Datastreams: [{"foobar": 1}]
                    }
                ],
                expectedOutcome = [{
                    location: {
                        type: "Point",
                        coordinates: [1, 2, 3]
                    },
                    properties: {
                        baz: "qux",
                        name: "foo",
                        description: "bar",
                        "@iot.id": "quix",
                        requestUrl: "http://example.com",
                        versionUrl: "1.1",
                        Datastreams: [{"foobar": 1}]
                    }
                }];

            sensorThingsLayer.set("url", "http://example.com", {silent: true});
            sensorThingsLayer.set("version", "1.1", {silent: true});

            expect(sensorThingsLayer.aggregatePropertiesOfThings(allThings, "http://example.com", "1.1")).to.deep.equal(expectedOutcome);
        });

        it("should aggregate Things if there is more than one thing", () => {
            const allThings = [[
                    {
                        "@iot.id": "quix",
                        name: "foo",
                        description: "bar",
                        properties: {
                            "baz": "qux"
                        },
                        Locations: [{
                            location: {
                                type: "Point",
                                coordinates: [3, 4, 5]
                            }
                        }],
                        Datastreams: [{"foobar": 10}]
                    },
                    {
                        "@iot.id": "xiuq",
                        name: "oof",
                        description: "rab",
                        properties: {
                            "baz": "xuq"
                        },
                        Locations: [{
                            location: {
                                type: "Feature",
                                geometry: {
                                    type: "Point",
                                    coordinates: [3, 4, 5]
                                }
                            }
                        }],
                        Datastreams: [{"foobar": 11}]
                    }
                ]],
                expectedOutcome = [{
                    location: {
                        type: "Point",
                        coordinates: [3, 4, 5]
                    },
                    properties: {
                        Datastreams: [{"foobar": 10}, {"foobar": 11}],
                        baz: "qux | xuq",
                        name: "foo | oof",
                        description: "bar | rab",
                        "@iot.id": "quix | xiuq",
                        requestUrl: "http://example.com",
                        versionUrl: "1.1"
                    }
                }];

            sensorThingsLayer.set("url", "http://example.com", {silent: true});
            sensorThingsLayer.set("version", "1.1", {silent: true});

            expect(sensorThingsLayer.aggregatePropertiesOfThings(allThings, "http://example.com", "1.1")).to.deep.equal(expectedOutcome);
        });
    });

    describe("getThingsGeometry", () => {
        it("should return the location in geometry", () => {
            const testObject = {
                Locations: [
                    {
                        location: {
                            geometry: {
                                type: "Point",
                                test: "Test"
                            }
                        }
                    }
                ]
            };

            expect(sensorThingsLayer.getThingsGeometry(testObject, 0)).to.be.an("object").to.include({test: "Test"});
            expect(sensorThingsLayer.getThingsGeometry(testObject, 1)).to.be.null;
        });

        it("should return the location without geometry", () => {
            const testObject2 = {
                Locations: [
                    {
                        location: {
                            type: "Point",
                            test: "Test"
                        }
                    }
                ]
            };

            expect(sensorThingsLayer.getThingsGeometry(testObject2, 0)).to.be.an("object").to.include({test: "Test"});
            expect(sensorThingsLayer.getThingsGeometry(testObject2, 1)).to.be.null;
        });
    });

    describe("buildSensorThingsUrl", () => {
        it("should return an url as string for a specific input", () => {
            const testUrl = "https://www.example.com:1234/foo/bar",
                testVersion = "1.1",
                testUrlParams = {
                    "baz": 1234,
                    "qux": "foobar"
                },
                expectedOutput = "https://www.example.com:1234/foo/bar/v1.1/Things?$baz=1234&$qux=foobar";

            expect(sensorThingsLayer.buildSensorThingsUrl(testUrl, testVersion, testUrlParams)).to.equal(expectedOutput);
        });

        it("should return an url with datastreams as root", () => {
            const testUrl = "https://www.example.com:1234/foo/bar",
                testVersion = "1.1",
                testUrlParams = {
                    "filter": "fi",
                    "expand": "ex",
                    "root": "Datastreams"
                },
                expectedOutput = "https://www.example.com:1234/foo/bar/v1.1/Datastreams?$filter=fi&$expand=ex";

            expect(sensorThingsLayer.buildSensorThingsUrl(testUrl, testVersion, testUrlParams)).to.equal(expectedOutput);
        });

        it("should return an url as string for a specific input including nested urlParams", () => {
            const testUrl = "https://www.example.com:1234/foo/bar",
                testVersion = "1.1",
                testUrlParams = {
                    "baz": 1234,
                    "qux": [
                        "subParamA",
                        "subParamB",
                        "subParamC"
                    ]
                },
                expectedOutput = "https://www.example.com:1234/foo/bar/v1.1/Things?$baz=1234&$qux=subParamA,subParamB,subParamC";

            expect(sensorThingsLayer.buildSensorThingsUrl(testUrl, testVersion, testUrlParams)).to.equal(expectedOutput);
        });

        it("should return an url without query if no params as object are given", () => {
            const testUrl = "https://www.example.com:1234/foo/bar",
                testVersion = "1.1",
                expectedOutput = "https://www.example.com:1234/foo/bar/v1.1/Things?";

            expect(sensorThingsLayer.buildSensorThingsUrl(testUrl, testVersion, false)).to.equal(expectedOutput);
            expect(sensorThingsLayer.buildSensorThingsUrl(testUrl, testVersion, undefined)).to.equal(expectedOutput);
            expect(sensorThingsLayer.buildSensorThingsUrl(testUrl, testVersion, null)).to.equal(expectedOutput);
            expect(sensorThingsLayer.buildSensorThingsUrl(testUrl, testVersion, "baz")).to.equal(expectedOutput);
            expect(sensorThingsLayer.buildSensorThingsUrl(testUrl, testVersion, 12345)).to.equal(expectedOutput);
            expect(sensorThingsLayer.buildSensorThingsUrl(testUrl, testVersion, [])).to.equal(expectedOutput);
            expect(sensorThingsLayer.buildSensorThingsUrl(testUrl, testVersion, {})).to.equal(expectedOutput);
        });

        it("should eat any url possible without checking its target or syntax", () => {
            const testUrlParams = {
                "foo": "bar"
            };

            expect(sensorThingsLayer.buildSensorThingsUrl("", "1.1", testUrlParams)).to.equal("/v1.1/Things?$foo=bar");
            expect(sensorThingsLayer.buildSensorThingsUrl("http://", "1.1", testUrlParams)).to.equal("http:///v1.1/Things?$foo=bar");
            expect(sensorThingsLayer.buildSensorThingsUrl("wfs://baz", "1.1", testUrlParams)).to.equal("wfs://baz/v1.1/Things?$foo=bar");
            expect(sensorThingsLayer.buildSensorThingsUrl("foobar://baz////", "1.1", testUrlParams)).to.equal("foobar://baz/////v1.1/Things?$foo=bar");
        });

        it("should take any version as string unchecked", () => {
            expect(sensorThingsLayer.buildSensorThingsUrl("", "1.1", false)).to.equal("/v1.1/Things?");
            expect(sensorThingsLayer.buildSensorThingsUrl("", "foo", false)).to.equal("/vfoo/Things?");
            expect(sensorThingsLayer.buildSensorThingsUrl("", "foo.bar.baz", false)).to.equal("/vfoo.bar.baz/Things?");
        });

        it("should take any version as number fixed to one decimal number", () => {
            expect(sensorThingsLayer.buildSensorThingsUrl("", 0.5, false)).to.equal("/v0.5/Things?");
            expect(sensorThingsLayer.buildSensorThingsUrl("", 0.55, false)).to.equal("/v0.6/Things?");
            expect(sensorThingsLayer.buildSensorThingsUrl("", 0.00000001, false)).to.equal("/v0.0/Things?");
            expect(sensorThingsLayer.buildSensorThingsUrl("", 999999.9999999, false)).to.equal("/v1000000.0/Things?");
        });

        it("should stringify any given parameter for url and version - no matter what", () => {
            const testUrlParams = {
                "foo": "bar"
            };

            expect(sensorThingsLayer.buildSensorThingsUrl(undefined, undefined, testUrlParams)).to.equal("undefined/vundefined/Things?$foo=bar");
            expect(sensorThingsLayer.buildSensorThingsUrl(null, null, testUrlParams)).to.equal("null/vnull/Things?$foo=bar");
            expect(sensorThingsLayer.buildSensorThingsUrl([], [], testUrlParams)).to.equal("/v/Things?$foo=bar");
            expect(sensorThingsLayer.buildSensorThingsUrl({}, {}, testUrlParams)).to.equal("[object Object]/v[object Object]/Things?$foo=bar");
        });
    });

    describe("unifyThingsByIds", () => {
        it("should return a thing array with merged datastreams", () => {
            const sensordata = [
                    {
                        "@iot.id": 999,
                        "name": "Thing",
                        "properties": {
                            "requestUrl": "https:sensorTestUrl"
                        },
                        Locations: [
                            {
                                "@iot.id": 777,
                                "name": "location"
                            }
                        ],
                        Datastreams: [
                            {
                                "@iot.id": 10492,
                                "@iot.selfLink": "https://sensorUrlTest",
                                "Observations": [
                                    {
                                        "@iot.id": 123,
                                        "result": "testResult",
                                        "phenomenonTime": "2021-01-22T05:11:31.222Z"
                                    }
                                ],
                                "description": "Lalala",
                                "name": "abc"
                            }
                        ]
                    },
                    {
                        "@iot.id": 999,
                        "name": "Thing",
                        "properties": {
                            "requestUrl": "https:sensorTestUrl"
                        },
                        Locations: [
                            {
                                "@iot.id": 777,
                                "name": "location"
                            }
                        ],
                        Datastreams: [
                            {
                                "@iot.id": 10493,
                                "@iot.selfLink": "https://sensorUrlTest1",
                                "Observations": [
                                    {
                                        "@iot.id": 456,
                                        "result": "testResult",
                                        "phenomenonTime": "2021-01-22T05:11:31.222Z"
                                    }
                                ],
                                "description": "Lalala",
                                "name": "abc"
                            }
                        ]
                    }
                ],
                parseDatastreams = sensorThingsLayer.unifyThingsByIds(sensordata),
                expected = [{
                    "@iot.id": 999,
                    "name": "Thing",
                    "properties": {
                        "requestUrl": "https:sensorTestUrl"
                    },
                    Locations: [
                        {
                            "@iot.id": 777,
                            "name": "location"
                        }
                    ],
                    Datastreams: [
                        {
                            "@iot.id": 10492,
                            "@iot.selfLink": "https://sensorUrlTest",
                            "Observations": [
                                {
                                    "@iot.id": 123,
                                    "result": "testResult",
                                    "phenomenonTime": "2021-01-22T05:11:31.222Z"
                                }
                            ],
                            "description": "Lalala",
                            "name": "abc"
                        },
                        {
                            "@iot.id": 10493,
                            "@iot.selfLink": "https://sensorUrlTest1",
                            "Observations": [
                                {
                                    "@iot.id": 456,
                                    "result": "testResult",
                                    "phenomenonTime": "2021-01-22T05:11:31.222Z"
                                }
                            ],
                            "description": "Lalala",
                            "name": "abc"
                        }
                    ]
                }];

            expect(parseDatastreams).to.deep.equal(expected);
        });
    });

    describe("createPropertiesOfDatastreamsHelper", () => {
        it("should return false if the first parameter is not an array", () => {
            expect(sensorThingsLayer.createPropertiesOfDatastreamsHelper(undefined)).to.be.false;
            expect(sensorThingsLayer.createPropertiesOfDatastreamsHelper(null)).to.be.false;
            expect(sensorThingsLayer.createPropertiesOfDatastreamsHelper(123)).to.be.false;
            expect(sensorThingsLayer.createPropertiesOfDatastreamsHelper("string")).to.be.false;
            expect(sensorThingsLayer.createPropertiesOfDatastreamsHelper(true)).to.be.false;
            expect(sensorThingsLayer.createPropertiesOfDatastreamsHelper(false)).to.be.false;
            expect(sensorThingsLayer.createPropertiesOfDatastreamsHelper({})).to.be.false;
        });

        it("should return false if the second parameter is not an object", () => {
            expect(sensorThingsLayer.createPropertiesOfDatastreamsHelper([], undefined)).to.be.false;
            expect(sensorThingsLayer.createPropertiesOfDatastreamsHelper([], null)).to.be.false;
            expect(sensorThingsLayer.createPropertiesOfDatastreamsHelper([], 123)).to.be.false;
            expect(sensorThingsLayer.createPropertiesOfDatastreamsHelper([], "string")).to.be.false;
            expect(sensorThingsLayer.createPropertiesOfDatastreamsHelper([], true)).to.be.false;
            expect(sensorThingsLayer.createPropertiesOfDatastreamsHelper([], false)).to.be.false;
            expect(sensorThingsLayer.createPropertiesOfDatastreamsHelper([], [])).to.be.false;
        });

        it("should return true if the first parameter is an array, should not alter the second parameter", () => {
            const properties = {};

            expect(sensorThingsLayer.createPropertiesOfDatastreamsHelper([undefined, null, 123, "string", true, false, []], properties)).to.be.true;
            expect(properties).to.be.an("object").and.to.be.empty;
        });
    });

    describe("createPropertiesOfDatastreams", () => {
        it("should return an empty array if the first parameter is not an array", () => {
            expect(sensorThingsLayer.createPropertiesOfDatastreams(undefined)).to.be.an("array").and.to.be.empty;
            expect(sensorThingsLayer.createPropertiesOfDatastreams(null)).to.be.an("array").and.to.be.empty;
            expect(sensorThingsLayer.createPropertiesOfDatastreams(123)).to.be.an("array").and.to.be.empty;
            expect(sensorThingsLayer.createPropertiesOfDatastreams("string")).to.be.an("array").and.to.be.empty;
            expect(sensorThingsLayer.createPropertiesOfDatastreams(true)).to.be.an("array").and.to.be.empty;
            expect(sensorThingsLayer.createPropertiesOfDatastreams(false)).to.be.an("array").and.to.be.empty;
            expect(sensorThingsLayer.createPropertiesOfDatastreams({})).to.be.an("array").and.to.be.empty;
        });

        it("should return the first parameter untouched if its content are no objects", () => {
            const allThings = [undefined, null, 123, "string", true, false, []],
                expected = [undefined, null, 123, "string", true, false, []];

            expect(sensorThingsLayer.createPropertiesOfDatastreams(allThings)).to.deep.equal(expected);
        });

        it("should return the first parameter untouched if its content are objects but have no Datastreams array", () => {
            const allThings = [
                    {},
                    {Datastreams: undefined},
                    {Datastreams: null},
                    {Datastreams: 123},
                    {Datastreams: "string"},
                    {Datastreams: true},
                    {Datastreams: false},
                    {Datastreams: {}}
                ],
                expected = [
                    {},
                    {Datastreams: undefined},
                    {Datastreams: null},
                    {Datastreams: 123},
                    {Datastreams: "string"},
                    {Datastreams: true},
                    {Datastreams: false},
                    {Datastreams: {}}
                ];

            expect(sensorThingsLayer.createPropertiesOfDatastreams(allThings)).to.deep.equal(expected);
        });
    });

    describe("moveDatastreamPropertiesToThing", () => {
        it("should return false if the first parameter is not an object", () => {
            expect(sensorThingsLayer.moveDatastreamPropertiesToThing(undefined)).to.be.false;
            expect(sensorThingsLayer.moveDatastreamPropertiesToThing(null)).to.be.false;
            expect(sensorThingsLayer.moveDatastreamPropertiesToThing(123)).to.be.false;
            expect(sensorThingsLayer.moveDatastreamPropertiesToThing("string")).to.be.false;
            expect(sensorThingsLayer.moveDatastreamPropertiesToThing(true)).to.be.false;
            expect(sensorThingsLayer.moveDatastreamPropertiesToThing(false)).to.be.false;
            expect(sensorThingsLayer.moveDatastreamPropertiesToThing([])).to.be.false;
        });

        it("should return false if the second parameter is not an object", () => {
            expect(sensorThingsLayer.moveDatastreamPropertiesToThing({}, undefined)).to.be.false;
            expect(sensorThingsLayer.moveDatastreamPropertiesToThing({}, null)).to.be.false;
            expect(sensorThingsLayer.moveDatastreamPropertiesToThing({}, 123)).to.be.false;
            expect(sensorThingsLayer.moveDatastreamPropertiesToThing({}, "string")).to.be.false;
            expect(sensorThingsLayer.moveDatastreamPropertiesToThing({}, true)).to.be.false;
            expect(sensorThingsLayer.moveDatastreamPropertiesToThing({}, false)).to.be.false;
            expect(sensorThingsLayer.moveDatastreamPropertiesToThing({}, [])).to.be.false;
        });

        it("should create thingProperties equal to dataStreamProperties if thingProperties are an empty object", () => {
            const thingProperties = {},
                dataStreamProperties = {
                    foo: "bar",
                    foobar: "baz"
                },
                expected = {
                    foo: "bar",
                    foobar: "baz"
                };

            expect(sensorThingsLayer.moveDatastreamPropertiesToThing(thingProperties, dataStreamProperties)).to.be.true;
            expect(thingProperties).to.deep.equal(expected);
        });

        it("should alter thingProperties where keys equals dataStreamProperties keys and pipe the value", () => {
            const thingProperties = {
                    foo: "qux",
                    quux: "quuux"
                },
                dataStreamProperties = {
                    foo: "bar",
                    foobar: "baz"
                },
                expected = {
                    foo: "qux | bar",
                    quux: "quuux",
                    foobar: "baz"
                };

            expect(sensorThingsLayer.moveDatastreamPropertiesToThing(thingProperties, dataStreamProperties)).to.be.true;
            expect(thingProperties).to.deep.equal(expected);
        });
    });

    describe("createAssociationObject", () => {
        it("should return an empty object if anything but an array is given", () => {
            expect(sensorThingsLayer.createAssociationObject(undefined)).to.be.an("object").and.to.be.empty;
            expect(sensorThingsLayer.createAssociationObject(null)).to.be.an("object").and.to.be.empty;
            expect(sensorThingsLayer.createAssociationObject(123)).to.be.an("object").and.to.be.empty;
            expect(sensorThingsLayer.createAssociationObject("string")).to.be.an("object").and.to.be.empty;
            expect(sensorThingsLayer.createAssociationObject(true)).to.be.an("object").and.to.be.empty;
            expect(sensorThingsLayer.createAssociationObject(false)).to.be.an("object").and.to.be.empty;
            expect(sensorThingsLayer.createAssociationObject({})).to.be.an("object").and.to.be.empty;
        });

        it("should return an empty object for empty array as input", () => {
            expect(sensorThingsLayer.createAssociationObject([])).to.deep.equal({});
        });

        it("should return an object with values from input array as keys", () => {
            const array = [
                "Test",
                "Sensor",
                "Iot"
            ];

            expect(sensorThingsLayer.createAssociationObject(array)).to.deep.equal({
                Test: true,
                Sensor: true,
                Iot: true
            });
        });
    });

    describe("changeSensordataRootToThings", () => {
        it("should return an empty array if the first parameter is anything but an array", () => {
            expect(sensorThingsLayer.changeSensordataRootToThings(undefined)).to.be.an("array").and.to.be.empty;
            expect(sensorThingsLayer.changeSensordataRootToThings(null)).to.be.an("array").and.to.be.empty;
            expect(sensorThingsLayer.changeSensordataRootToThings(123)).to.be.an("array").and.to.be.empty;
            expect(sensorThingsLayer.changeSensordataRootToThings("string")).to.be.an("array").and.to.be.empty;
            expect(sensorThingsLayer.changeSensordataRootToThings(true)).to.be.an("array").and.to.be.empty;
            expect(sensorThingsLayer.changeSensordataRootToThings(false)).to.be.an("array").and.to.be.empty;
            expect(sensorThingsLayer.changeSensordataRootToThings({})).to.be.an("array").and.to.be.empty;
        });

        it("should return an empty array if the first parameter is an array without objects", () => {
            expect(sensorThingsLayer.changeSensordataRootToThings([undefined, null, 123, "string", true, false, []])).to.be.an("array").and.to.be.empty;
        });

        it("should return an empty array if the object entries of the first parameter have no Thing key", () => {
            expect(sensorThingsLayer.changeSensordataRootToThings([
                {Thing: undefined},
                {Thing: null},
                {Thing: 123},
                {Thing: "string"},
                {Thing: true},
                {Thing: false},
                {Thing: []}
            ])).to.be.an("array").that.is.empty;
        });

        it("should return the expected result", () => {
            const sensordata = [{keyA: 1, keyB: 2, Thing: {keyC: 3, keyD: 4}}],
                datastreamAttributes = ["keyA", "keyB"],
                thingAttributes = ["keyC", "keyD"],
                expected = [{Datastreams: [{keyA: 1, keyB: 2}], keyC: 3, keyD: 4}];

            expect(sensorThingsLayer.changeSensordataRootToThings(sensordata, datastreamAttributes, thingAttributes)).deep.equal(expected);
        });
    });

    describe("buildSensorThingsUrl", () => {
        it("should return an url as string for a specific input", () => {
            const testUrl = "https://www.example.com:1234/foo/bar",
                testVersion = "1.1",
                testUrlParams = {
                    "baz": 1234,
                    "qux": "foobar"
                },
                expectedOutput = "https://www.example.com:1234/foo/bar/v1.1/Things?$baz=1234&$qux=foobar";

            expect(sensorThingsLayer.buildSensorThingsUrl(testUrl, testVersion, testUrlParams)).to.equal(expectedOutput);
        });

        it("should return an url with datastreams as root", () => {
            const testUrl = "https://www.example.com:1234/foo/bar",
                testVersion = "1.1",
                testUrlParams = {
                    "filter": "fi",
                    "expand": "ex",
                    "root": "Datastreams"
                },
                expectedOutput = "https://www.example.com:1234/foo/bar/v1.1/Datastreams?$filter=fi&$expand=ex";

            expect(sensorThingsLayer.buildSensorThingsUrl(testUrl, testVersion, testUrlParams)).to.equal(expectedOutput);
        });

        it("should return an url as string for a specific input including nested urlParams", () => {
            const testUrl = "https://www.example.com:1234/foo/bar",
                testVersion = "1.1",
                testUrlParams = {
                    "baz": 1234,
                    "qux": [
                        "subParamA",
                        "subParamB",
                        "subParamC"
                    ]
                },
                expectedOutput = "https://www.example.com:1234/foo/bar/v1.1/Things?$baz=1234&$qux=subParamA,subParamB,subParamC";

            expect(sensorThingsLayer.buildSensorThingsUrl(testUrl, testVersion, testUrlParams)).to.equal(expectedOutput);
        });

        it("should return an url without query if no params as object are given", () => {
            const testUrl = "https://www.example.com:1234/foo/bar",
                testVersion = "1.1",
                expectedOutput = "https://www.example.com:1234/foo/bar/v1.1/Things?";

            expect(sensorThingsLayer.buildSensorThingsUrl(testUrl, testVersion, false)).to.equal(expectedOutput);
            expect(sensorThingsLayer.buildSensorThingsUrl(testUrl, testVersion, undefined)).to.equal(expectedOutput);
            expect(sensorThingsLayer.buildSensorThingsUrl(testUrl, testVersion, null)).to.equal(expectedOutput);
            expect(sensorThingsLayer.buildSensorThingsUrl(testUrl, testVersion, "baz")).to.equal(expectedOutput);
            expect(sensorThingsLayer.buildSensorThingsUrl(testUrl, testVersion, 12345)).to.equal(expectedOutput);
            expect(sensorThingsLayer.buildSensorThingsUrl(testUrl, testVersion, [])).to.equal(expectedOutput);
            expect(sensorThingsLayer.buildSensorThingsUrl(testUrl, testVersion, {})).to.equal(expectedOutput);
        });

        it("should eat any url possible without checking its target or syntax", () => {
            const testUrlParams = {
                "foo": "bar"
            };

            expect(sensorThingsLayer.buildSensorThingsUrl("", "1.1", testUrlParams)).to.equal("/v1.1/Things?$foo=bar");
            expect(sensorThingsLayer.buildSensorThingsUrl("http://", "1.1", testUrlParams)).to.equal("http:///v1.1/Things?$foo=bar");
            expect(sensorThingsLayer.buildSensorThingsUrl("wfs://baz", "1.1", testUrlParams)).to.equal("wfs://baz/v1.1/Things?$foo=bar");
            expect(sensorThingsLayer.buildSensorThingsUrl("foobar://baz////", "1.1", testUrlParams)).to.equal("foobar://baz/////v1.1/Things?$foo=bar");
        });

        it("should take any version as string unchecked", () => {
            expect(sensorThingsLayer.buildSensorThingsUrl("", "1.1", false)).to.equal("/v1.1/Things?");
            expect(sensorThingsLayer.buildSensorThingsUrl("", "foo", false)).to.equal("/vfoo/Things?");
            expect(sensorThingsLayer.buildSensorThingsUrl("", "foo.bar.baz", false)).to.equal("/vfoo.bar.baz/Things?");
        });

        it("should take any version as number fixed to one decimal number", () => {
            expect(sensorThingsLayer.buildSensorThingsUrl("", 0.5, false)).to.equal("/v0.5/Things?");
            expect(sensorThingsLayer.buildSensorThingsUrl("", 0.55, false)).to.equal("/v0.6/Things?");
            expect(sensorThingsLayer.buildSensorThingsUrl("", 0.00000001, false)).to.equal("/v0.0/Things?");
            expect(sensorThingsLayer.buildSensorThingsUrl("", 999999.9999999, false)).to.equal("/v1000000.0/Things?");
        });

        it("should stringify any given parameter for url and version - no matter what", () => {
            const testUrlParams = {
                "foo": "bar"
            };

            expect(sensorThingsLayer.buildSensorThingsUrl(undefined, undefined, testUrlParams)).to.equal("undefined/vundefined/Things?$foo=bar");
            expect(sensorThingsLayer.buildSensorThingsUrl(null, null, testUrlParams)).to.equal("null/vnull/Things?$foo=bar");
            expect(sensorThingsLayer.buildSensorThingsUrl([], [], testUrlParams)).to.equal("/v/Things?$foo=bar");
            expect(sensorThingsLayer.buildSensorThingsUrl({}, {}, testUrlParams)).to.equal("[object Object]/v[object Object]/Things?$foo=bar");
        });
    });

    describe("getLocalTimeFormat", () => {
        it("should return an empty for undefined input", () => {
            expect(sensorThingsLayer.getLocalTimeFormat(undefined, undefined)).to.be.a("string").and.to.be.empty;
        });

        it("should return an empty  string for undefined phenomenontime and utc +1", () => {
            expect(sensorThingsLayer.getLocalTimeFormat(undefined, "Europe/Berlin")).to.be.a("string").and.to.be.empty;
        });

        it("should return a string in summertime", () => {
            const summerTime = "2018-06-05T12:11:47.922Z";

            expect(sensorThingsLayer.getLocalTimeFormat(summerTime, "Europe/Berlin")).to.equal("5. Juni 2018 14:11");
        });

        it("should return a string in wintertime", () => {
            const winterTime = "2018-01-01T12:11:47.922Z";

            expect(sensorThingsLayer.getLocalTimeFormat(winterTime, "Europe/Berlin")).to.equal("1. Januar 2018 13:11");
        });
    });

    describe("getFirstPhenomenonTime", () => {
        it("should return undefined if anything but a string is given", () => {
            expect(sensorThingsLayer.getFirstPhenomenonTime(undefined)).to.be.undefined;
            expect(sensorThingsLayer.getFirstPhenomenonTime(null)).to.be.undefined;
            expect(sensorThingsLayer.getFirstPhenomenonTime(123)).to.be.undefined;
            expect(sensorThingsLayer.getFirstPhenomenonTime(true)).to.be.undefined;
            expect(sensorThingsLayer.getFirstPhenomenonTime(false)).to.be.undefined;
            expect(sensorThingsLayer.getFirstPhenomenonTime([])).to.be.undefined;
            expect(sensorThingsLayer.getFirstPhenomenonTime({})).to.be.undefined;
        });

        it("should return the input as it is if a single phenomenon time is recognized", () => {
            expect(sensorThingsLayer.getFirstPhenomenonTime("2020-04-02T14:00:01.100Z")).to.equal("2020-04-02T14:00:01.100Z");
        });

        it("should return first time if phenomenon time interval is given", () => {
            expect(sensorThingsLayer.getFirstPhenomenonTime("2020-04-02T14:00:01.100Z/2020-04-02T14:15:00.000Z")).to.equal("2020-04-02T14:00:01.100Z");
        });
    });

    describe("aggregateDataStreamPhenomenonTime", () => {
        it("should return undefined for undefined input", () => {
            expect(sensorThingsLayer.aggregateDataStreamPhenomenonTime(undefined)).to.be.undefined;
        });

        it("should return feature as is", () => {
            const feature = new Feature({
                geometry: new Point([100, 100])
            });

            expect(sensorThingsLayer.aggregateDataStreamPhenomenonTime(feature)).to.be.instanceof(Feature);
        });

        it("should return feature with dataStreamPhenomenonTime for one dataStream", () => {
            const feature = new Feature({
                dataStreamId: "123",
                dataStreamName: "ds",
                dataStream_123_ds_phenomenonTime: "a",
                geometry: new Point([100, 100])
            });

            expect(sensorThingsLayer.aggregateDataStreamPhenomenonTime(feature)).to.be.instanceof(Feature);
            expect(sensorThingsLayer.aggregateDataStreamPhenomenonTime(feature).get("dataStreamPhenomenonTime")).to.equal("a");
        });

        it("should return feature with dataStreamPhenomenonTime for more dataStreams", () => {
            const feature = new Feature({
                dataStreamId: "123 | 456",
                dataStreamName: "ds1 | ds2",
                dataStream_123_ds1_phenomenonTime: "a",
                dataStream_456_ds2_phenomenonTime: "b",
                geometry: new Point([100, 100])
            });

            expect(sensorThingsLayer.aggregateDataStreamPhenomenonTime(feature)).to.be.instanceof(Feature);
            expect(sensorThingsLayer.aggregateDataStreamPhenomenonTime(feature).get("dataStreamPhenomenonTime")).to.equal("a | b");
        });
    });

    describe("aggregateDataStreamValue", () => {
        it("should return undefined for undefined input", () => {
            expect(sensorThingsLayer.aggregateDataStreamValue(undefined)).to.be.undefined;
        });

        it("should return feature as is", () => {
            const feature = new Feature({
                geometry: new Point([100, 100])
            });

            expect(sensorThingsLayer.aggregateDataStreamValue(feature)).to.be.instanceof(Feature);
        });

        it("should return feature with dataStreamValue for one dataStream", () => {
            const feature = new Feature({
                dataStreamId: "123",
                dataStreamName: "ds",
                dataStream_123_ds: "a",
                geometry: new Point([100, 100])
            });

            expect(sensorThingsLayer.aggregateDataStreamValue(feature)).to.be.instanceof(Feature);
            expect(sensorThingsLayer.aggregateDataStreamValue(feature).get("dataStreamValue")).to.equal("a");
        });

        it("should return feature with dataStreamValue for more dataStreams", () => {
            const feature = new Feature({
                dataStreamId: "123 | 456",
                dataStreamName: "ds1 | ds2",
                dataStream_123_ds1: "a",
                dataStream_456_ds2: "b",
                geometry: new Point([100, 100])
            });

            expect(sensorThingsLayer.aggregateDataStreamValue(feature)).to.be.instanceof(Feature);
            expect(sensorThingsLayer.aggregateDataStreamValue(feature).get("dataStreamValue")).to.equal("a | b");
        });
    });

    describe("aggregatePropertiesOfOneThing", () => {
        it("should return false if the first parameter is not an object", () => {
            expect(sensorThingsLayer.aggregatePropertiesOfOneThing(undefined)).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfOneThing(null)).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfOneThing(123)).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfOneThing("string")).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfOneThing(true)).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfOneThing(false)).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfOneThing([])).to.be.false;
        });

        it("should return false if the second parameter is not an object", () => {
            expect(sensorThingsLayer.aggregatePropertiesOfOneThing({}, undefined)).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfOneThing({}, null)).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfOneThing({}, 123)).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfOneThing({}, "string")).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfOneThing({}, true)).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfOneThing({}, false)).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfOneThing({}, [])).to.be.false;
        });

        it("should aggregate the properties of the given thing", () => {
            const thing = {
                    "@iot.id": 1024,
                    name: "foo",
                    description: "bar",
                    Datastreams: [
                        {
                            "@iot.id": 10492,
                            "@iot.selfLink": "https://sensorUrlTest",
                            "Observations": [
                                {
                                    "@iot.id": 123,
                                    "result": "testResult",
                                    "phenomenonTime": "2021-01-22T05:11:31.222Z"
                                }
                            ],
                            "description": "Lalala",
                            "name": "abc"
                        }
                    ],
                    Locations: [
                        {
                            location: {
                                geometry: {
                                    type: "Point",
                                    test: "Test"
                                }
                            }
                        }
                    ]
                },
                result = {},
                expected = {
                    location: {type: "Point", test: "Test"},
                    properties: {
                        name: "foo",
                        description: "bar",
                        "@iot.id": 1024,
                        Datastreams: [
                            {
                                "@iot.id": 10492,
                                "@iot.selfLink": "https://sensorUrlTest",
                                "Observations": [
                                    {
                                        "@iot.id": 123,
                                        "result": "testResult",
                                        "phenomenonTime": "2021-01-22T05:11:31.222Z"
                                    }
                                ],
                                "description": "Lalala",
                                "name": "abc"
                            }
                        ]
                    }
                };

            sensorThingsLayer.aggregatePropertiesOfOneThing(thing, result);
            expect(result).to.deep.equal(expected);
        });
    });

    describe("aggregatePropertiesOfThingAsArray", () => {
        it("should return false if the given array of things is not an array", () => {
            expect(sensorThingsLayer.aggregatePropertiesOfThingAsArray(undefined)).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfThingAsArray(null)).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfThingAsArray(123)).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfThingAsArray("string")).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfThingAsArray(true)).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfThingAsArray(false)).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfThingAsArray({})).to.be.false;
        });

        it("should return false if the given result is not an object", () => {
            expect(sensorThingsLayer.aggregatePropertiesOfThingAsArray([], undefined)).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfThingAsArray([], null)).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfThingAsArray([], 123)).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfThingAsArray([], "string")).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfThingAsArray([], true)).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfThingAsArray([], false)).to.be.false;
            expect(sensorThingsLayer.aggregatePropertiesOfThingAsArray([], [])).to.be.false;
        });

        it("should aggregate the properties of the given array of things", () => {
            const things = [
                    {
                        "@iot.id": 1024,
                        name: "foo1",
                        description: "bar1",
                        properties: {
                            foo: "bar"
                        },
                        Datastreams: [
                            {
                                "@iot.id": 10492,
                                "@iot.selfLink": "https://sensorUrlTest",
                                "Observations": [
                                    {
                                        "@iot.id": 123,
                                        "result": "testResult",
                                        "phenomenonTime": "2021-01-22T05:11:31.222Z"
                                    }
                                ],
                                "description": "Lalala",
                                "name": "abc"
                            }
                        ],
                        Locations: [
                            {
                                location: {
                                    geometry: {
                                        type: "Point",
                                        test: "Test"
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "@iot.id": 1025,
                        name: "foo2",
                        description: "bar2",
                        properties: {
                            foo: "baz"
                        },
                        Datastreams: [
                            {
                                "@iot.id": 10493,
                                "@iot.selfLink": "https://sensorUrlTest",
                                "Observations": [
                                    {
                                        "@iot.id": 124,
                                        "result": "testResult",
                                        "phenomenonTime": "2021-01-22T05:11:31.222Z"
                                    }
                                ],
                                "description": "Lalala",
                                "name": "abc"
                            }
                        ],
                        Locations: [
                            {
                                location: {
                                    geometry: {
                                        type: "Point",
                                        test: "Test"
                                    }
                                }
                            }
                        ]
                    }
                ],
                result = {},
                expected = {
                    location: {type: "Point", test: "Test"},
                    properties: {
                        "@iot.id": "1024 | 1025",
                        foo: "bar | baz",
                        Datastreams: [
                            {
                                "@iot.id": 10492,
                                "@iot.selfLink": "https://sensorUrlTest",
                                Observations: [
                                    {
                                        "@iot.id": 123,
                                        "phenomenonTime": "2021-01-22T05:11:31.222Z",
                                        "result": "testResult"
                                    }
                                ],
                                "description": "Lalala",
                                "name": "abc"
                            },
                            {
                                "@iot.id": 10493,
                                "@iot.selfLink": "https://sensorUrlTest",
                                Observations: [
                                    {
                                        "@iot.id": 124,
                                        "phenomenonTime": "2021-01-22T05:11:31.222Z",
                                        "result": "testResult"
                                    }
                                ],
                                description: "Lalala",
                                name: "abc"
                            }
                        ],
                        description: "bar1 | bar2",
                        name: "foo1 | foo2"
                    }
                };

            sensorThingsLayer.aggregatePropertiesOfThingAsArray(things, result);
            expect(result).to.deep.equal(expected);
        });
    });

    describe("flattenArray", () => {
        it("should return the given input if it is not an array", () => {
            expect(sensorThingsLayer.flattenArray(undefined)).to.be.undefined;
            expect(sensorThingsLayer.flattenArray(null)).to.be.null;
            expect(sensorThingsLayer.flattenArray(123)).to.equal(123);
            expect(sensorThingsLayer.flattenArray("string")).to.equal("string");
            expect(sensorThingsLayer.flattenArray(true)).to.be.true;
            expect(sensorThingsLayer.flattenArray(false)).to.be.false;
            expect(sensorThingsLayer.flattenArray({id: "123"})).to.deep.equal({id: "123"});
        });

        it("should return flattened array for two dimentional arrays", () => {
            expect(sensorThingsLayer.flattenArray([["1", "2"], ["3"], ["4"]])).to.deep.equal(["1", "2", "3", "4"]);
        });

        it("should return empty array on empty array input", () => {
            expect(sensorThingsLayer.flattenArray([])).to.deep.equal([]);
        });

        it("should return a flattened array for a given complex structure", () => {
            expect(sensorThingsLayer.flattenArray([undefined, ["1", "2"], [null], ["3"], 123, "string", true, false])).to.deep.equal([undefined, "1", "2", null, "3", 123, "string", true, false]);
        });
    });

    describe("getStateOfSTALayer", () => {
        it("should return true if certain params are given", () => {
            expect(sensorThingsLayer.getStateOfSTALayer(true, false)).to.be.true;
        });

        it("should return false if certain params are given", () => {
            expect(sensorThingsLayer.getStateOfSTALayer(false, true)).to.be.false;
        });

        it("should return undefined if certain params are given", () => {
            expect(sensorThingsLayer.getStateOfSTALayer(true, true)).to.be.undefined;
            expect(sensorThingsLayer.getStateOfSTALayer(false, false)).to.be.undefined;
        });
    });

    describe("subscribeToSensorThings", () => {
        it("should return false if datastreamIds is not an array", () => {
            expect(sensorThingsLayer.subscribeToSensorThings(undefined)).to.be.false;
            expect(sensorThingsLayer.subscribeToSensorThings(null)).to.be.false;
            expect(sensorThingsLayer.subscribeToSensorThings(123)).to.be.false;
            expect(sensorThingsLayer.subscribeToSensorThings("string")).to.be.false;
            expect(sensorThingsLayer.subscribeToSensorThings(true)).to.be.false;
            expect(sensorThingsLayer.subscribeToSensorThings(false)).to.be.false;
            expect(sensorThingsLayer.subscribeToSensorThings({})).to.be.false;
        });

        it("should return false if subscriptionTopics is not an object", () => {
            expect(sensorThingsLayer.subscribeToSensorThings([], undefined)).to.be.false;
            expect(sensorThingsLayer.subscribeToSensorThings([], null)).to.be.false;
            expect(sensorThingsLayer.subscribeToSensorThings([], 123)).to.be.false;
            expect(sensorThingsLayer.subscribeToSensorThings([], "string")).to.be.false;
            expect(sensorThingsLayer.subscribeToSensorThings([], true)).to.be.false;
            expect(sensorThingsLayer.subscribeToSensorThings([], false)).to.be.false;
            expect(sensorThingsLayer.subscribeToSensorThings([], [])).to.be.false;
        });

        it("should return false if mqttClient is not an object", () => {
            expect(sensorThingsLayer.subscribeToSensorThings([], {}, "version", undefined)).to.be.false;
            expect(sensorThingsLayer.subscribeToSensorThings([], {}, "version", null)).to.be.false;
            expect(sensorThingsLayer.subscribeToSensorThings([], {}, "version", 123)).to.be.false;
            expect(sensorThingsLayer.subscribeToSensorThings([], {}, "version", "string")).to.be.false;
            expect(sensorThingsLayer.subscribeToSensorThings([], {}, "version", true)).to.be.false;
            expect(sensorThingsLayer.subscribeToSensorThings([], {}, "version", false)).to.be.false;
            expect(sensorThingsLayer.subscribeToSensorThings([], {}, "version", [])).to.be.false;
        });

        it("should return true, subscribe with expected topics and set subscription topics to true", () => {
            const topicLogger = [],
                datastreamIds = [1, 2, 3, 4],
                subscriptionTopics = {"1": true, "2": false, "4": false},
                mqttClient = {
                    subscribe: topic => {
                        topicLogger.push(topic);
                    }
                };

            expect(sensorThingsLayer.subscribeToSensorThings(datastreamIds, subscriptionTopics, "1.0", mqttClient)).to.be.true;
            expect(topicLogger).to.deep.equal([
                "v1.0/Datastreams(2)/Observations",
                "v1.0/Datastreams(3)/Observations",
                "v1.0/Datastreams(4)/Observations"
            ]);
            expect(subscriptionTopics).to.deep.equal({"1": true, "2": true, "4": true, "3": true});
        });

        it("should pass through the mqttSubscribeOptions to the mqtt subscribe function", () => {
            const optionsLogger = [],
                datastreamIds = [1, 2, 3],
                subscriptionTopics = {"1": true, "2": false, "3": false},
                mqttClient = {
                    subscribe: (topic, options) => {
                        optionsLogger.push(options);
                    }
                },
                mqttSubscribeOptions = {
                    foo: "bar"
                };

            expect(sensorThingsLayer.subscribeToSensorThings(datastreamIds, subscriptionTopics, "1.0", mqttClient, mqttSubscribeOptions)).to.be.true;
            expect(optionsLogger).to.deep.equal([{foo: "bar"}, {foo: "bar"}]);
        });
    });

    describe("unsubscribeFromSensorThings", () => {
        it("should return false if datastreamIds is not an array", () => {
            expect(sensorThingsLayer.unsubscribeFromSensorThings(undefined)).to.be.false;
            expect(sensorThingsLayer.unsubscribeFromSensorThings(null)).to.be.false;
            expect(sensorThingsLayer.unsubscribeFromSensorThings(123)).to.be.false;
            expect(sensorThingsLayer.unsubscribeFromSensorThings("string")).to.be.false;
            expect(sensorThingsLayer.unsubscribeFromSensorThings(true)).to.be.false;
            expect(sensorThingsLayer.unsubscribeFromSensorThings(false)).to.be.false;
            expect(sensorThingsLayer.unsubscribeFromSensorThings({})).to.be.false;
        });

        it("should return false if subscriptionTopics is not an object", () => {
            expect(sensorThingsLayer.unsubscribeFromSensorThings([], undefined)).to.be.false;
            expect(sensorThingsLayer.unsubscribeFromSensorThings([], null)).to.be.false;
            expect(sensorThingsLayer.unsubscribeFromSensorThings([], 123)).to.be.false;
            expect(sensorThingsLayer.unsubscribeFromSensorThings([], "string")).to.be.false;
            expect(sensorThingsLayer.unsubscribeFromSensorThings([], true)).to.be.false;
            expect(sensorThingsLayer.unsubscribeFromSensorThings([], false)).to.be.false;
            expect(sensorThingsLayer.unsubscribeFromSensorThings([], [])).to.be.false;
        });

        it("should return false if mqttClient is not an object", () => {
            expect(sensorThingsLayer.unsubscribeFromSensorThings([], {}, "version", "isSelected", undefined)).to.be.false;
            expect(sensorThingsLayer.unsubscribeFromSensorThings([], {}, "version", "isSelected", null)).to.be.false;
            expect(sensorThingsLayer.unsubscribeFromSensorThings([], {}, "version", "isSelected", 123)).to.be.false;
            expect(sensorThingsLayer.unsubscribeFromSensorThings([], {}, "version", "isSelected", "string")).to.be.false;
            expect(sensorThingsLayer.unsubscribeFromSensorThings([], {}, "version", "isSelected", true)).to.be.false;
            expect(sensorThingsLayer.unsubscribeFromSensorThings([], {}, "version", "isSelected", false)).to.be.false;
            expect(sensorThingsLayer.unsubscribeFromSensorThings([], {}, "version", "isSelected", [])).to.be.false;
        });

        it("should return true, unsubscribe with expected topics and set subscription topics to false", () => {
            const topicLogger = [],
                datastreamIds = [3],
                subscriptionTopics = {"1": true, "2": true, "4": true},
                mqttClient = {
                    unsubscribe: topic => {
                        topicLogger.push(topic);
                    }
                };

            expect(sensorThingsLayer.unsubscribeFromSensorThings(datastreamIds, subscriptionTopics, "1.0", mqttClient)).to.be.true;
            expect(topicLogger).to.deep.equal([
                "v1.0/Datastreams(1)/Observations",
                "v1.0/Datastreams(2)/Observations",
                "v1.0/Datastreams(4)/Observations"
            ]);
            expect(subscriptionTopics).to.deep.equal({"1": false, "2": false, "4": false});
        });

        it("should return true, unsubscribe with expected topics and set subscription topics to false with advanced input", () => {
            const topicLogger = [],
                datastreamIds = [1, 2, 3, 5],
                subscriptionTopics = {"1": true, "2": false, "4": true},
                mqttClient = {
                    unsubscribe: topic => {
                        topicLogger.push(topic);
                    }
                };

            expect(sensorThingsLayer.unsubscribeFromSensorThings(datastreamIds, subscriptionTopics, "1.0", mqttClient)).to.be.true;
            expect(topicLogger).to.deep.equal([
                "v1.0/Datastreams(4)/Observations"
            ]);
            expect(subscriptionTopics).to.deep.equal({"1": true, "2": false, "4": false});
        });
    });

    describe("createFeaturesFromSensorData", () => {
        it("should return an empty array for any input that is not an array", () => {
            expect(sensorThingsLayer.createFeaturesFromSensorData(undefined)).to.be.an("array").that.is.empty;
            expect(sensorThingsLayer.createFeaturesFromSensorData(null)).to.be.an("array").that.is.empty;
            expect(sensorThingsLayer.createFeaturesFromSensorData(123)).to.be.an("array").that.is.empty;
            expect(sensorThingsLayer.createFeaturesFromSensorData("string")).to.be.an("array").that.is.empty;
            expect(sensorThingsLayer.createFeaturesFromSensorData(true)).to.be.an("array").that.is.empty;
            expect(sensorThingsLayer.createFeaturesFromSensorData(false)).to.be.an("array").that.is.empty;
            expect(sensorThingsLayer.createFeaturesFromSensorData({})).to.be.an("array").that.is.empty;
        });
        it("should return an empty array for empty array input", () => {
            expect(sensorThingsLayer.createFeaturesFromSensorData([])).to.be.an("array").that.is.empty;
        });
        it("should return an empty array for obj and undefined epsg input", () => {
            const data = [{location: [10, 10]}];

            expect(sensorThingsLayer.createFeaturesFromSensorData(data, "mapProjection", undefined, "gfiTheme", "utc")).to.be.an("array").that.is.empty;
        });
    });
});
