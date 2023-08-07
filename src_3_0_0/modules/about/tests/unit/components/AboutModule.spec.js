import {createStore} from "vuex";
import {config, mount} from "@vue/test-utils";
import {expect} from "chai";
import AboutComponent from "../../../components/AboutModule.vue";
import sinon from "sinon";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/about/components/AboutModule.vue", () => {
    let store;

    beforeEach(() => {
        store = createStore({
            namespaced: true,
            modules: {
                namespaced: true,
                Modules: {
                    namespaced: true,
                    modules: {
                        namespaced: true,
                        About: {
                            namespaced: true,
                            getters: {
                                title: () => "",
                                downloadLink: () => "",
                                version: () => "",
                                metaUrl: () => "",
                                abstractText: () => "Test",
                                noMetadataLoaded: () => "",
                                contact: () => null,
                                logo: () => "",
                                showAdditionalMetaData: () => true
                            },
                            actions: {
                                initializeAboutInfo: () => sinon.stub()
                            }
                        }
                    }
                }
            }
        });
    });

    it("should have an existing title", () => {
        const wrapper = mount(AboutComponent, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find(".subtitle")).to.exist;
    });
    it("should have an abstract", async () => {
        const wrapper = mount(AboutComponent, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find(".abstract")).to.exist;
    });
    it("should have a logo and version", async () => {
        const wrapper = mount(AboutComponent, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find(".logoAndVersion")).to.exist;
    });
    it("should have a logo and version", async () => {
        const wrapper = mount(AboutComponent, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find(".logoAndVersion")).to.exist;
    });
});
