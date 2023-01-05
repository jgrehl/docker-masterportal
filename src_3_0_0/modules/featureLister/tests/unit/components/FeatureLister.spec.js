import {createStore} from "vuex";
import {expect} from "chai";
import sinon from "sinon";
import {config, shallowMount} from "@vue/test-utils";
import FeatureListerComponent from "../../../components/FeatureLister.vue";
import FeatureLister from "../../../store/indexFeatureLister";

config.global.mocks.$t = key => key;

describe("src/modules/featureLister/components/FeatureLister.vue", () => {
    const mockMapGetters = {
            getVisibleOlLayerList: () => [{name: "ersterLayer", id: "123", features: [{getAttributesToShow: () => "TestAttributes"}], geometryType: "Point"}, {name: "zweiterLayer", id: "456", features: [{getAttributesToShow: () => "TestAttributes"}], geometryType: "Point"}, {name: "dritterLayer", id: "789", features: [{getAttributesToShow: () => "TestAttributes"}], geometryType: "Point"}]
        },
        mockConfigJson = {
            Portalconfig: {
                mainMenu: {
                    sections: [
                        {
                            type: "featureLister"
                        }
                    ]
                }
            }
        };
    let store,
        wrapper,
        rootGetters;

    beforeEach(() => {
        FeatureLister.actions.switchTabTo = sinon.spy(FeatureLister.actions.switchTabTo);
        FeatureLister.actions.addMouseEvents = sinon.spy(FeatureLister.actions.addMouseEvents);
        FeatureLister.getters.headers = () => [{key: "name", value: "Name"}];

        store = createStore({
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        FeatureLister
                    }
                },
                Maps: {
                    namespaced: true,
                    getters: mockMapGetters,
                    actions: {
                        removeHighlightFeature: sinon.stub()
                    }
                }
            },
            state: {
                configJson: mockConfigJson
            }
        });
    });

    afterEach(sinon.restore);

    it("renders list of visible vector layers", () => {
        store.commit("Modules/FeatureLister/setLayerListView", true);
        wrapper = shallowMount(FeatureListerComponent, {global: {plugins: [store]}});

        expect(wrapper.find("#feature-lister-themes").exists()).to.be.true;
        expect(store.state.Modules.FeatureLister.featureDetailView).to.be.false;
        expect(store.state.Modules.FeatureLister.featureListView).to.be.false;
        expect(store.state.Modules.FeatureLister.layerListView).to.be.true;
    });

    it("renders list of layer features", () => {
        const layer = {name: "ersterLayer", id: "123", features: [{values_: {features: [1, 2]}}], geometryType: "Point"};

        store.dispatch("Modules/FeatureLister/switchToList", {rootGetters}, layer);
        wrapper = shallowMount(FeatureListerComponent, {global: {plugins: [store]}});

        expect(wrapper.find("#feature-lister-list").exists()).to.be.true;
        expect(store.state.Modules.FeatureLister.featureDetailView).to.be.false;
        expect(store.state.Modules.FeatureLister.featureListView).to.be.true;
        expect(store.state.Modules.FeatureLister.layerListView).to.be.false;
    });
    it("renders details of selected feature", () => {
        const feature = {getAttributesToShow: () => [{key: "name", value: "Name"}], getProperties: () => [{key: "name", value: "Name"}]};

        store.commit("Modules/FeatureLister/setSelectedFeature", feature);
        store.dispatch("Modules/FeatureLister/switchToDetails");
        wrapper = shallowMount(FeatureListerComponent, {global: {plugins: [store]}});

        expect(wrapper.find("#feature-lister-details").exists()).to.be.true;
        expect(store.state.Modules.FeatureLister.featureDetailView).to.be.true;
        expect(store.state.Modules.FeatureLister.featureListView).to.be.false;
        expect(store.state.Modules.FeatureLister.layerListView).to.be.false;
    });
});
