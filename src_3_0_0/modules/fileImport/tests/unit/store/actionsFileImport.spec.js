import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import testAction from "../../../../../../test/unittests/VueTestUtils";
import {treeSubjectsKey} from "../../../../../shared/js/utils/constants";
import actions from "../../../store/actionsFileImport";
import importedState from "../../../store/stateFileImport";
import rawSources from "../../resources/rawSources.js";
import crs from "@masterportal/masterportalapi/src/crs";
import {reset as resetUniqueId} from "../../../../../shared/js/utils/uniqueId.js";
import sinon from "sinon";
import {expect} from "chai";

const
    {addLayerConfig, importKML, setFeatureExtents} = actions,
    namedProjections = [
        ["EPSG:31467", "+title=Bessel/Gauß-Krüger 3 +proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=bessel +datum=potsdam +units=m +no_defs"],
        ["EPSG:25832", "+title=ETRS89/UTM 32N +proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"],
        ["EPSG:8395", "+title=ETRS89/Gauß-Krüger 3 +proj=tmerc +lat_0=0 +lon_0=9 +k=1 +x_0=3500000 +y_0=0 +ellps=GRS80 +datum=GRS80 +units=m +no_defs"],
        ["EPSG:4326", "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"]
    ],
    rootGetters = {
        "Maps/projectionCode": "EPSG:25832"
    },
    layer = new VectorLayer({
        name: "name",
        source: new VectorSource(),
        alwaysOnTop: true
    });
let dispatch;

before(() => {
    crs.registerProjections(namedProjections);

    i18next.init({
        lng: "cimode",
        debug: false
    });
});

