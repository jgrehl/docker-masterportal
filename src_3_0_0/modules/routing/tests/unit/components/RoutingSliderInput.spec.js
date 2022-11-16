import Vuex from "vuex";
import {expect} from "chai";
import sinon from "sinon";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import RoutingSliderInputComponent from "../../../components/RoutingSliderInput.vue";
import mutations from "../../../store/mutationsRouting";
import actions from "../../../store/actionsRouting";
import getters from "../../../store/gettersRouting";
import state from "../../../store/stateRouting";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src/modules/routing/components/RoutingSliderInput.vue", () => {
    let store,
        wrapper,
        props;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        Routing:
                        {
                            namespaced: true,
                            modules: {
                            },
                            state: {...state},
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
            }
        });

        props = {
            label: "test",
            value: 3,
            min: 1,
            max: 5,
            step: 1,
            unit: "min",
            disabled: false
        };
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
    });

    it("renders RoutingSliderInputComponent", () => {
        wrapper = shallowMount(RoutingSliderInputComponent, {
            store,
            localVue,
            propsData: props
        });
        expect(wrapper.find("#routing-slider-input-test").exists()).to.be.true;
    });
});
