import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";

import FreezeScreenUnfreeze from "../../../components/FreezeScreenUnfreeze.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/controls/freeze/components/FreezeScreenUnfreeze.vue", () => {
    it("renders the freeze-screen-unfreeze", () => {
        const wrapper = mount(FreezeScreenUnfreeze, {localVue});

        expect(wrapper.find("#freeze-screen-unfreeze").exists()).to.be.true;
        expect(wrapper.findAll("p")).to.have.length(1);
    });

    it("should emit hideFreezeWin after click on p", async () => {
        const wrapper = mount(FreezeScreenUnfreeze, {localVue});

        await wrapper.find("#freeze-screen-unfreeze > p").trigger("click");

        expect(wrapper.emitted("hideFreezeWin").length).to.equals(1);
    });
});
