import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import LayerPillsComponent from "../../../components/LayerPills.vue";
import LayerPills from "../../../store/indexLayerPills";
import {expect} from "chai";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;


describe("src_3_0_0/modules/LayerPills.vue", () => {
    const visibleLayersConst = [
            {id: 1, name: "layer1", typ: "WMS"},
            {id: 2, name: "layer2", typ: "WMS"},
            {id: 3, name: "layer3", typ: "WFS"},
            {id: 4, name: "layer4", typ: "WFS"}
        ],
        mockConfigJsonConst = {
            tree: {
                layerPillsAmount: 2
            }
        };

    let store,
        visibleLayers = [
            {id: 1, name: "layer1", typ: "WMS"},
            {id: 2, name: "layer2", typ: "WMS"},
            {id: 3, name: "layer3", typ: "WFS"},
            {id: 4, name: "layer4", typ: "WFS"}
        ],
        mockConfigJson = {
            tree: {
                layerPillsAmount: 2
            }
        },
        wrapper;


    beforeEach(() => {
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                LayerPills,
                Maps: {
                    namespaced: true,
                    getters: {
                        mode: () => "2D"
                    }
                }
            },
            getters: {
                isMobile: () => false,
                visibleSubjectDataLayerConfigs: () => visibleLayers,
                portalConfig: () => mockConfigJson
            },
            mutations: {
                setVisibleSubjectDataLayerConfigs: (state, layer) => {
                    visibleLayers = layer;
                },
                setPortalConfig: (state, configJson) => {
                    mockConfigJson = configJson;
                },
                replaceByIdInLayerConfig: (state, layerId) => {
                    visibleLayers = [{
                        id: layerId,
                        layer: {
                            id: layerId,
                            visibility: false
                        }
                    }];
                }
            }
        });

        store.commit("LayerPills/setVisibleSubjectDataLayers", visibleLayersConst);
        store.commit("LayerPills/setLayerPillsAmount", mockConfigJsonConst.tree.layerPillsAmount);
    });

    afterEach(() => {
        store.commit("LayerPills/setVisibleSubjectDataLayers", []);
        store.commit("LayerPills/setLayerPillsAmount", 0);

        if (wrapper) {
            wrapper.destroy();
        }
    });

    describe("renders or does not render div", () => {
        it("renders div", () => {
            wrapper = shallowMount(LayerPillsComponent, {store, localVue});
            expect(wrapper.find("#layer-pills").exists()).to.be.true;
        });

        it("no visibleSubjectDataLayers", () => {
            store.commit("setVisibleSubjectDataLayerConfigs", []);
            wrapper = shallowMount(LayerPillsComponent, {store, localVue});

            expect(wrapper.find("#layer-pills").exists()).to.be.false;
        });

        it("layerPillsAmount is 0", () => {
            store.commit("setPortalConfig", {
                tree: {
                    layerPillsAmount: 0
                }
            });
            wrapper = shallowMount(LayerPillsComponent, {store, localVue});

            expect(wrapper.find("#layer-pills").exists()).to.be.false;
        });
        it("scroll left and right buttons not showing ", () => {
            store.commit("setPortalConfig", {
                tree: {
                    layerPillsAmount: 0
                }
            });
            wrapper = shallowMount(LayerPillsComponent, {store, localVue});

            expect(wrapper.find("#layer-pills").exists()).to.be.false;
        });
    });

    describe("left scroll visibility", () => {
        it("left scroll is not visible", () => {
            store.commit("setVisibleSubjectDataLayerConfigs", visibleLayersConst);
            store.commit("setPortalConfig", {
                tree: {
                    layerPillsAmount: 4
                }
            });
            wrapper = shallowMount(LayerPillsComponent, {store, localVue});
            expect(wrapper.find(".invisible").exists()).to.be.true;

        });

        it("left scroll is visible", () => {
            store.commit("setVisibleSubjectDataLayerConfigs", visibleLayersConst);
            store.commit("setPortalConfig", {
                tree: {
                    layerPillsAmount: 2
                }
            });
            wrapper = shallowMount(LayerPillsComponent, {store, localVue});
            expect(wrapper.find(".invisible").exists()).to.be.false;
        });
    });

    describe("left scroll enabled and disabled", () => {
        it("left scroll is disabled", () => {
            store.commit("setVisibleSubjectDataLayerConfigs", visibleLayersConst);
            store.commit("setPortalConfig", mockConfigJsonConst);
            wrapper = shallowMount(LayerPillsComponent, {store, localVue});
            expect(wrapper.find("#left-button").element.disabled).to.be.true;
        });
        it("left scroll is enabled", async () => {
            let rightButton = null;

            store.commit("setVisibleSubjectDataLayerConfigs", visibleLayersConst);
            store.commit("setPortalConfig", mockConfigJsonConst);
            wrapper = shallowMount(LayerPillsComponent, {store, localVue});

            rightButton = wrapper.find("#right-button");

            expect(wrapper.find("#left-button").element.disabled).to.be.true;

            rightButton.trigger("click");
            store.commit("LayerPills/setStartIndex", 1);
            await wrapper.vm.$nextTick();
            expect(wrapper.find("#left-button").element.disabled).to.be.false;
        });
    });
    describe("right scroll enabeld and disabled", () => {
        it("right scroll is enabled", async () => {
            store.commit("setVisibleSubjectDataLayerConfigs", visibleLayersConst);
            store.commit("setPortalConfig", mockConfigJsonConst);
            wrapper = shallowMount(LayerPillsComponent, {store, localVue});

            await wrapper.vm.$nextTick();
            expect(wrapper.find("#right-button").element.disabled).to.be.false;
        });
        it("right scroll is disabled", async () => {
            let rightButton = null;

            wrapper = shallowMount(LayerPillsComponent, {store, localVue});

            rightButton = wrapper.find("#right-button");
            await wrapper.vm.$nextTick();
            expect(wrapper.find("#right-button").element.disabled).to.be.false;

            rightButton.trigger("click");
            store.commit("LayerPills/setEndIndex", 3);
            await wrapper.vm.$nextTick();
            rightButton.trigger("click");
            store.commit("LayerPills/setEndIndex", 4);
            await wrapper.vm.$nextTick();
            expect(wrapper.find("#right-button").element.disabled).to.be.true;
        });
    });

    describe("close layerPill", () => {
        it("count close-buttons", () => {
            store.commit("setVisibleSubjectDataLayerConfigs", visibleLayersConst);
            store.commit("setPortalConfig", mockConfigJsonConst);
            store.commit("LayerPills/setStartIndex", 0);
            store.commit("LayerPills/setEndIndex", 2);

            wrapper = shallowMount(LayerPillsComponent, {store, localVue});

            expect(wrapper.find("#close-button").exists()).to.be.true;
            expect(wrapper.findAll("#close-button").length).to.equals(2);
        });
        it.skip("one close button left", async () => {
            let closeButton = null;

            store.commit("setVisibleSubjectDataLayerConfigs", visibleLayersConst);
            store.commit("setPortalConfig", mockConfigJsonConst);

            wrapper = shallowMount(LayerPillsComponent, {store, localVue});
            closeButton = wrapper.find("#close-button");
            expect(wrapper.findAll("#close-button").length).to.equals(2);
            closeButton.trigger("click");
            await wrapper.vm.$nextTick();
            closeButton.trigger("click");
            await wrapper.vm.$nextTick();
            closeButton.trigger("click");
            await wrapper.vm.$nextTick();
            expect(wrapper.findAll("#close-button").length).to.equals(1);
        });
    });

});
