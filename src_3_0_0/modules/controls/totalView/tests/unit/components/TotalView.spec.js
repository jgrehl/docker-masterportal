import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import Vuex from "vuex";

import TotalView from "../../../components/TotalView.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/controls/totalView/components/TotalView.vue", () => {
    const resetViewSpy = sinon.spy();
    let store;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Controls: {
                    namespaced: true,
                    modules: {
                        TotalView: {
                            namespaced: true,
                            getters: {
                                icon: sinon.stub()
                            }
                        }
                    }
                },
                Maps: {
                    namespaced: true,
                    getters: {
                        center: () => [10, 20],
                        initialCenter: () => [5, 5],
                        initialZoom: () => 3,
                        zoom: () => 5
                    },
                    actions: {
                        resetView: resetViewSpy
                    }
                }
            }
        });
    });

    after(() => {
        sinon.restore();
    });

    it("renders the totalView button", () => {
        const wrapper = mount(TotalView, {store, localVue});

        expect(wrapper.find("#total-view-button").exists()).to.be.true;
        expect(wrapper.findAll("button")).to.have.length(1);
    });

    it("should trigger the action resetView if button is clicked", async () => {
        const wrapper = mount(TotalView, {store, localVue});

        await wrapper.find("#total-view-button > button").trigger("click");

        expect(resetViewSpy.calledOnce).to.be.true;
    });
});
