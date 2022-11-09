import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import MenuContainer from "../../../components/MenuContainer.vue";
import MenuContainerHeader from "../../../components/MenuContainerHeader.vue";
import MenuContainerBody from "../../../components/MenuContainerBody.vue";
import {expect} from "chai";
import sinon from "sinon";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/menu/MenuContainer.vue", () => {
    let store;
    const sampleMainMenuPath = ["mainMenu", "sections", 0, 1, "elements", 0];

    beforeEach(() => {

        store = new Vuex.Store({
            namespaces: true,
            getters: {
                isMobile: (state) => state.isMobile,
                mainMenu: sinon.stub(),
                secondaryMenu: sinon.stub()
            },
            state: {
                isMobile: false
            },
            mutations: {
                setTestIsMobile: (state, value) => {
                    state.isMobile = value;
                }
            },
            modules: {
                Menu: {
                    namespaced: true,
                    getters: {
                        mainMenuExpanded: (state) => state.mainMenuExpanded,
                        secondaryMenuExpanded: (state) => state.secondaryMenuExpanded,
                        titleBySide: () => () => false
                    },
                    state: {
                        mainMenuExpanded: false,
                        secondaryMenuExpanded: false
                    },
                    mutations: {
                        setTestMainMenuExpanded: (state, value) => {
                            state.mainMenuExpanded = value;
                        },
                        setTestSecondaryMenuExpanded: (state, value) => {
                            state.secondaryMenuExpanded = value;
                        }
                    },
                    actions: {
                        mergeMenuState: sinon.stub()
                    }
                },
                MenuNavigation: {
                    namespaced: true,
                    getters: {
                        lastEntry: () => () => sampleMainMenuPath,
                        previousEntry: () => () => sampleMainMenuPath
                    }
                }
            }
        });
    });

    describe("mainMenu", () => {
        it("renders the component but doesnt show it initially and it contains all default elements", () => {
            const wrapper = shallowMount(MenuContainer, {store, localVue, propsData: {side: "mainMenu"}}),
                mainMenuWrapper = wrapper.find("#mp-menu-mainMenu");

            expect(mainMenuWrapper.exists()).to.be.true;
            expect(mainMenuWrapper.findComponent(MenuContainerHeader).exists()).to.be.true;
            expect(mainMenuWrapper.findComponent(MenuContainerBody).exists()).to.be.true;
            expect(wrapper.findAll(".mp-menu-container-handle").length).to.equal(1);
            expect(wrapper.find("#mp-menu-mainMenu").classes()).to.not.contain("show");
        });

        it("opens the menu if initial open is true", () => {
            store.commit("Menu/setTestMainMenuExpanded", true);
            const wrapper = shallowMount(MenuContainer, {store, localVue, propsData: {side: "mainMenu"}});

            expect(wrapper.find("#mp-menu-mainMenu").classes()).to.contain("show");
        });

    });
    describe("secondaryMenu", () => {
        it("renders the component but doesnt show it initially and it contains all default elements", () => {
            const wrapper = shallowMount(MenuContainer, {store, localVue, propsData: {side: "secondaryMenu"}}),
                secondaryMenuWrapper = wrapper.find("#mp-menu-secondaryMenu");

            expect(secondaryMenuWrapper.exists()).to.be.true;
            expect(secondaryMenuWrapper.findComponent(MenuContainerHeader).exists()).to.be.true;
            expect(secondaryMenuWrapper.findComponent(MenuContainerBody).exists()).to.be.true;
            expect(wrapper.findAll(".mp-menu-container-handle").length).to.equal(1);
            expect(wrapper.find("#mp-menu-secondaryMenu").classes()).to.not.contain("show");
        });

        it("opens the menu if initial open is true", () => {
            store.commit("Menu/setTestSecondaryMenuExpanded", true);
            const wrapper = shallowMount(MenuContainer, {store, localVue, propsData: {side: "secondaryMenu"}});

            expect(wrapper.find("#mp-menu-secondaryMenu").classes()).to.contain("show");
        });
    });
});
