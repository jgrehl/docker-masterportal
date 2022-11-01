import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import Vuex from "vuex";

import ControlBar from "../../../components/ControlBar.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/controls/components/ControlBar.vue", () => {
    let store;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Controls: {
                    namespaced: true,
                    getters: {
                        componentMap: () => {
                            return {
                                backForward: sinon.stub(),
                                button3d: sinon.stub(),
                                fullScreen: sinon.stub()
                            };
                        },
                        mobileHiddenControls: () => {
                            return ["fullScreen"];
                        },
                        expandableControls: () => {
                            return ["button3d"];
                        }
                    }
                }
            },
            getters: {
                controlsConfig: () => sinon.stub(),
                isMobile: sinon.stub(),
                uiStyle: sinon.stub()
            }
        });
    });

    it("renders the buttons group", () => {
        const wrapper = mount(ControlBar, {store, localVue});

        expect(wrapper.find(".btn-group-controls").exists()).to.be.true;
    });

    it("renders the button", () => {
        const wrapper = mount(ControlBar, {store, localVue});

        expect(wrapper.find(".control-icon-controls").exists()).to.be.true;
    });
});
