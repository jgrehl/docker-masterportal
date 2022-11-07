import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import MenuContainerBodyElement from "../../../components/MenuContainerBodyElement.vue";
import {expect} from "chai";
import SimpleButton from "../../../../../shared/components/SimpleButton.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/menu/MenuContainerBodyElement.vue", () => {
    let store;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Maps: {
                    namespaced: true,
                    getters: {
                        mode: () => "2D"
                    }
                }
            },
            getters: {
                deviceMode: () => "Desktop"
            }
        });
    });
    it("renders the component and it contains the SimpleButton", () => {
        const wrapper = shallowMount(MenuContainerBodyElement, {store, localVue, propsData: {icon: "bi-file-plus", name: "awesomeName"}});

        expect(wrapper.findComponent(SimpleButton).exists()).to.be.true;
    });
});
