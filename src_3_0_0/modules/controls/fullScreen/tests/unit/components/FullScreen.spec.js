import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import Vuex from "vuex";

import FullScreen from "../../../components/FullScreen.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/controls/fullScreen/components/FullScreen.vue", () => {
    let store;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Controls: {
                    namespaced: true,
                    modules: {
                        FullScreen: {
                            namespaced: true,
                            getters: {
                                iconArrow: sinon.stub()
                            }
                        }
                    }
                }
            }
        });
    });

    it("renders the fullScreen button", () => {
        const wrapper = mount(FullScreen, {store, localVue});

        expect(wrapper.find("#full-screen-button").exists()).to.be.true;
        expect(wrapper.findAll("button")).to.have.length(1);
    });
});
