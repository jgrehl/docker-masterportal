import Vuex from "vuex";
import {expect} from "chai";
import {config, shallowMount, createLocalVue, mount} from "@vue/test-utils";
import RoutingComponent from "../../../components/RoutingTemplate.vue";
import sinon from "sinon";
import mutations from "../../../store/mutationsRouting";
import actions from "../../../store/actionsRouting";
import getters from "../../../store/gettersRouting";
import state from "../../../store/stateRouting";
import Directions from "../../../store/directions/indexDirections";
import Isochrones from "../../../store/isochrones/indexIsochrones";

const localVue = createLocalVue();

localVue.use(Vuex);

config.mocks.$t = key => key;

describe("src/modules/routing/components/RoutingTemplate.vue", () => {
    const mockConfigJson = {
        configJson: {
            Portalconfig: {
                mainMenu: {
                    sections: [
                        [
                            {
                                "type": "routing",
                                "name": "translate#common:menu.tools.routing",
                                "icon": "bi-signpost-2-fill",
                                "renderToWindow": true
                            }
                        ]
                    ]
                }
            }
        }
    };
    let store,
        wrapper;

    beforeEach(() => {
        const map = {
            id: "ol",
            mode: "2D",
            addLayer: sinon.spy(),
            removeLayer: sinon.spy(),
            addInteraction: sinon.spy(),
            removeInteraction: sinon.spy(),
            updateSize: sinon.spy()
        };

        mapCollection.clear();
        mapCollection.addMap(map, "2D");

        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Maps: {
                    namespaced: true,
                    actions: {
                        addPointerMoveHandler: sinon.stub(),
                        removePointerMoveHandler: sinon.stub(),
                        removeInteraction: sinon.stub(),
                        addInteraction: sinon.stub(),
                        addLayer: sinon.stub(),
                        unregisterListener: sinon.stub(),
                        registerListener: sinon.stub()
                    },
                    state: {
                        mode: "2D"
                    }
                },
                Modules: {
                    namespaced: true,
                    modules: {
                        Routing:
                        {
                            namespaced: true,
                            modules: {
                                Directions,
                                Isochrones
                            },
                            state,
                            mutations,
                            actions,
                            getters
                        }
                    },
                    Alerting: {
                        namespaced: true,
                        actions: {
                            addSingleAlert: sinon.stub()
                        }
                    }
                }
            },
            getters: {
                uiStyle: () => ""
            },
            state: {
                configJson: mockConfigJson
            }
        });
        store.commit("Modules/Routing/setActive", true);
    });

    it("renders Routing", () => {
        wrapper = shallowMount(RoutingComponent, {store, localVue});
        expect(wrapper.find("#routing").exists()).to.be.true;
    });


    it("not renders routing", () => {
        store.commit("Modules/Routing/setActive", false);
        wrapper = shallowMount(RoutingComponent, {store, localVue});
        expect(wrapper.find("#routing").exists()).to.be.false;
    });

    it("renders directions", () => {
        store.commit("Modules/Routing/setActiveRoutingToolOption", "DIRECTIONS");
        wrapper = mount(RoutingComponent, {store, localVue});
        expect(wrapper.find("#routing-directions").exists()).to.be.true;
    });

    it("renders isochrones", () => {
        store.commit("Modules/Routing/setActiveRoutingToolOption", "ISOCHRONES");
        wrapper = mount(RoutingComponent, {store, localVue});
        expect(wrapper.find("#routing-isochrones").exists()).to.be.true;
    });
});
