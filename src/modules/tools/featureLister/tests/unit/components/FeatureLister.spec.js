import Vuex from "vuex";
import {expect} from "chai";
import sinon from "sinon";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import FeatureListerComponent from "../../../components/FeatureLister.vue";
import FeatureLister from "../../../store/indexFeatureLister";
import VectorLayer from "ol/layer/Vector.js";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src/modules/tools/featureLister/components/FeatureLister.vue", () => {
    const mockMapGetters = {
            visibleLayerList: () => [{name: "ersterLayer", id: "123", features: [{getAttributesToShow: () => "TestAttributes"}], geometryType: "Point"}, {name: "zweiterLayer", id: "456", features: [{getAttributesToShow: () => "TestAttributes"}], geometryType: "Point"}, {name: "dritterLayer", id: "789", features: [{getAttributesToShow: () => "TestAttributes"}], geometryType: "Point"}]
        },
        mockConfigJson = {
            Portalconfig: {
                menu: {
                    tools: {
                        children: {
                            featureLister:
                            {
                                "name": "translate#common:menu.tools.featureLister",
                                "glyphicon": "glyphicon-th-list",
                                "renderToWindow": true
                            }
                        }
                    }
                }
            }
        };
    let store,
        wrapper;

    beforeEach(() => {
        FeatureLister.actions.switchTabTo = sinon.spy(FeatureLister.actions.switchTabTo);
        FeatureLister.actions.addMouseEvents = sinon.spy(FeatureLister.actions.addMouseEvents);
        FeatureLister.getters.headers = () => [{key: "name", value: "Name"}];

        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Tools: {
                    namespaced: true,
                    modules: {
                        FeatureLister
                    }
                },
                Map: {
                    namespaced: true,
                    getters: mockMapGetters
                }
            },
            state: {
                configJson: mockConfigJson
            }
        });
    });

    afterEach(sinon.restore);

    it("renders list of visible vector layers", () => {

        store.commit("Tools/FeatureLister/setActive", true);
        store.commit("Tools/FeatureLister/setLayerListView", true);
        wrapper = shallowMount(FeatureListerComponent, {store, localVue});

        expect(wrapper.find("#featurelist-themes").exists()).to.be.true;
        expect(wrapper.find("#tool-featureLister").exists()).to.be.true;
        expect(store.state.Tools.FeatureLister.featureDetailView).to.be.false;
        expect(store.state.Tools.FeatureLister.featureListView).to.be.false;
        expect(store.state.Tools.FeatureLister.layerListView).to.be.true;
    });

    it("renders list of layer features", () => {
        const layer1 = new VectorLayer({
                name: "ersterLayer", id: "123", features: [{getAttributesToShow: () => [{key: "name", value: "Name"}]}], geometryType: "Point", values_: [1, 2]
            }),
            layerList = [layer1],
            layer = {name: "ersterLayer", id: "123", features: [{values_: {features: [1, 2]}}], geometryType: "Point"};

        store.commit("Tools/FeatureLister/setVisibleLayers", layerList);
        store.dispatch("Tools/FeatureLister/switchToList", layer);
        wrapper = shallowMount(FeatureListerComponent, {store, localVue});

        expect(wrapper.find("#featurelist-list").exists()).to.be.true;
        expect(store.state.Tools.FeatureLister.featureDetailView).to.be.false;
        expect(store.state.Tools.FeatureLister.featureListView).to.be.true;
        expect(store.state.Tools.FeatureLister.layerListView).to.be.false;
    });
    it("renders details of selected feature", () => {
        const feature = {getAttributesToShow: () => [{key: "name", value: "Name"}], getProperties: () => [{key: "name", value: "Name"}]};

        store.commit("Tools/FeatureLister/setSelectedFeature", feature);
        store.dispatch("Tools/FeatureLister/switchToDetails");
        wrapper = shallowMount(FeatureListerComponent, {store, localVue});

        expect(wrapper.find("#featurelist-details").exists()).to.be.true;
        expect(store.state.Tools.FeatureLister.featureDetailView).to.be.true;
        expect(store.state.Tools.FeatureLister.featureListView).to.be.false;
        expect(store.state.Tools.FeatureLister.layerListView).to.be.false;
    });
    describe("FeatureLister.vue methods", () => {
        it("close sets active to false", async () => {
            wrapper = shallowMount(FeatureListerComponent, {store, localVue});

            wrapper.vm.close();
            await wrapper.vm.$nextTick();

            expect(wrapper.find("#tool-featureLister").exists()).to.be.false;
            expect(store.state.Tools.FeatureLister.active).to.be.false;
        });
    });
});
