import Vuex from "vuex";
import {config, mount, createLocalVue} from "@vue/test-utils";
import MenuNavigation from "../../../components/MenuNavigation.vue";
import {expect} from "chai";
import mutations from "../../../store/mutationsMenuNavigation.js";
import state from "../../../store/stateMenuNavigation.js";
import sinon from "sinon";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/core/menu/navigation/components/MenuNavigation.vue", () => {
    let store, navigateBackSpy;
    const sampleMainMenuPath = ["mainMenu", "sections", 0, 1, "elements", 0],
        sampleConfigObject = {name: "awesomeName"};


    beforeEach(() => {
        navigateBackSpy = sinon.spy();

        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Menu: {
                    namespaced: true,
                    getters: {
                        objectFromPath: () => () => sampleConfigObject
                    },
                    modules: {
                        Navigation: {
                            namespaced: true,
                            actions: {
                                navigateBack: navigateBackSpy
                            },
                            getters: {
                                name: () => () => "awesomeName",
                                lastEntry: () => () => sampleMainMenuPath,
                                previousEntry: () => () => sampleMainMenuPath
                            },
                            mutations,
                            state
                        }
                    }
                }
            }
        });
    });

    afterEach(sinon.restore);

    it("renders the navigation in the main menu side", () => {
        const wrapper = mount(MenuNavigation, {store, localVue, propsData: {side: "mainMenu"}});

        expect(wrapper.find("#menu-offcanvas-body-navigation-mainMenu").exists()).to.be.true;
    });

    it("renders the navigation in the secondary menu side", () => {
        const wrapper = mount(MenuNavigation, {store, localVue, propsData: {side: "secondaryMenu"}});

        expect(wrapper.find("#menu-offcanvas-body-navigation-secondaryMenu").exists()).to.be.true;
    });

    it("calls the navigateBack function every time the navigation is clicked", async () => {
        const wrapper = mount(MenuNavigation, {store, localVue, propsData: {side: "mainMenu"}}),
            navigation = wrapper.find("#menu-offcanvas-body-navigation-mainMenu");

        navigation.trigger("click");
        await wrapper.vm.$nextTick();
        expect(navigateBackSpy.calledOnce).to.be.true;

        navigation.trigger("click");
        await wrapper.vm.$nextTick();
        expect(navigateBackSpy.calledTwice).to.be.true;
    });
});
