import {createStore} from "vuex";
import {config, mount} from "@vue/test-utils";
import MenuFolder from "../../../components/MenuFolder.vue";
import {expect} from "chai";
import sinon from "sinon";

config.global.mocks.$t = key => key;

describe.skip("src_3_0_0/modules/menu/MenuFolder.vue", () => {
    let store, wrapper;
    const sampleConfigObject = [{name: "itemOne", icon: "bi-icon"}, {name: "itemTwo", icon: "bi-icon"}],
        sampleMainMenuPath = ["mainMenu", "sections", 0, 1];


    beforeEach(() => {
        store = createStore({
            namespaces: true,
            modules: {
                Menu: {
                    namespaced: true,
                    getters: {
                        section: () => () => sampleConfigObject
                    }
                },
                Maps: {
                    namespaced: true,
                    getters: {
                        mode: () => "2D"
                    }
                }
            },
            getters: {
                deviceMode: () => "Desktop",
                portalConfig: () => sinon.stub()
            }
        });
    });


    afterEach(sinon.restore);

    it("renders the heading", () => {
        wrapper = mount(MenuFolder, {global: {
            plugins: [store]
        }, propsData: {idAppendix: "mainMenu", name: "awesomeFolder", path: sampleMainMenuPath}});

        expect(wrapper.findAll("h4")).to.have.length(1);
    });
});
