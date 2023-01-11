import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import MenuContainerBody from "../../../components/MenuContainerBody.vue";
import {expect} from "chai";
import MenuNavigation from "../../../components/MenuNavigation.vue";
import MenuContainerBodyRootItems from "../../../components/MenuContainerBodyRootItems.vue";
import sinon from "sinon";

config.global.mocks.$t = key => key;

describe.skip("src_3_0_0/modules/menu/MenuContainerBody.vue", () => {
    let store;
    const sampleConfigObject = {name: "awesomeName"};

    beforeEach(() => {

        store = createStore({
            namespaces: true,
            modules: {
                Menu: {
                    namespaced: true,
                    getters: {
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
                        },
                        addModuleToMenuSection: sinon.stub()
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
            const wrapper = shallowMount(MenuContainerBody, {
                    global: {
                        plugins: [store]
                    },
                    propsData: {side: "mainMenu"}
                }),
                mainMenuBodyWrapper = wrapper.find("#mp-body-mainMenu");

            expect(mainMenuBodyWrapper.exists()).to.be.true;
            expect(mainMenuBodyWrapper.findComponent(MenuNavigation).exists()).to.be.true;
        });

        it("it contains an equal number of MenuContainerBodyRootItems and configured sections", () => {
            const sectionCount = 5;
            let wrapper = null,
                mainMenuBodyWrapper = null;

            for (let i = 1; i <= sectionCount; i++) {
                store.commit("Menu/addTestMenuSection", [{}]);
            }

            wrapper = shallowMount(MenuContainerBody, {
                global: {
                    plugins: [store]
                },
                propsData: {side: "mainMenu"}
            });
            mainMenuBodyWrapper = wrapper.find("#mp-body-mainMenu");

            expect(mainMenuBodyWrapper.findAllComponents(MenuContainerBodyRootItems).length).to.be.equal(sectionCount);
        });
    });
    describe("secondaryMenu", () => {
        it("renders the component and it contains the MenuNavigation", () => {
            const wrapper = shallowMount(MenuContainerBody, {
                    global: {
                        plugins: [store]
                    },
                    propsData: {side: "secondaryMenu"}
                }),
                mainMenuBodyWrapper = wrapper.find("#mp-body-secondaryMenu");

            expect(mainMenuBodyWrapper.exists()).to.be.true;
            expect(mainMenuBodyWrapper.findComponent(MenuNavigation).exists()).to.be.true;
        });

        it("it contains an equal number of MenuContainerBodyRootItems and configured sections", () => {
            const sectionCount = 3;
            let wrapper = null,
                mainMenuBodyWrapper = null;

            for (let i = 1; i <= sectionCount; i++) {
                store.commit("Menu/addTestMenuSection", [{}]);
            }

            wrapper = shallowMount(MenuContainerBody, {
                global: {
                    plugins: [store]
                },
                propsData: {side: "secondaryMenu"}
            });
            mainMenuBodyWrapper = wrapper.find("#mp-body-secondaryMenu");

            expect(mainMenuBodyWrapper.findAllComponents(MenuContainerBodyRootItems).length).to.be.equal(sectionCount);
        });
    });
    describe("GetFeatureInfo", () => {
        it("render the GetFeatureInfo component", () => {
            const wrapper = shallowMount(MenuContainerBody, {
                global: {
                    plugins: [store]
                },
                propsData: {side: "secondaryMenu"}
            });

            expect(wrapper.findComponent({name: "GetFeatureInfo"}).exists()).to.be.true;
        });
    });
});
