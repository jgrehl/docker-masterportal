import Vuex from "vuex";
import {config, createLocalVue, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import StartModuleComponent from "../../../components/StartModule.vue";
import sinon from "sinon";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/controls/startModule/components/StartModule.vue", () => {
    let activateMenuNavigationSpy = sinon.spy(),
        resetMenuSpy = sinon.spy(),
        setActiveSpy = sinon.spy(),
        store;

    beforeEach(() => {
        activateMenuNavigationSpy = sinon.spy();
        resetMenuSpy = sinon.spy();
        setActiveSpy = sinon.spy();

        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Controls: {
                    namespaced: true,
                    modules: {
                        StartModule: {
                            namespaced: true,
                            getters: {
                                mainMenu: () => [],
                                secondaryMenu: () => [{
                                    type: "selectFeatures"
                                },
                                {
                                    type: "scaleSwitcher"
                                }]
                            }
                        }
                    }
                },
                Modules: {
                    namespaced: true,
                    modules: {
                        SelectFeatures: {
                            namespaced: true,
                            state: {
                                name: "SelectFeatures",
                                type: "selectFeatures"
                            },
                            mutations: {
                                setActive: setActiveSpy
                            }
                        },
                        ScaleSwitcher: {
                            namespaced: true,
                            state: {
                                name: "ScaleSwitcher",
                                type: "scaleSwitcher"
                            }
                        }
                    }
                },
                Menu: {
                    namespaced: true,
                    actions: {
                        activateMenuNavigation: activateMenuNavigationSpy,
                        resetMenu: resetMenuSpy
                    }
                }
            }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("render control", () => {
        it("should render the control", () => {
            const wrapper = shallowMount(StartModuleComponent, {store, localVue});

            expect(wrapper.find("div#start-module-button").exists()).to.be.true;
        });
    });

    describe("getValidToolStates", () => {
        it("should return the valid modules", () => {
            const wrapper = shallowMount(StartModuleComponent, {store, localVue});

            expect(wrapper.vm.configuredModuleStates.length).equals(2);
            expect(Object.keys(wrapper.vm.configuredModuleStates[0].state)).to.be.an("array").that.includes(
                "name", "type", "alwaysActivated", "isVisibleInMenu", "menuSide"
            );
            expect(Object.keys(wrapper.vm.configuredModuleStates[1].state)).to.be.an("array").that.includes(
                "name", "type", "alwaysActivated", "isVisibleInMenu", "menuSide"
            );
        });
    });

    describe("onClick", () => {
        it("should reset meu and activate menu navigation, if module is active === false", () => {
            const wrapper = shallowMount(StartModuleComponent, {store, localVue});

            wrapper.vm.onClick({
                active: false,
                type: "selectFeatures"
            }, "secondaryMenu");

            expect(resetMenuSpy.calledOnce).to.be.true;
            expect(resetMenuSpy.firstCall.args[1]).to.deep.equals({
                side: "secondaryMenu",
                module: {
                    type: "SelectFeatures"
                }
            });
            expect(activateMenuNavigationSpy.calledOnce).to.be.true;
            expect(resetMenuSpy.firstCall.args[1]).to.deep.equals({
                side: "secondaryMenu",
                module: {
                    type: "SelectFeatures"
                }
            });
            expect(setActiveSpy.calledOnce).to.be.true;
            expect(setActiveSpy.firstCall.args[1]).to.be.true;
        });

        it("should reset meu and don't activate menu navigation, if module is active === true", () => {
            const wrapper = shallowMount(StartModuleComponent, {store, localVue});

            wrapper.vm.onClick({
                active: true,
                type: "selectFeatures"
            }, "secondaryMenu");

            expect(resetMenuSpy.calledOnce).to.be.true;
            expect(resetMenuSpy.firstCall.args[1]).to.deep.equals({
                side: "secondaryMenu",
                module: {
                    type: "SelectFeatures"
                }
            });
            expect(activateMenuNavigationSpy.notCalled).to.be.true;
            expect(setActiveSpy.calledOnce).to.be.true;
            expect(setActiveSpy.firstCall.args[1]).to.be.false;
        });
    });
});
