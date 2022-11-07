import Vuex from "vuex";
import {config, mount, createLocalVue} from "@vue/test-utils";
import MenuFolder from "../../../components/MenuFolder.vue";
import {expect} from "chai";
import sinon from "sinon";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/menu/MenuFolder.vue", () => {
    let store;
    const sampleConfigObject = {elements: [{name: "itemOne", icon: "bi-icon"}, {name: "itemTwo", icon: "bi-icon"}]},
        sampleMainMenuPath = ["mainMenu", "sections", 0, 1];


    beforeEach(() => {

        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Menu: {
                    namespaced: true,
                    getters: {
                        section: () => () => sampleConfigObject
                    }
                }
            }
        });
    });

    afterEach(sinon.restore);

    it("renders the heading", () => {
        const wrapper = mount(MenuFolder, {store, localVue, propsData: {idAppendix: "mainMenu", name: "awesomeFolder", path: sampleMainMenuPath}});

        expect(wrapper.findAll("h4")).to.have.length(1);
    });
});
