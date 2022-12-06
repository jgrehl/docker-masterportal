import Vuex from "vuex";
import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import LayerInformationComponent from "../../../components/LayerInformation.vue";
import sinon from "sinon";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/layerInformation/components/LayerInformation.vue", () => {
    let store;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                namespaced: true,
                Modules: {
                    namespaced: true,
                    modules: {
                        namespaced: true,
                        LayerInformation: {
                            namespaced: true,
                            mutations: {
                                setMetaDataCatalogueId: () => sinon.stub()
                            },
                            getters: {
                                active: () => true,
                                title: () => "",
                                layerInfo: () => ({"metaIdArray": []}),
                                datePublication: () => null,
                                dateRevision: () => null,
                                downloadLinks: () => null,
                                periodicityKey: () => null,
                                abstractText: () => "Test",
                                noMetadataLoaded: () => "",
                                metaURLs: () => [],
                                currentLayerName: () => "",
                                showUrlGlobal: () => false
                            },
                            actions: {
                                setConfigParams: () => sinon.stub()
                            }
                        }
                    }
                }
            },
            getters: {
                configJs: () => sinon.stub()
            }
        });
    });


    it("should have an existing title", () => {
        const wrapper = mount(LayerInformationComponent, {
            store,
            localVue
        });

        expect(wrapper.find(".subtitle")).to.exist;
    });

    it("should have a close button", async () => {
        const wrapper = mount(LayerInformationComponent, {
            store,
            localVue
        });

        expect(wrapper.find(".bi-x-lg")).to.exist;
    });

    it("should check if dropdown for group layer to not exists", async () => {
        const wrapper = mount(LayerInformationComponent, {store, localVue});

        expect(wrapper.find("#changeLayerInfo").exists()).to.be.false;
    });
});
