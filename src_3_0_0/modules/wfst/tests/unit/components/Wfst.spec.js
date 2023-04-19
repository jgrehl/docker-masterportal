import Vuex from "vuex";
import {config, mount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import WfsTransaction from "../../../components/WfsTransaction.vue";
import WfstModule from "../../../store/indexWfst";
import prepareFeaturePropertiesModule from "../../../utils/prepareFeatureProperties";

config.global.mocks.$t = key => key;

describe("src/modules/modules/wfst/components/WfsTransaction.vue", () => {
    const layerIds = ["wfstOne", "wfstTwo"],
        exampleLayerOne = {
            get: key => exampleLayerOne[key],
            featureNS: "http://www.deegree.org/app",
            featurePrefix: "app",
            featureType: "wfstOne",
            gfiAttributes: "showAll",
            style: sinon.fake(),
            visibility: false,
            name: "Wfs-T one",
            url: "some.generic.url",
            version: "1.1.0"
        },
        exampleLayerTwo = {
            get: key => exampleLayerTwo[key],
            featureNS: "http://www.deegree.org/app",
            featurePrefix: "app",
            featureType: "wfstTwo",
            gfiAttributes: "showAll",
            style: sinon.fake(),
            visibility: false,
            name: "Wfs-T two",
            url: "some.generic.url",
            version: "1.1.0"
        };
    let store,
        wrapper;

    beforeEach(() => {
        sinon.stub(prepareFeaturePropertiesModule, "prepareFeatureProperties").resolves([
            {
                label: "stringAtt",
                key: "stringAtt",
                value: null,
                type: "string",
                required: false
            },
            {
                label: "numAtt",
                key: "numAtt",
                value: null,
                type: "integer",
                required: false
            },
            {
                label: "boolAtt",
                key: "boolAtt",
                value: null,
                type: "boolean",
                required: false
            },
            {
                label: "dateAtt",
                key: "dateAtt",
                value: null,
                type: "date",
                required: false
            }
        ]);
        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        namespaced: true,
                        Wfst: WfstModule
                    }
                }
            },
            getters: {
                allLayerConfigs: () => {
                    return [];
                },
                visibleLayerConfigs: () => {
                    return [];
                },
                uiStyle: sinon.stub()
            }
        });
    });
    afterEach(sinon.restore);

    // form -> form-Element mit input-Elementen und dazugehörigen label als auch div-Element mit 2 SimpleButton
    it("renders a container for the whole tool", () => {
        wrapper = mount(WfsTransaction, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find("#tool-wfsTransaction-container").exists()).to.be.true;
    });
    it("renders a container for the layer selection including a select element and its label", () => {
        store.commit("Modules/Wfst/setLayerIds", layerIds);

        wrapper = mount(WfsTransaction, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find("#tool-wfsTransaction-layerSelect-container").exists()).to.be.true;
        expect(wrapper.find("#tool-wfsTransaction-layerSelect").exists()).to.be.true;
        expect(wrapper.find("#tool-wfsTransaction-layerSelect-label").exists()).to.be.true;
        expect(wrapper.find("#tool-wfsTransaction-layerSelect-label").text()).to.equal("common:modules.tools.wfsTransaction.layerSelectLabel");
    });
    it("renders a container including the failure message that no layer has been selected in the layer tree", () => {
        exampleLayerOne.visibility = false;

        store.commit("Modules/Wfst/setLayerIds", layerIds);

        wrapper = mount(WfsTransaction, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find("#tool-wfsTransaction-layerFailure").exists()).to.be.true;
        expect(wrapper.find("#tool-wfsTransaction-layerFailure").text()).to.equal("modules.tools.wfsTransaction.error.allLayersNotSelected");
    });
    it.skip("renders a container including the failure message that the current layer has not been selected in the layer tree", () => {
        exampleLayerOne.visibility = false;
        exampleLayerTwo.visibility = true;
        store.commit("Modules/Wfst/setLayerIds", layerIds);
        store.commit("Modules/Wfst/setLayerInformation", [{...exampleLayerOne, visibility: false}, exampleLayerTwo]);
        store.commit("Modules/Wfst/setFeatureProperties");


        wrapper = mount(WfsTransaction, {
            global: {
                plugins: [store]
            }
        });
        wrapper.vm.currentLayerIndex = 0;

        wrapper.vm.layerIds = [{...exampleLayerOne, visibility: false}, exampleLayerTwo];
        wrapper.vm.layerInformation = [{...exampleLayerOne, visibility: false}, exampleLayerTwo];
        expect(wrapper.find("#tool-wfsTransaction-layerFailure").exists()).to.be.true;
        expect(wrapper.find("#tool-wfsTransaction-layerFailure").text()).to.equal("modules.tools.wfsTransaction.error.layerNotSelected");
    });
    it.skip("renders a container including the failure message that the current layer is missing the property featurePrefix", () => {
        exampleLayerOne.visibility = true;
        delete exampleLayerOne.featurePrefix;

        store.commit("Modules/Wfst/setLayerIds", layerIds);
        wrapper = mount(WfsTransaction, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find("#tool-wfsTransaction-layerFailure").exists()).to.be.true;
        expect(wrapper.find("#tool-wfsTransaction-layerFailure").text()).to.equal("modules.wfsTransaction.error.layerNotConfiguredCorrectly");
    });
    it.skip("renders a container including a button for an insert transaction if lineButton is configured", () => {
        exampleLayerOne.visibility = true;
        exampleLayerOne.featurePrefix = "app";
        store.commit("Modules/Wfst/setSelectedInteraction", "update");
        store.commit("Modules/Wfst/setLineButton", [{
            layerId: exampleLayerOne.id,
            available: true
        }]);
        store.commit("Modules/Wfst/setLayerIds", layerIds);
        wrapper = mount(WfsTransaction, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find("#tool-wfsTransaction-interactionSelect-container").exists()).to.be.true;

    });
    it.skip("renders a form which includes a label and an input element for every gfi attribute of the layer", () => {

        exampleLayerOne.visibility = true;

        store.commit("Modules/Wfst/setLayerIds", layerIds);
        store.commit("Modules/Wfst/setSelectedInteraction", "insert");
        wrapper = mount(WfsTransaction, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find("#tool-wfsTransaction-form").exists()).to.be.true;
        expect(wrapper.find("#tool-wfsTransaction-form-input-stringAtt").exists()).to.be.true;
        expect(wrapper.find("#tool-wfsTransaction-form-input-stringAtt").attributes().type).to.equal("text");
        expect(wrapper.find("#tool-wfsTransaction-form-input-numAtt").exists()).to.be.true;
        expect(wrapper.find("#tool-wfsTransaction-form-input-numAtt").attributes().type).to.equal("number");
        expect(wrapper.find("#tool-wfsTransaction-form-input-boolAtt").exists()).to.be.true;
        expect(wrapper.find("#tool-wfsTransaction-form-input-boolAtt").attributes().type).to.equal("checkbox");
        expect(wrapper.find("#tool-wfsTransaction-form-input-dateAtt").exists()).to.be.true;
        expect(wrapper.find("#tool-wfsTransaction-form-input-dateAtt").attributes().type).to.equal("date");
        expect(wrapper.find("#tool-wfsTransaction-form-buttons").exists()).to.be.true;
    });
});