describe("src_3_0_0/modules/fileImport/store/actionsFileImport.js", () => {
    beforeEach(() => {
        mapCollection.clear();
        resetUniqueId();
        dispatch = sinon.spy();
        layer.getSource().getFeatures().forEach(feature => layer.getSource().removeFeature(feature));
    });

    afterEach(sinon.restore);

    describe("file import - file should add some features to the current draw layer", () => {
        it("preset \"auto\", correct kml file, correct filename", done => {
            const payload = {
                raw: rawSources[0],
                layer: {
                    getSource: () => {
                        return {
                            addFeatures: () => sinon.stub()
                        };
                    }
                },
                filename: "TestFile1.kml"};

            testAction(importKML, payload, importedState, {}, [
                {
                    type: "Alerting/addSingleAlert",
                    payload: {
                        category: "success",
                        content: i18next.t("common:modules.tools.fileImport.alertingMessages.success", {filename: payload.filename})},
                    dispatch: true
                }
            ], {}, done, {"Maps/projectionCode": "EPSG:25832"});
        });

        it("preset \"auto\", correct kml file, wrong filename", done => {
            const payload = {raw: rawSources[0], filename: "bogus_file.bog"};

            testAction(importKML, payload, importedState, {}, [{
                type: "Alerting/addSingleAlert",
                payload: {
                    category: "error",
                    content: i18next.t("common:modules.tools.fileImport.alertingMessages.missingFormat")
                },
                dispatch: true
            }], {}, done);
        });

        it("preset \"auto\", broken kml file, correct filename", done => {
            const payload = {raw: rawSources[1], filename: "TestFile1.kml"};

            testAction(importKML, payload, importedState, {}, [{
                type: "Alerting/addSingleAlert",
                payload: {
                    category: "error",
                    content: i18next.t("common:modules.tools.fileImport.alertingMessages.missingFileContent")
                },
                dispatch: true
            }], {}, done);
        });

        it("preset \"auto\", empty kml file, correct filename", done => {
            const payload = {raw: "", filename: "TestFile1.kml"};

            testAction(importKML, payload, importedState, {}, [{
                type: "Alerting/addSingleAlert",
                payload: {
                    category: "error",
                    content: i18next.t("common:modules.tools.fileImport.alertingMessages.missingFileContent")
                },
                dispatch: true
            }], {}, done);
        });

        it("preset \"auto\", correct gpx file, correct filename", done => {
            const payload = {
                raw: rawSources[2],
                layer: {
                    getSource: () => {
                        return {
                            addFeatures: () => sinon.stub()
                        };
                    }
                },
                filename: "TestFile1.gpx"
            };

            testAction(importKML, payload, importedState, {}, [
                {
                    type: "Alerting/addSingleAlert",
                    payload: {
                        category: "success",
                        content: i18next.t("common:modules.tools.fileImport.alertingMessages.success", {filename: payload.filename})},
                    dispatch: true
                }
            ], {}, done, {"Maps/projectionCode": "EPSG:25832"});
        });

        it("preset \"auto\", correct geojson file, correct filename", done => {
            const payload = {
                raw: rawSources[3],
                layer: {
                    getSource: () => {
                        return {
                            addFeatures: () => sinon.stub()
                        };
                    }
                },
                filename: "TestFile1.json"
            };

            testAction(importKML, payload, importedState, {}, [
                {
                    type: "Alerting/addSingleAlert",
                    payload: {
                        category: "success",
                        content: i18next.t("common:modules.tools.fileImport.alertingMessages.success", {filename: payload.filename})},
                    dispatch: true
                }
            ], {}, done, {"Maps/projectionCode": "EPSG:25832"});
        });

        it("preset \"gpx\", correct kml file, correct filename", done => {
            const
                payload = {raw: rawSources[3], filename: "TestFile1.json"},
                tmpState = {...importedState, ...{selectedFiletype: "gpx"}};

            testAction(importKML, payload, tmpState, {}, [{
                type: "Alerting/addSingleAlert",
                payload: {
                    category: "error",
                    content: i18next.t("common:modules.tools.fileImport.alertingMessages.missingFileContent")},
                dispatch: true
            }], {}, done);
        });

        it("adds a text style from the kml file", () => {
            const payload = {layer: layer, raw: "<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.opengis.net/kml/2.2 https://developers.google.com/kml/schema/kml22gx.xsd\"><Placemark><name>Beispieltext</name><Style><LabelStyle><color>ffb87e37</color><scale xmlns=\"\">2</scale></LabelStyle><IconStyle xmlns=\"\"><scale>0</scale><Icon><href>https://localhost:9001/img/tools/draw/circle_blue.svg</href></Icon></IconStyle></Style><ExtendedData><Data name=\"drawState\"/><Data name=\"fromDrawTool\"><value>true</value></Data><Data name=\"invisibleStyle\"/><Data name=\"isOuterCircle\"><value>false</value></Data><Data name=\"isVisible\"><value>true</value></Data><Data name=\"styleId\"><value>1</value></Data></ExtendedData><Point><coordinates>10.003468073834911,53.56393658023316</coordinates></Point></Placemark></kml>", filename: "beispielText.kml"},
                state = {
                    selectedFiletype: "auto",
                    supportedFiletypes: {
                        auto: {
                            caption: "common:modules.tools.fileImport.captions.supportedFiletypes.auto"
                        },
                        kml: {
                            caption: "common:modules.tools.fileImport.captions.supportedFiletypes.kml",
                            rgx: /\.kml$/i
                        }
                    }
                };

            importKML({state, dispatch, rootGetters}, payload);
            expect(dispatch.firstCall.args[0]).to.equal("Alerting/addSingleAlert");
            expect(dispatch.firstCall.args[1]).to.eql({
                category: "success",
                content: "modules.tools.fileImport.alertingMessages.success"
            });
            expect(dispatch.secondCall.args[0]).to.equal("addImportedFilename");
            expect(dispatch.secondCall.args[1]).to.equal("beispielText.kml");
            expect(layer.getSource().getFeatures().length).to.equal(1);
            expect(layer.getSource().getFeatures()[0].getStyle().getText().getText()).to.equal("Beispieltext");
        });

        it("Sets empty feature extent", done => {
            const payload = {features: [], fileName: "file1"},
                tmpState = {...importedState};

            testAction(setFeatureExtents, payload, tmpState, {}, [{
                type: "setFeatureExtents",
                payload: {file1: [Infinity, Infinity, -Infinity, -Infinity]}
            }], {}, done);
        });

        it("Sets feature extent", done => {
            const payload = {features: [{
                    getGeometry: () => sinon.spy({
                        getExtent: () => [10, 10, 10, 10]
                    })
                }], fileName: "file2"},
                tmpState = {...importedState, ...{featureExtents: {"file1": [100, 100, 100, 100]}}};

            testAction(setFeatureExtents, payload, tmpState, {}, [{
                type: "setFeatureExtents",
                payload: {"file1": [100, 100, 100, 100], "file2": [10, 10, 10, 10]}
            }], {}, done);
        });
    });

    describe("addLayerConfig", () => {
        it("add layer config", done => {
            const state = {
                layerId: "importDrawLayer"
            };

            testAction(addLayerConfig, null, state, {}, [
                {
                    type: "addLayerToLayerConfig",
                    payload: {
                        layerConfig: {
                            id: state.layerId,
                            name: "importDrawLayer",
                            showInLayerTree: true,
                            typ: "VECTORBASE",
                            type: "layer",
                            visibility: true
                        },
                        parentKey: treeSubjectsKey
                    },
                    dispatch: true
                }
            ], {}, done);
        });
    });
});
