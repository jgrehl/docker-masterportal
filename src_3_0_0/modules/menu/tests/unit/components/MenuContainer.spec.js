import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import MenuContainer from "../../../components/MenuContainer.vue";
import MenuContainerHeader from "../../../components/MenuContainerHeader.vue";
import MenuContainerBody from "../../../components/MenuContainerBody.vue";
import {expect} from "chai";

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
                isMobile: (state) => state.isMobile
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
                        mainInitiallyOpen: (state) => state.mainInitiallyOpen,
                        secondaryInitiallyOpen: (state) => state.secondaryInitiallyOpen,
                        titleBySide: () => () => false
                    },
                    state: {
                        mainInitiallyOpen: false,
                        secondaryInitiallyOpen: false
                    },
                    mutations: {
                        setTestMainInitiallyOpen: (state, value) => {
                            state.mainInitiallyOpen = value;
                        },
                        setTestSecondaryInitiallyOpen: (state, value) => {
                            state.secondaryInitiallyOpen = value;
                        }
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
                mainMenuWrapper = wrapper.find("#menu-offcanvas-mainMenu");

            expect(mainMenuWrapper.exists()).to.be.true;
            expect(mainMenuWrapper.findComponent(MenuContainerHeader).exists()).to.be.true;
            expect(mainMenuWrapper.findComponent(MenuContainerBody).exists()).to.be.true;
            expect(wrapper.findAll(".menu-container-handle").length).to.equal(1);
            expect(wrapper.find("#menu-offcanvas-mainMenu").classes()).to.not.contain("show");
        });

        it("opens the menu if initial open is true", () => {
            store.commit("Menu/setTestMainInitiallyOpen", true);
            const wrapper = shallowMount(MenuContainer, {store, localVue, propsData: {side: "mainMenu"}});

            expect(wrapper.find("#menu-offcanvas-mainMenu").classes()).to.contain("show");
        });

        it("renders the mobile resize handles if isMobile is true", () => {
            store.commit("setTestIsMobile", true);
            const wrapper = shallowMount(MenuContainer, {store, localVue, propsData: {side: "mainMenu"}});

            expect(wrapper.findAll(".mobile-container-handle").length).to.equal(2);
        });
    });
    describe("secondaryMenu", () => {
        it("renders the component but doesnt show it initially and it contains all default elements", () => {
            const wrapper = shallowMount(MenuContainer, {store, localVue, propsData: {side: "secondaryMenu"}}),
                secondaryMenuWrapper = wrapper.find("#menu-offcanvas-secondaryMenu");

            expect(secondaryMenuWrapper.exists()).to.be.true;
            expect(secondaryMenuWrapper.findComponent(MenuContainerHeader).exists()).to.be.true;
            expect(secondaryMenuWrapper.findComponent(MenuContainerBody).exists()).to.be.true;
            expect(wrapper.findAll(".menu-container-handle").length).to.equal(1);
            expect(wrapper.find("#menu-offcanvas-secondaryMenu").classes()).to.not.contain("show");
        });

        it("opens the menu if initial open is true", () => {
            store.commit("Menu/setTestSecondaryInitiallyOpen", true);
            const wrapper = shallowMount(MenuContainer, {store, localVue, propsData: {side: "secondaryMenu"}});

            expect(wrapper.find("#menu-offcanvas-secondaryMenu").classes()).to.contain("show");
        });

        it("renders both mobile resize handles if isMobile is true", () => {
            store.commit("setTestIsMobile", true);
            const wrapper = shallowMount(MenuContainer, {store, localVue, propsData: {side: "secondaryMenu"}});

            expect(wrapper.findAll(".mobile-container-handle").length).to.equal(2);
        });
    });
});
