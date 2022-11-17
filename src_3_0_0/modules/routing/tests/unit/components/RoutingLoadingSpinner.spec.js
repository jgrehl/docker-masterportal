import Vuex from "vuex";
import {expect} from "chai";
import sinon from "sinon";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import RoutingLoadingSpinnerComponent from "../../../components/RoutingLoadingSpinner.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src/modules/routing/components/RoutingLoadingSpinner.vue", () => {
    let store,
        wrapper;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        Routing:
                        {
                            namespaced: true
                        }
                    }
                },
                Alerting: {
                    namespaced: true,
                    actions: {
                        addSingleAlert: sinon.stub()
                    }
                }
            }
        });
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
    });

    it("renders RoutingLoadingSpinnerComponent", () => {
        wrapper = shallowMount(RoutingLoadingSpinnerComponent, {
            store,
            localVue
        });
        expect(wrapper.find(".spinner").exists()).to.be.true;
    });
});
