import {expect} from "chai";
import mutations from "../../mutations";

const {
        setLoadedConfigs,
        replaceByIdInLayerConfig
    } = mutations,
    id = "453",
    state = {
        layerConfig: {
            Hintergrundkarten: {
                elements: [
                    {
                        id: id,
                        visibility: true,
                        type: "layer"
                    },
                    {
                        id: "452",
                        type: "layer"
                    }
                ]
            },
            Fachdaten: {
                elements: [
                    {
                        id: "1132",
                        name: "100 Jahre Stadtgruen POIs",
                        visibility: true,
                        type: "layer"
                    },
                    {
                        id: "10220",
                        type: "layer"
                    }
                ]
            }
        }
    };

describe("src_3_0_0/app-store/mutations.js", () => {
    describe("setLoadedConfigs", () => {
        it("Sets the loaded configJson to true", () => {
            const localState = {
                loadedConfigs: {
                    configJson: false,
                    restServicesJson: false,
                    servicesJson: false
                }
            };

            setLoadedConfigs(localState, "configJson");

            expect(localState.loadedConfigs.configJson).to.be.true;
            expect(localState.loadedConfigs.restServicesJson).to.be.false;
            expect(localState.loadedConfigs.servicesJson).to.be.false;
        });

        it("Sets the loaded all configs to true", () => {
            const localState = {
                loadedConfigs: {
                    configJson: false,
                    restServicesJson: false,
                    servicesJson: false
                }
            };

            setLoadedConfigs(localState, "configJson");
            setLoadedConfigs(localState, "restServicesJson");
            setLoadedConfigs(localState, "servicesJson");

            expect(localState.loadedConfigs.configJson).to.be.true;
            expect(localState.loadedConfigs.restServicesJson).to.be.true;
            expect(localState.loadedConfigs.servicesJson).to.be.true;
        });

        it("replaceByIdInLayerConfig layer is contained in layerConfig", () => {
            const toReplace = {
                id: id, // 453
                visibility: true,
                att1: "bla",
                att2: [{
                    foo: "foo",
                    bar: "bar"
                }]
            };

            replaceByIdInLayerConfig(state, {layerConfigs: [{layer: toReplace, id: id}]});

            expect(state.layerConfig?.Hintergrundkarten?.elements).to.be.an("array");
            expect(state.layerConfig?.Hintergrundkarten?.elements.length).to.be.equals(2);
            expect(Object.keys(state.layerConfig?.Hintergrundkarten?.elements[0]).length).to.be.equals(5);
            expect(state.layerConfig?.Hintergrundkarten?.elements[0].id).to.be.equals(id);
            expect(state.layerConfig?.Hintergrundkarten?.elements[0].visibility).to.be.true;
            expect(state.layerConfig?.Hintergrundkarten?.elements[0].att1).to.be.equals("bla");
            expect(state.layerConfig?.Hintergrundkarten?.elements[0].att2).to.be.deep.equals(toReplace.att2);
            expect(state.layerConfig?.Hintergrundkarten?.elements[1].id).to.be.equals("452");
            expect(Object.keys(state.layerConfig?.Hintergrundkarten?.elements[1]).length).to.be.equals(2);

            expect(state.layerConfig?.Fachdaten?.elements).to.be.an("array");
            expect(state.layerConfig?.Fachdaten?.elements.length).to.be.equals(2);
            expect(state.layerConfig?.Fachdaten?.elements[0].id).to.be.equals("1132");
            expect(Object.keys(state.layerConfig?.Fachdaten?.elements[0]).length).to.be.equals(4);
            expect(state.layerConfig?.Fachdaten?.elements[1].id).to.be.equals("10220");
            expect(Object.keys(state.layerConfig?.Fachdaten?.elements[1]).length).to.be.equals(2);
        });

        it("replaceByIdInLayerConfig layer is not contained in layerConfig", () => {
            const toReplace = {
                    id: "unknown",
                    visibility: true,
                    att1: "bla",
                    att2: [{
                        foo: "foo",
                        bar: "bar"
                    }]
                },
                stateCopy = {...state};

            replaceByIdInLayerConfig(state, {layerConfigs: [{layer: toReplace, id: "unknown"}]});
            expect(state).to.be.deep.equals(stateCopy);
        });

        it("replaceByIdInLayerConfig toReplace-layer is undefined", () => {
            const stateCopy = {...state};

            replaceByIdInLayerConfig(state, undefined);
            expect(state).to.be.deep.equals(stateCopy);
        });
    });
});
