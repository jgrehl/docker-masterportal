import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import Vuex from "vuex";

import FullScreen from "../../../components/FullScreen.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/controls/fullScreen/components/FullScreen.vue", () => {
    it("renders the fullScreen button", () => {
        const wrapper = mount(FullScreen, {localVue});

        expect(wrapper.find(".fullscreen-button").exists()).to.be.true;
        expect(wrapper.findAll("button")).to.have.length(1);
    });
});
