import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import MenuContainerBody from "../../MenuContainerBody.vue";
import {expect} from "chai";
import MenuNavigation from "../../navigation/components/MenuNavigation.vue";
import MenuContainerBodyItems from "../../MenuContainerBodyItems.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/core/menu/MenuContainerBody.vue", () => {
    let store;
    const sampleConfigObject = {title: "awesomeTitle"};

    beforeEach(() => {

        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Menu: {
                    namespaced: true,
                    getters: {
                        objectFromPath: () => () => sampleConfigObject,
                        componentFromPath: () => () => ({}),
                        mainMenu: state => ({
                            sections: state.menuSections
                        }),
                        secondaryMenu: state => ({
                            sections: state.menuSections
                        })
                    },
                    state: {
                        menuSections: []
                    },
                    mutations: {
                        addTestMenuSection: (state, section) => {
                            state.menuSections.push(section);
                        }
                    }
                },
                MenuNavigation: {
                    namespaced: true,
                    getters: {
                        lastEntry: () => () => null
                    }
                }
            }
        });
    });
    describe("mainMenu", () => {
        it("renders the component and it contains the MenuNavigation", () => {
            const wrapper = shallowMount(MenuContainerBody, {store, localVue, propsData: {side: "mainMenu"}}),
                mainMenuBodyWrapper = wrapper.find("#menu-offcanvas-body-mainMenu");

            expect(mainMenuBodyWrapper.exists()).to.be.true;
            expect(mainMenuBodyWrapper.findComponent(MenuNavigation).exists()).to.be.true;
        });

        it("it contains an equal number of MenuContainerBodyItems and configured sections", () => {
            const sectionCount = 5;

            for (let i = 1; i <= sectionCount; i++) {
                store.commit("Menu/addTestMenuSection", [{}]);
            }

            // eslint-disable-next-line one-var
            const wrapper = shallowMount(MenuContainerBody, {store, localVue, propsData: {side: "mainMenu"}}),
                mainMenuBodyWrapper = wrapper.find("#menu-offcanvas-body-mainMenu");

            expect(mainMenuBodyWrapper.findAllComponents(MenuContainerBodyItems).length).to.be.equal(sectionCount);
        });
    });
    describe("secondaryMenu", () => {
        it("renders the component and it contains the MenuNavigation", () => {
            const wrapper = shallowMount(MenuContainerBody, {store, localVue, propsData: {side: "secondaryMenu"}}),
                mainMenuBodyWrapper = wrapper.find("#menu-offcanvas-body-secondaryMenu");

            expect(mainMenuBodyWrapper.exists()).to.be.true;
            expect(mainMenuBodyWrapper.findComponent(MenuNavigation).exists()).to.be.true;
        });

        it("it contains an equal number of MenuContainerBodyItems and configured sections", () => {
            const sectionCount = 3;

            for (let i = 1; i <= sectionCount; i++) {
                store.commit("Menu/addTestMenuSection", [{}]);
            }

            // eslint-disable-next-line one-var
            const wrapper = shallowMount(MenuContainerBody, {store, localVue, propsData: {side: "secondaryMenu"}}),
                mainMenuBodyWrapper = wrapper.find("#menu-offcanvas-body-secondaryMenu");

            expect(mainMenuBodyWrapper.findAllComponents(MenuContainerBodyItems).length).to.be.equal(sectionCount);
        });
    });
});
