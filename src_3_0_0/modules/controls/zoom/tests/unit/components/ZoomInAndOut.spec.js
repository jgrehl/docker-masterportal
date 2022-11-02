import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import Vuex from "vuex";

import ZoomInAndOut from "../../../components/ZoomInAndOut.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/controls/zoom/components/ZoomInAndOut.vue", () => {
    const decreaseZoomSpy = sinon.spy(),
        increaseZoomSpy = sinon.spy();
    let store;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Controls: {
                    namespaced: true,
                    modules: {
                        Zoom: {
                            namespaced: true,
                            getters: {
                                iconIn: sinon.stub(),
                                iconOut: sinon.stub()
                            }
                        }
                    }
                },
                Maps: {
                    namespaced: true,
                    getters: {
                        isMaxZoomDisplayed: () => false,
                        isMinZoomDisplayed: () => false
                    },
                    actions: {
                        decreaseZoom: decreaseZoomSpy,
                        increaseZoom: increaseZoomSpy
                    }
                }
            }
        });
    });

    after(() => {
        sinon.restore();
    });

    it("renders the ZoomInAndOut buttons", () => {
        const wrapper = mount(ZoomInAndOut, {store, localVue});

        expect(wrapper.find("#zoom-in-and-out-buttons").exists()).to.be.true;
        expect(wrapper.findAll("button")).to.have.length(2);
    });

    it("should trigger the action increaseZoom if button plus is clicked", async () => {
        const wrapper = mount(ZoomInAndOut, {store, localVue}),
            buttons = wrapper.findAll("#zoom-in-and-out-buttons > button");

        await buttons.at(0).trigger("click");
        expect(increaseZoomSpy.calledOnce).to.be.true;
    });

    it("should trigger the action decreaseZoom if button minus is clicked", async () => {
        const wrapper = mount(ZoomInAndOut, {store, localVue}),
            buttons = wrapper.findAll("#zoom-in-and-out-buttons > button");

        await buttons.at(1).trigger("click");
        expect(decreaseZoomSpy.calledOnce).to.be.true;
    });
});
