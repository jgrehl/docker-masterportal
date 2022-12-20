import testAction from "../../../../../../test/unittests/VueTestUtils";
import actions from "../../../store/actionsLayerInformation";

const {startLayerInformation, additionalSingleLayerInfo, setMetadataURL} = actions;

describe("src_3_0_0/modules/layerInformation/store/actionsLayerInformation.js", () => {
    describe("initialize the store", () => {
        it("should initialize the LayerInformation", done => {
            const state = {
                    layerConf: {},
                    menuSide: "mainMenu",
                    type: "layerInformation",
                    active: false
                },
                layerConf = {
                    id: "123",
                    metaID: "layerMetaId",
                    layername: "name",
                    url: "google.de",
                    urlIsVisible: true,
                    datasets: [
                        {
                            md_id: "123"
                        }
                    ]
                };

            testAction(startLayerInformation, layerConf, state, {}, [
                {type: "setLayerInfo", payload: layerConf},
                {type: "setMetadataURL", payload: layerConf.datasets[0].md_id, dispatch: true},
                {type: "additionalSingleLayerInfo", payload: undefined, dispatch: true},
                {type: "Menu/resetMenu", payload: {side: "mainMenu", module: {type: "LayerInformation"}}, dispatch: true},
                {type: "Menu/activateMenuNavigation", payload: {side: "mainMenu", module: {type: "LayerInformation"}}, dispatch: true},
                {type: "setActive", payload: true}
            ], {}, done);
        });

        it("should hide the LayerInformation in menu", done => {
            const state = {
                    layerConf: {},
                    menuSide: "mainMenu",
                    type: "layerInformation",
                    active: true
                },
                layerConf = {
                    id: "123",
                    metaID: "layerMetaId",
                    layername: "name",
                    url: "google.de",
                    urlIsVisible: true,
                    datasets: [
                        {
                            md_id: "123"
                        }
                    ]
                };

            testAction(startLayerInformation, layerConf, state, {}, [
                {type: "setLayerInfo", payload: layerConf},
                {type: "setMetadataURL", payload: layerConf.datasets[0].md_id, dispatch: true},
                {type: "additionalSingleLayerInfo", payload: undefined, dispatch: true},
                {type: "Menu/resetMenu", payload: {side: "mainMenu", module: {type: "LayerInformation"}}, dispatch: true},
                {type: "setActive", payload: false}
            ], {}, done);
        });

        it("should initialize the other abstract layer infos", done => {
            const state = {
                layerInfo: {
                    cswUrl: "https://metaver.de/csw",
                    metaID: "73A344E9-CDB5-4A17-89C1-05E202989755"
                }
            };

            // action, payload, state, rootState, expectedMutationsAndActions, getters = {}, done
            testAction(additionalSingleLayerInfo, null, state, {}, [
                {type: "getAbstractInfo", payload: {metaId: state.layerInfo.metaID, cswUrl: state.layerInfo.cswUrl}, dispatch: true}
            ], {}, done);

        });

        it("should set the Meta Data URLs", done => {
            const metaId = "73A344E9-CDB5-4A17-89C1-05E202989755",
                state = {
                    layerInfo: {
                        "id": "123",
                        "metaID": "layerMetaId",
                        "layername": "name",
                        "url": "google.de",
                        "urlIsVisible": true
                    },
                    metaDataCatalogueId: "2"
                },
                metaURLs = ["https://metaver.de/trefferanzeige?cmd=doShowDocument&docuuid=73A344E9-CDB5-4A17-89C1-05E202989755"];

            testAction(setMetadataURL, metaId, state, {}, [
                {type: "setMetaURLs", payload: metaURLs}
            ], {}, done, {
                restServiceById: id => id === "2" ? {url: "https://metaver.de/trefferanzeige?cmd=doShowDocument&docuuid="} : {}
            });

        });

        it("should use showDocUrl if set", done => {
            const state = {
                layerInfo: {
                    "id": "123",
                    "metaID": "73A344E9-CDB5-4A17-89C1-05E202989755",
                    "layername": "name",
                    "url": "google.de",
                    "urlIsVisible": true,
                    "cswUrl": "https://metaver.de/csw",
                    "showDocUrl": "https://metaver.de/trefferanzeige?cmd=doShowDocument&docuuid="
                },
                metaDataCatalogueId: "2"
            };

            testAction(setMetadataURL, "73A344E9-CDB5-4A17-89C1-05E202989755", state, {}, [
                {type: "setMetaURLs", payload: ["https://metaver.de/trefferanzeige?cmd=doShowDocument&docuuid=73A344E9-CDB5-4A17-89C1-05E202989755"]}
            ], {}, done, {
                restServiceById: id => id === "2" ? {url: "https://metaver.de/trefferanzeige?cmd=doShowDocument&docuuid="} : {}
            });

        });

        it("should use the url from metaDataCatalogueId if showDocUrl is not set", done => {
            const state = {
                    layerInfo: {
                        "id": "123",
                        "metaID": "73A344E9-CDB5-4A17-89C1-05E202989755",
                        "layername": "name",
                        "url": "google.de",
                        "urlIsVisible": true,
                        "cswUrl": "https://metaver.de/csw"
                    },
                    metaDataCatalogueId: "2"
                },
                metaURLs = ["https://metaver.de/trefferanzeige?cmd=doShowDocument&docuuid=73A344E9-CDB5-4A17-89C1-05E202989755"];

            // Once the RestReader (Radiorequest) is a vue component change the payload to metaURLs
            testAction(setMetadataURL, "73A344E9-CDB5-4A17-89C1-05E202989755", state, {}, [
                {type: "setMetaURLs", payload: metaURLs}
            ], {}, done, {
                restServiceById: id => id === "2" ? {url: "https://metaver.de/trefferanzeige?cmd=doShowDocument&docuuid="} : {}
            });
        });

    });
});
