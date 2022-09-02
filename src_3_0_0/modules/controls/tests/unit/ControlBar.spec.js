import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import Vuex from "vuex";

import ControlBar from "../../ControlBar.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/controls/ControlBar.vue", () => {
    let store;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Controls: {
                    namespaced: true,
                    getters: {
                        componentMap: sinon.stub(),
                        mobileHiddenControls: sinon.stub(),
                        bottomControls: sinon.stub()
                    }
                }
            },
            getters: {
                controlsConfig: () => null,
                isMobile: sinon.stub(),
                uiStyle: sinon.stub()
            }
        });
    });

    it("renders the right-bar", () => {
        const wrapper = mount(ControlBar, {store, localVue});

        expect(wrapper.find(".right-bar").exists()).to.be.true;
    });

    it("renders three <li>", () => {
        const wrapper = mount(ControlBar, {store, localVue});

        expect(wrapper.findAll("li").length).to.equals(3);
        expect(wrapper.findAll("li.control-separator").exists()).to.be.true;
    });
});
