import {createStore} from "vuex";
import {config, mount} from "@vue/test-utils";
import MenuNavigation from "../../../components/MenuNavigation.vue";
import {expect} from "chai";
import mutations from "../../../menu-store/mutationsMenu.js";
import state from "../../../menu-store/stateMenu.js";
import sinon from "sinon";

config.global.mocks.$t = key => key;

describe.skip("src_3_0_0/core/menu/navigation/components/MenuNavigation.vue", () => {
    let store, navigateBackSpy;
    const sampleMainMenuPath = ["mainMenu", "sections", 0, 1, "elements", 0],
        sampleConfigObject = {name: "awesomeName"},
        mockAlertingActions = {
            addSingleAlert: sinon.stub()
        };


    beforeEach(() => {
        navigateBackSpy = sinon.spy();

        store = createStore({
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
                        },
                        Alerting: {
                            namespaced: true,
                            actions: mockAlertingActions

                        }
                    }
                }
            }
        });
    });

    afterEach(sinon.restore);

    it("renders the navigation in the main menu side", () => {
        const wrapper = mount(MenuNavigation, {global: {
            plugins: [store]
        }, propsData: {side: "mainMenu"}});

        expect(wrapper.find("#mp-navigation-mainMenu").exists()).to.be.true;
    });

    it("renders the navigation in the secondary menu side", () => {
        const wrapper = mount(MenuNavigation, {global: {
            plugins: [store]
        }, propsData: {side: "secondaryMenu"}});

        expect(wrapper.find("#mp-navigation-secondaryMenu").exists()).to.be.true;
    });

    it("calls the navigateBack function every time the navigation is clicked", async () => {
        const wrapper = mount(MenuNavigation, {global: {
                plugins: [store]
            }, propsData: {side: "mainMenu"}}),
            navigation = wrapper.find("#mp-navigation-mainMenu");

        navigation.trigger("click");
        await wrapper.vm.$nextTick();
        expect(navigateBackSpy.calledOnce).to.be.true;

        navigation.trigger("click");
        await wrapper.vm.$nextTick();
        expect(navigateBackSpy.calledTwice).to.be.true;
    });
});
