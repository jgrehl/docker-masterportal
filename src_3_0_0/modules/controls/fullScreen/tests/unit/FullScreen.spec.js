import Vuex from "vuex";
import {config, mount, createLocalVue} from "@vue/test-utils";
import FullScreen from "../../components/FullScreen.vue";
import {expect} from "chai";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/controls/backForward/components/FullScreen.vue", () => {
    it("renders the fullScreen buttons", () => {
        const wrapper = mount(FullScreen, {localVue});

        expect(wrapper.find(".fullscreen-button").exists()).to.be.true;
        expect(wrapper.findAll("button")).to.have.length(1);
    });
});
