import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import MenuContainerBodyElement from "../../MenuContainerBodyElement.vue";
import {expect} from "chai";
import SimpleButton from "../../../../sharedComponents/SimpleButton.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/core/menu/MenuContainerBodyElement.vue", () => {
    it("renders the component and it contains the SimpleButton", () => {
        const wrapper = shallowMount(MenuContainerBodyElement, {localVue, propsData: {icon: "bi-file-plus", title: "awesomeTitle"}});

        expect(wrapper.findComponent(SimpleButton).exists()).to.be.true;
    });
});
