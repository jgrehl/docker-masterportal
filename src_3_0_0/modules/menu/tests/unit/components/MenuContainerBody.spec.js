import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import MenuContainerBody from "../../../components/MenuContainerBody.vue";
import {expect} from "chai";
import MenuNavigation from "../../../navigation/components/MenuNavigation.vue";
import MenuContainerBodyItems from "../../../components/MenuContainerBodyItems.vue";
import sinon from "sinon";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/menu/MenuContainerBody.vue", () => {
    let store;
    const sampleConfigObject = {name: "awesomeName"};

    beforeEach(() => {
        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Menu: {
                    namespaced: true,
                    getters: {
                        componentsAlwaysActivated: () => [{
                            menuSide: "secondaryMenu",
                            module: {
                                name: "GetFeatureInfo",
                                template: "<span />"
                            }
                        }],
                        componentFromPath: () => () => ({}),
                        deactivateModule: () => () => false,
                        objectFromPath: () => () => sampleConfigObject,
                        deactivateGfi: () => sinon.stub(),
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
                    },
                    modules: {
                        Navigation: {
                            namespaced: true,
                            getters: {
                                lastEntry: () => () => null
                            }
                        }
                    }
                }
            }
        });
    });
    describe("mainMenu", () => {
        it("renders the component and it contains the MenuNavigation", () => {
            const wrapper = shallowMount(MenuContainerBody, {store, localVue, propsData: {side: "mainMenu"}}),
                mainMenuBodyWrapper = wrapper.find("#mp-body-mainMenu");

            expect(mainMenuBodyWrapper.exists()).to.be.true;
            expect(mainMenuBodyWrapper.findComponent(MenuNavigation).exists()).to.be.true;
        });

        it("it contains an equal number of MenuContainerBodyItems and configured sections", () => {
            const sectionCount = 5;
            let wrapper = null,
                mainMenuBodyWrapper = null;

            for (let i = 1; i <= sectionCount; i++) {
                store.commit("Menu/addTestMenuSection", [{}]);
            }

            wrapper = shallowMount(MenuContainerBody, {store, localVue, propsData: {side: "mainMenu"}});
            mainMenuBodyWrapper = wrapper.find("#mp-body-mainMenu");

            expect(mainMenuBodyWrapper.findAllComponents(MenuContainerBodyItems).length).to.be.equal(sectionCount);
        });
    });
    describe("secondaryMenu", () => {
        it("renders the component and it contains the MenuNavigation", () => {
            const wrapper = shallowMount(MenuContainerBody, {store, localVue, propsData: {side: "secondaryMenu"}}),
                mainMenuBodyWrapper = wrapper.find("#mp-body-secondaryMenu");

            expect(mainMenuBodyWrapper.exists()).to.be.true;
            expect(mainMenuBodyWrapper.findComponent(MenuNavigation).exists()).to.be.true;
        });

        it("it contains an equal number of MenuContainerBodyItems and configured sections", () => {
            const sectionCount = 3;
            let wrapper = null,
                mainMenuBodyWrapper = null;

            for (let i = 1; i <= sectionCount; i++) {
                store.commit("Menu/addTestMenuSection", [{}]);
            }

            wrapper = shallowMount(MenuContainerBody, {store, localVue, propsData: {side: "secondaryMenu"}});
            mainMenuBodyWrapper = wrapper.find("#mp-body-secondaryMenu");

            expect(mainMenuBodyWrapper.findAllComponents(MenuContainerBodyItems).length).to.be.equal(sectionCount);
        });
    });
    describe("GetFeatureInfo", () => {
        it("render the GetFeatureInfo component", () => {
            const wrapper = shallowMount(MenuContainerBody, {
                store,
                localVue,
                propsData: {side: "secondaryMenu"}
            });

            expect(wrapper.findComponent({name: "GetFeatureInfo"}).exists()).to.be.true;
        });
    });
});
