import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import Vuex from "vuex";

import Button3dItem from "../../../components/Button3dItem.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/controls/button3d/components/Button3dItem.vue", () => {
    let store;

    before(() => {
        i18next.init({
            lng: "cimode",
            debug: false
        });
    });

    beforeEach(() => {
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Maps: {
                    namespaced: true,
                    getters: {
                        mode: () => "2D"
                    },
                    actions: {
                        changeMapMode: () => sinon.stub()
                    }
                }
            }
        });
    });

    it("renders the button3d button", () => {
        const wrapper = mount(Button3dItem, {store, localVue});

        expect(wrapper.find(".button-3d-button > button").exists()).to.be.true;
        expect(wrapper.findAll("button")).to.have.length(1);
    });

    it("should trigger change map mode with target mode 3D", async () => {
        const triggerChangeMapModeSpy = sinon.spy(Button3dItem.methods, "triggerChangeMapMode"),
            changeMapModeSpy = sinon.spy(Button3dItem.methods, "changeMapMode"),
            wrapper = mount(Button3dItem, {store, localVue});

        await wrapper.find(".button-3d-button > button").trigger("click");

        expect(triggerChangeMapModeSpy.calledOnce).to.be.true;
        expect(changeMapModeSpy.calledOnce).to.be.true;
        expect(changeMapModeSpy.firstCall.args).to.deep.equals(["3D"]);
    });
});
