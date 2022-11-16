import Vuex from "vuex";
import {expect} from "chai";
import sinon from "sinon";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import RoutingAvoidFeaturesComponent from "../../../components/RoutingAvoidFeatures.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src/modules/routing/components/RoutingAvoidFeatures.vue", () => {
    let store,
        wrapper;

    beforeEach(() => {
        const map = {
            id: "ol",
            mode: "2D",
            addLayer: sinon.spy(),
            removeLayer: sinon.spy(),
            addInteraction: sinon.spy(),
            removeInteraction: sinon.spy()
        };

        mapCollection.clear();
        mapCollection.addMap(map, "ol", "2D");
        store = new Vuex.Store({
            namespaced: true,
            modules: {
            },
            state: {
                Map: {
                    mapId: "ol",
                    mapMode: "2D"
                }
            }
        });
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
    });

    it("renders RoutingAvoidFeatures", () => {
        wrapper = shallowMount(RoutingAvoidFeaturesComponent, {
            store,
            localVue,
            data: () => ({
                showAvoidFeatures: true
            }),
            propsData: {
                activeAvoidFeaturesOptions: [],
                settings: {
                    speedProfile: "PKW"
                }
            }
        });
        expect(wrapper.find("#routing-avoid-features").exists()).to.be.true;
    });

    it("renders RoutingAvoidFeaturesOptions", () => {
        wrapper = shallowMount(RoutingAvoidFeaturesComponent, {
            store,
            localVue,
            data: () => ({
                showAvoidFeatures: true
            }),
            propsData: {
                activeAvoidFeaturesOptions: [],
                settings: {
                    speedProfile: "PKW"
                }
            }
        });
        expect(wrapper.find("#routing-avoid-features-options").exists()).to.be.true;
    });

    it("does not render RoutingAvoidFeaturesOptions", () => {
        wrapper = shallowMount(RoutingAvoidFeaturesComponent, {
            store,
            localVue,
            data: () => ({
                showAvoidFeatures: false
            }),
            propsData: {
                activeAvoidFeaturesOptions: [],
                settings: {
                    speedProfile: "PKW"
                }
            }
        });
        expect(wrapper.find("#routing-avoid-features-options").exists()).to.be.false;
    });


    it("checks input checked", () => {
        wrapper = shallowMount(RoutingAvoidFeaturesComponent, {
            store,
            localVue,
            data: () => ({
                showAvoidFeatures: true
            }),
            propsData: {
                activeAvoidFeaturesOptions: ["HIGHWAYS"],
                settings: {
                    speedProfile: "CAR"
                }
            }
        });
        expect(wrapper.find("#routing-avoid-features-option-input-HIGHWAYS").element.checked).to.be.true;
    });

    it("checks input not checked", () => {
        wrapper = shallowMount(RoutingAvoidFeaturesComponent, {
            store,
            localVue,
            data: () => ({
                showAvoidFeatures: true
            }),
            propsData: {
                activeAvoidFeaturesOptions: [],
                settings: {
                    speedProfile: "CAR"
                }
            }
        });
        expect(wrapper.find("#routing-avoid-features-option-input-HIGHWAYS").element.checked).to.be.false;
    });

    it("checks input disabled", () => {
        wrapper = shallowMount(RoutingAvoidFeaturesComponent, {
            store,
            localVue,
            data: () => ({
                showAvoidFeatures: true
            }),
            propsData: {
                activeAvoidFeaturesOptions: ["HIGHWAYS"],
                settings: {
                    speedProfile: "CAR"
                },
                disabled: true
            }
        });
        expect(wrapper.find("#routing-avoid-features-option-input-HIGHWAYS").element.disabled).to.be.true;
    });

    it("checks input not disabled", () => {
        wrapper = shallowMount(RoutingAvoidFeaturesComponent, {
            store,
            localVue,
            data: () => ({
                showAvoidFeatures: true
            }),
            propsData: {
                activeAvoidFeaturesOptions: ["HIGHWAYS"],
                settings: {
                    speedProfile: "CAR"
                },
                disabled: false
            }
        });
        expect(wrapper.find("#routing-avoid-features-option-input-HIGHWAYS").element.disabled).to.be.false;
    });

    it("checks input emit on adding feature to be avoided", async () => {
        wrapper = shallowMount(RoutingAvoidFeaturesComponent, {
            store,
            localVue,
            data: () => ({
                showAvoidFeatures: true
            }),
            propsData: {
                activeAvoidFeaturesOptions: [],
                settings: {
                    speedProfile: "CAR"
                }
            }
        });
        const input = wrapper.find("#routing-avoid-features-option-input-HIGHWAYS");

        input.element.checked = true;
        input.trigger("change");
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted().addAvoidOption.length).equal(1);
        expect(wrapper.emitted().addAvoidOption[0]).deep.to.equal(["HIGHWAYS"]);
    });

    it("checks input emit on removing feature to be avoided", async () => {
        wrapper = shallowMount(RoutingAvoidFeaturesComponent, {
            store,
            localVue,
            data: () => ({
                showAvoidFeatures: true
            }),
            propsData: {
                activeAvoidFeaturesOptions: ["HIGHWAYS"],
                settings: {
                    speedProfile: "CAR"
                }
            }
        });
        const input = wrapper.find("#routing-avoid-features-option-input-HIGHWAYS");

        input.element.checked = false;
        input.trigger("change");
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted().removeAvoidOption.length).equal(1);
        expect(wrapper.emitted().removeAvoidOption[0]).deep.to.equal(["HIGHWAYS"]);
    });
});