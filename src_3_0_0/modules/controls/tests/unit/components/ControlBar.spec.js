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
                        activatedExpandable: sinon.stub(),
                        componentMap: () => {
                            return {
                                backForward: sinon.stub(),
                                button3d: sinon.stub(),
                                fullScreen: sinon.stub()
                            };
                        }
                    }
                },
                Maps: {
                    namespaced: true,
                    getters: {
                        mode: sinon.stub()
                    }
                }
            },
            getters: {
                controlsConfig: () => sinon.stub(),
                deviceMode: sinon.stub(),
                uiStyle: sinon.stub()
            }
        });
    });

    it("renders the buttons group", () => {
        const wrapper = mount(ControlBar, {store, localVue});

        expect(wrapper.find(".btn-group-controls").exists()).to.be.true;
    });

    it("renders the button", async () => {
        const wrapper = mount(ControlBar, {store, localVue});

        await wrapper.vm.categorizedControls.expandable.push("control");

        expect(wrapper.find(".control-icon-controls").exists()).to.be.true;
    });

    describe("fillCategorizedControls", () => {
        it("should fill categorizedControls.initialVisible", async () => {
            const wrapper = mount(ControlBar, {store, localVue});

            await wrapper.vm.fillCategorizedControls("exampleControl");

            expect(wrapper.vm.categorizedControls.initialVisible).to.be.an("array").that.is.not.empty;
            expect(wrapper.vm.categorizedControls.expandable).to.be.an("array").that.is.empty;
        });

        it("should fill categorizedControls.expandable", async () => {
            const wrapper = mount(ControlBar, {store, localVue});

            await wrapper.vm.fillCategorizedControls("exampleControl", true);

            expect(wrapper.vm.categorizedControls.initialVisible).to.be.an("array").that.is.empty;
            expect(wrapper.vm.categorizedControls.expandable).to.be.an("array").that.is.not.empty;
        });
    });
});
