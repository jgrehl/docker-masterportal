import {createStore} from "vuex";
import {expect} from "chai";
import sinon from "sinon";
import {config, shallowMount} from "@vue/test-utils";
import RoutingLoadingSpinnerComponent from "../../../components/RoutingLoadingSpinner.vue";

config.global.mocks.$t = key => key;

describe("src/modules/routing/components/RoutingLoadingSpinner.vue", () => {
    let store,
        wrapper;

    beforeEach(() => {
        store = createStore({
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
        sinon.restore();
    });

    it("renders RoutingLoadingSpinnerComponent", () => {
        wrapper = shallowMount(RoutingLoadingSpinnerComponent, {
            global: {
                plugins: [store]
            }
        });
        expect(wrapper.find(".spinner").exists()).to.be.true;
    });
});
