import {createStore} from "vuex";
import {expect} from "chai";
import {config, shallowMount, mount} from "@vue/test-utils";
import RoutingComponent from "../../../components/RoutingTemplate.vue";
import sinon from "sinon";
import mutations from "../../../store/mutationsRouting";
import actions from "../../../store/actionsRouting";
import getters from "../../../store/gettersRouting";
import state from "../../../store/stateRouting";
import Directions from "../../../store/directions/indexDirections";
import Isochrones from "../../../store/isochrones/indexIsochrones";

config.global.mocks.$t = key => key;

describe("src/modules/routing/components/RoutingTemplate.vue", () => {
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

        store = createStore({
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
            state: state
        });
        store.state.geosearch.type = "BKG";
        store.state.geosearchReverse.serviceId = "1";
        store.state.geosearchReverse.type = "BKG";
        store.state.geosearch.serviceId = "1";
        store.state.isochronesSettings.type = "ORS";
        store.state.isochronesSettings.serviceId = "1";
        store.state.directionsSettings.type = "ORS";
        store.state.directionsSettings.serviceId = "1";
        store.commit("Modules/Routing/setActive", true);
    });

    it("renders Routing", () => {
        wrapper = shallowMount(RoutingComponent, {
            global: {
                plugins: [store]
            }});
        expect(wrapper.find("#routing").exists()).to.be.true;
    });

    it("not renders routing", () => {
        store.commit("Modules/Routing/setActive", false);
        wrapper = shallowMount(RoutingComponent, {
            global: {
                plugins: [store]
            }});
        expect(wrapper.find("#routing").exists()).to.be.false;
    });

    it("renders directions", () => {
        store.commit("Modules/Routing/setActiveRoutingToolOption", "DIRECTIONS");
        wrapper = mount(RoutingComponent, {
            global: {
                plugins: [store]
            }});
        expect(wrapper.find("#routing-directions").exists()).to.be.true;
    });

    it("renders isochrones", () => {
        store.commit("Modules/Routing/setActiveRoutingToolOption", "ISOCHRONES");
        wrapper = mount(RoutingComponent, {
            global: {
                plugins: [store]
            }});
        expect(wrapper.find("#routing-isochrones").exists()).to.be.true;
    });
});
