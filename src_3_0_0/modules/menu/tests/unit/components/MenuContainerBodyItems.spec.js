import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import MenuContainerBodyItems from "../../../components/MenuContainerBodyItems.vue";
import {expect} from "chai";
import MenuContainerBodyElement from "../../../components/MenuContainerBodyElement.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/menu/MenuContainerBodyItems.vue", () => {
    let store;
    const sampleSection = [
        {icon: "bi-test", name: "sampleSectionOne"},
        {icon: "bi-test", name: "sampleSectionTwo"},
        {icon: "bi-test", name: "sampleSectionThree"}
    ];

    beforeEach(() => {
        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Menu: {
                    namespaced: true,
                    getters: {
                        section: state => () => state.testSection
                    },
                    state: {
                        testSection: []
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
        const wrapper = shallowMount(MenuContainerBodyItems, {store, localVue, propsData: {idAppendix: "mainMenu"}});

        expect(wrapper.find("#menu-offcanvas-body-items-mainMenu").exists()).to.be.true;
    });

    it("contains a list element and a MenuContainerBodyElements in the main menu for each configured section item", () => {
        store.commit("Menu/setTestSection", sampleSection);
        const wrapper = shallowMount(MenuContainerBodyItems, {store, localVue, propsData: {idAppendix: "mainMenu"}});

        expect(wrapper.findAll("li").length).to.be.equal(sampleSection.length);
        expect(wrapper.findAllComponents(MenuContainerBodyElement).length).to.be.equal(sampleSection.length);
    });

    it("renders the component as secondary menu", () => {
        const wrapper = shallowMount(MenuContainerBodyItems, {store, localVue, propsData: {idAppendix: "secondaryMenu"}});

        expect(wrapper.find("#menu-offcanvas-body-items-secondaryMenu").exists()).to.be.true;
    });

    it("contains a list element and a MenuContainerBodyElements in the main menu for each configured section item", () => {
        store.commit("Menu/setTestSection", sampleSection);
        const wrapper = shallowMount(MenuContainerBodyItems, {store, localVue, propsData: {idAppendix: "secondaryMenu"}});

        expect(wrapper.findAll("li").length).to.be.equal(sampleSection.length);
        expect(wrapper.findAllComponents(MenuContainerBodyElement).length).to.be.equal(sampleSection.length);
    });
});
