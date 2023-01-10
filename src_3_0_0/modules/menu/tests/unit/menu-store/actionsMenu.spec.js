import {expect} from "chai";
import sinon from "sinon";
import {nextTick} from "vue";
import actions from "../../../menu-store/actionsMenu";

describe.skip("src_3_0_0/modules/menu/menu-store/actionsMenu.js", () => {
    let consoleError, commit, dispatch;

    beforeEach(() => {
        commit = sinon.spy();
        dispatch = sinon.spy();
        consoleError = sinon.spy();
        sinon.stub(console, "error").callsFake(consoleError);
    });

    afterEach(sinon.restore);

    describe("mergeMenuState", () => {
        it("should set merged mainMenu and secondaryMenu and reset Navigation/entries", () => {
            const state = {
                    mainMenu: {
                        initiallyOpen: false,
                        title: null,
                        toggleButtonIcon: "bi-list",
                        sections: []
                    },
                    secondaryMenu: {
                        initiallyOpen: false,
                        sections: [],
                        title: null,
                        toggleButtonIcon: "bi-tools"
                    }
                },
                mainMenu = {
                    initiallyOpen: true,
                    sections: [
                        [
                            {
                                type: "abc"
                            }
                        ]
                    ]
                },
                secondaryMenu = {
                    initiallyOpen: true,
                    sections: [
                        [
                            {
                                type: "xyz"
                            }
                        ]
                    ]
                };

            actions.mergeMenuState({commit, state}, {mainMenu, secondaryMenu});

            expect(commit.calledThrice).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("setMainMenu");
            expect(commit.firstCall.args[1]).to.equals(Object.assign(state.mainMenu, mainMenu));
            expect(commit.secondCall.args[0]).to.equals("setSecondaryMenu");
            expect(commit.secondCall.args[1]).to.equals(Object.assign(state.secondaryMenu, secondaryMenu));
            expect(commit.thirdCall.args[0]).to.equals("Navigation/setEntries");
            expect(commit.thirdCall.args[1]).to.deep.equals({
                mainMenu: [],
                secondaryMenu: []
            });
        });
    });

    describe("activateMenuNavigation", () => {
        it("should add navigation entry and set activeModuleMouseMapInteractions", () => {
            const getters = {
                    secondaryMenu: {
                        sections: [
                            [
                                {
                                    type: "exampleModule"
                                }
                            ]
                        ]
                    }
                },
                side = "secondaryMenu",
                module = {
                    type: "exampleModule"
                };

            actions.activateMenuNavigation({commit, dispatch, getters}, {side, module});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("Menu/Navigation/addEntry");
            expect(commit.firstCall.args[1]).to.deep.equals(["secondaryMenu", "sections", 0, 0]);

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("setActiveModuleMouseMapInteractions");
            expect(dispatch.firstCall.args[1]).to.deep.equals({
                type: "exampleModule",
                isActive: true
            });
        });
    });

    describe("deactivateMenuElements", () => {
        it("should deactivate all modules, expect folder and given module", () => {
            const getters = {
                    secondaryMenu: {
                        sections: [
                            [
                                {
                                    type: "exampleModule"
                                },
                                {
                                    type: "abc"
                                },
                                {
                                    type: "xyz"
                                },
                                {
                                    type: "folder"
                                }
                            ]
                        ]
                    }
                },
                side = "secondaryMenu",
                module = {
                    type: "exampleModule"
                };

            actions.deactivateMenuElements({dispatch, getters}, {side, module});

            expect(dispatch.calledTwice).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("setElementActive");
            expect(dispatch.firstCall.args[1]).to.deep.equals({
                moduleNamespace: "Abc",
                isActive: false
            });
            expect(dispatch.secondCall.args[0]).to.equals("setElementActive");
            expect(dispatch.secondCall.args[1]).to.deep.equals({
                moduleNamespace: "Xyz",
                isActive: false
            });
        });
    });

    describe("clickedMenuElement", () => {
        const path = ["generic"];
        let element, focus, getElementById, getters, section;

        beforeEach(() => {
            focus = sinon.spy();
            getElementById = sinon.fake.returns({focus});
            sinon.stub(document, "getElementById").callsFake(getElementById);
            element = {};
            section = sinon.fake.returns(element);
            getters = {section};
        });

        it("log an error if the menu element with the given path does not have an type", () => {
            actions.clickedMenuElement({commit, dispatch, getters}, path);

            expect(section.calledOnce).to.be.true;
            expect(section.firstCall.args.length).to.equal(1);
            expect(section.firstCall.args[0]).to.equal(path);
            expect(commit.notCalled).to.be.true;
            expect(dispatch.notCalled).to.be.true;
            expect(consoleError.calledOnce).to.be.true;
            expect(consoleError.firstCall.args.length).to.equal(1);
            expect(consoleError.firstCall.args[0]).to.equal("Menu: A menu entry is missing the required value \"type\".");
        });
        it("should commit the path for the element and dispatch an action to activate the element if it's not a folder", async () => {
            element.type = "genericElement";
            actions.clickedMenuElement({commit, dispatch, getters}, path);

            expect(section.calledOnce).to.be.true;
            expect(section.firstCall.args.length).to.equal(1);
            expect(section.firstCall.args[0]).to.equal(path);
            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args.length).to.equal(3);
            expect(commit.firstCall.args[0]).to.equal("Menu/Navigation/addEntry");
            expect(commit.firstCall.args[1]).to.equal(path);
            expect(commit.firstCall.args[2]).to.eql({root: true});
            nextTick(() => {
                expect(dispatch.calledOnce).to.be.true;
                expect(dispatch.firstCall.args.length).to.equal(2);
                expect(dispatch.firstCall.args[0]).to.equal("setElementActive");
                expect(dispatch.firstCall.args[1]).to.eql({moduleNamespace: "GenericElement", isActive: true});
                expect(consoleError.notCalled).to.be.true;
            });
        });
        it("should commit the path for the element and focus the first sub-element if it's a folder", async () => {
            element.type = "folder";
            actions.clickedMenuElement({commit, dispatch, getters}, path);

            expect(section.calledOnce).to.be.true;
            expect(section.firstCall.args.length).to.equal(1);
            expect(section.firstCall.args[0]).to.equal(path);
            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args.length).to.equal(3);
            expect(commit.firstCall.args[0]).to.equal("Menu/Navigation/addEntry");
            expect(commit.firstCall.args[1]).to.equal(path);
            expect(commit.firstCall.args[2]).to.eql({root: true});
            expect(dispatch.notCalled).to.be.true;
            expect(consoleError.notCalled).to.be.true;
            nextTick(() => {
                expect(getElementById.calledOnce).to.be.true;
                expect(getElementById.firstCall.args.length).to.equal(1);
                expect(getElementById.firstCall.args[0]).to.equal(`menu-offcanvas-body-items-element-0-${path[0]}`);
                expect(focus.calledOnce).to.be.true;
                expect(focus.firstCall.args.length).to.equal(0);
            });
        });
    });

    describe("mergeMenuState", () => {
        it("should merge the configured menu with the state menu", () => {
            const state = {
                    mainMenu: {
                        sections: [[]]
                    },
                    secondaryMenu: {
                        sections: [[]]
                    }
                },
                mainMenu = {
                    expanded: false,
                    sections: [
                        [
                            {
                                type: "exampleModuleMain"
                            }
                        ]
                    ]
                },
                secondaryMenu = {
                    expanded: false,
                    sections: [
                        [
                            {
                                type: "exampleModuleMain"
                            }
                        ]
                    ]
                };

            actions.mergeMenuState({commit, state}, {mainMenu, secondaryMenu});

            expect(commit.calledThrice).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("setMainMenu");
            expect(commit.firstCall.args[1]).to.deep.equals(mainMenu);
            expect(commit.secondCall.args[0]).to.equals("setSecondaryMenu");
            expect(commit.secondCall.args[1]).to.deep.equals(secondaryMenu);
            expect(commit.thirdCall.args[0]).to.equals("Navigation/setEntries");
            expect(commit.thirdCall.args[1]).to.deep.equals({
                mainMenu: [],
                secondaryMenu: []
            });
        });
    });

    describe("resetMenu", () => {
        it("should reset menu navigation and deactivate menu elements", () => {
            const side = "secondaryMenu",
                module = {
                    type: "exampleModule"
                };

            actions.resetMenu({commit, dispatch}, {side, module});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("Navigation/setEntry");
            expect(commit.firstCall.args[1]).to.equals("secondaryMenu");

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("deactivateMenuElements");
            expect(dispatch.firstCall.args[1]).to.deep.equals({side, module});
        });
    });

    describe("setElementActive", () => {
        const isActive = true,
            moduleNamespace = "ModuleName",
            functionName = `Modules/${moduleNamespace}/setActive`;
        let context;

        beforeEach(() => {
            context = {
                _actions: {}
            };
        });

        it("should dispatch the setActive action if it is present for the given moduleNamespace", () => {
            context._actions[functionName] = Symbol("I'm a setActive action!");
            const setElementActive = actions.setElementActive.bind(context);

            setElementActive({commit, dispatch}, {moduleNamespace, isActive});

            expect(dispatch.calledTwice).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equal("setActiveModuleMouseMapInteractions");
            expect(dispatch.firstCall.args[1]).to.deep.equal({
                type: "ModuleName",
                isActive: true
            });
            expect(dispatch.secondCall.args.length).to.equal(3);
            expect(dispatch.secondCall.args[0]).to.equal(functionName);
            expect(dispatch.secondCall.args[1]).to.equal(isActive);
            expect(dispatch.secondCall.args[2]).to.eql({root: true});
            expect(commit.notCalled).to.be.true;
        });
        it("should commit the setActive mutation if no setActive action is present for the given moduleNamespace", () => {
            const setElementActive = actions.setElementActive.bind(context);

            setElementActive({commit, dispatch}, {moduleNamespace, isActive});

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equal("setActiveModuleMouseMapInteractions");
            expect(dispatch.firstCall.args[1]).to.deep.equal({
                type: "ModuleName",
                isActive: true
            });
            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args.length).to.equal(3);
            expect(commit.firstCall.args[0]).to.equal(functionName);
            expect(commit.firstCall.args[1]).to.equal(isActive);
            expect(commit.firstCall.args[2]).to.eql({root: true});
        });
    });

    describe("setMenuBackAndActivateItem", () => {
        it("should reset menu, start menu navigation and deactivate menu elements", () => {
            const menuItem = {
                side: "secondaryMenu",
                module: {
                    type: "exampleModule"
                }
            };

            actions.setMenuBackAndActivateItem({dispatch}, menuItem);

            expect(dispatch.calledThrice).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("resetMenu");
            expect(dispatch.firstCall.args[1]).to.deep.equals(menuItem);
            expect(dispatch.secondCall.args[0]).to.equals("activateMenuNavigation");
            expect(dispatch.secondCall.args[1]).to.deep.equals(menuItem);
            expect(dispatch.thirdCall.args[0]).to.equals("setElementActive");
            expect(dispatch.thirdCall.args[1]).to.deep.equals({
                moduleNamespace: "ExampleModule",
                isActive: true
            });
        });
    });
});
