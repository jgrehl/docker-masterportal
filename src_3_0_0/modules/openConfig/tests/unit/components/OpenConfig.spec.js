import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import Vue from "vue";
import Vuex from "vuex";

import OpenConfigComponent from "../../../components/OpenConfig.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/openConfig/components/OpenConfig.vue", () => {
    let store,
        warn,
        wrapper;

    beforeEach(() => {
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);

        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        namespaced: true,
                        OpenConfig: {
                            namespaced: true,
                            getters: {
                                active: () => true,
                                icon: () => sinon.stub()
                            }
                        }
                    }
                }
            }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it("renders the openConfig", () => {
        wrapper = shallowMount(OpenConfigComponent, {store, localVue});

        expect(wrapper.find("#open-config").exists()).to.be.true;
        expect(wrapper.find("h2").exists()).to.be.true;
        expect(wrapper.find("p").exists()).to.be.true;
        expect(wrapper.find("p").exists()).to.be.true;
        expect(wrapper.find("#open-config-input-button").exists()).to.be.true;
        expect(wrapper.find("#open-config-input-button > label").exists()).to.be.true;
        expect(wrapper.find("#open-config-input-button > label").text()).to.equals("modules.tools.openConfig.openFile");
        expect(wrapper.find("#open-config-input-button > label > input").exists()).to.be.true;
        expect(wrapper.find("#open-config-input-button > label > span").exists()).to.be.true;
        expect(wrapper.find("#open-config-input-button > label > span > i").exists()).to.be.true;
    });

    it("should trigger function triggerClickOnFileInput on keydown", async () => {
        Vue.nextTick(async () => {
            const openConfigComponentSpy = sinon.spy(OpenConfigComponent.methods, "triggerClickOnFileInput");

            wrapper = shallowMount(OpenConfigComponent, {store, localVue});
            await wrapper.find("#open-config-input-button > label").trigger("keydown");

            expect(openConfigComponentSpy.calledOnce).to.be.true;
        });
    });

    it("should trigger function loadFile on change input", async () => {
        Vue.nextTick(async () => {
            const loadFileSpy = sinon.spy(OpenConfigComponent.methods, "loadFile");

            wrapper = shallowMount(OpenConfigComponent, {store, localVue});
            await wrapper.find("#open-config-input-button > label > input").trigger("change");

            expect(loadFileSpy.calledOnce).to.be.true;
        });
    });
});
