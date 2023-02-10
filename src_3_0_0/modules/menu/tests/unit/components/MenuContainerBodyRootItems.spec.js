import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import MenuContainerBodyRootItems from "../../../components/MenuContainerBodyRootItems.vue";
import {expect} from "chai";
import MenuContainerBodyRootItemElement from "../../../components/MenuContainerBodyRootItemElement.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/menu/MenuContainerBodyRootItems.vue", () => {
    let store,
    sections;

    beforeEach(() => {
        sections = [
            {icon: "bi-test", name: "sampleSectionOne"},
            {icon: "bi-test", name: "sampleSectionTwo"},
            {icon: "bi-test", name: "sampleSectionThree"}
        ];
        store = createStore({
            namespaces: true,
            modules: {
                Menu: {
                    namespaced: true,
                    getters: {
                        section: () => sections
                    },
                    mutations: {
                        setTestSection (state, section) {
                            state.testSection = section;
                        }
                    }
                }
            }
        });
    });

    it("renders the component as main menu", () => {
        const wrapper = shallowMount(MenuContainerBodyRootItems, {
            global: {
                plugins: [store]
            },
            propsData: {idAppendix: "mainMenu"}
        });

        expect(wrapper.find("#mp-menu-body-items-mainMenu").exists()).to.be.true;
    });

    it("contains a list element and a MenuContainerBodyRootItemElements in the main menu for each configured section item", () => {
        store.commit("Menu/setTestSection", sampleSection);
        const wrapper = shallowMount(MenuContainerBodyRootItems, {
            global: {
                plugins: [store]
            },
            propsData: {idAppendix: "mainMenu"}
        });


        expect(wrapper.findAll("li").length).to.be.equal(sampleSection.length);
        expect(wrapper.findAllComponents(MenuContainerBodyRootItemElement).length).to.be.equal(sampleSection.length);
    });

    it("renders the component as secondary menu", () => {
        const wrapper = shallowMount(MenuContainerBodyRootItems, {
            global: {
                plugins: [store]
            },
            propsData: {idAppendix: "secondaryMenu"}
        });

        expect(wrapper.find("#mp-menu-body-items-secondaryMenu").exists()).to.be.true;
    });

    it("contains a list element and a MenuContainerBodyRootItemElements in the main menu for each configured section item", () => {
        store.commit("Menu/setTestSection", sampleSection);
        const wrapper = shallowMount(MenuContainerBodyRootItems, {
            global: {
                plugins: [store]
            },
            propsData: {idAppendix: "secondaryMenu"}
        });

        expect(wrapper.findAll("li").length).to.be.equal(sampleSection.length);
        expect(wrapper.findAllComponents(MenuContainerBodyRootItemElement).length).to.be.equal(sampleSection.length);
    });
});
