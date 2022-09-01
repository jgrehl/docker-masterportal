import Vuex from "vuex";
import {config, mount, createLocalVue} from "@vue/test-utils";
import ControlIcon from "../../ControlIcon.vue";
import {expect} from "chai";
import sinon from "sinon";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/controls/ControlIcon.vue", () => {
    let propsData;

    before(() => {
        propsData = {
            iconName: "iconName",
            disabled: false,
            title: "title",
            onClick: () => sinon.stub(),
            inline: true
        };
    });

    it("renders the ControlIcon button", () => {
        const wrapper = mount(ControlIcon, {propsData, localVue});

        expect(wrapper.find("button").exists()).to.be.true;
        expect(wrapper.find("i").exists()).to.be.true;
    });
});
