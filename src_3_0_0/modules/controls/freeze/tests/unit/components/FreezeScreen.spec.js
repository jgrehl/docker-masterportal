import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import Vuex from "vuex";

import FreezeScreen from "../../../components/FreezeScreen.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/controls/freeze/components/FreezeScreen.vue", () => {
    let store;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Controls: {
                    namespaced: true,
                    modules: {
                        Freeze: {
                            namespaced: true,
                            getters: {
                                icon: sinon.stub()
                            }
                        }
                    }
                }
            }
        });
    });

    it("renders the freeze-screen-button", () => {
        const wrapper = mount(FreezeScreen, {store, localVue});

        expect(wrapper.find("#freeze-screen-button").exists()).to.be.true;
        expect(wrapper.findAll("button")).to.have.length(1);
    });

    it("renders the freeze-screen-button and freeze-screen-unfreeze", async () => {
        const wrapper = mount(FreezeScreen, {store, localVue});

        await wrapper.vm.showFreezeWin();

        expect(wrapper.find("#freeze-screen-button").exists()).to.be.true;
        expect(wrapper.find("#freeze-screen-unfreeze").exists()).to.be.true;
    });
});
