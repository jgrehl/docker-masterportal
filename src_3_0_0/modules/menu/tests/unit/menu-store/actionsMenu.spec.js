import {expect} from "chai";
import sinon from "sinon";
import Vue from "vue";
import actions from "../../../menu-store/actionsMenu";

describe("src_3_0_0/modules/menu/menu-store/actionsMenu.js", () => {
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

    describe("addModule", () => {
        it("should add module and return its position in menu navigation", () => {
            const state = {
                    secondaryMenu: {
                        sections: [[0, 1, 2]]
                    }
                },
                moduleState = {
                    type: "getFeatureInfo",
                    menuSide: "secondaryMenu"
                },
                position = actions.addModule({commit, state}, moduleState);

            expect(position).to.equals(2);
            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("addModuleToMenuSection");
            expect(commit.firstCall.args[1]).to.equals(moduleState);
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
            await Vue.nextTick();
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args.length).to.equal(2);
            expect(dispatch.firstCall.args[0]).to.equal("setElementActive");
            expect(dispatch.firstCall.args[1]).to.eql({moduleNamespace: "GenericElement", isActive: true});
            expect(consoleError.notCalled).to.be.true;
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
            await Vue.nextTick();
            expect(getElementById.calledOnce).to.be.true;
            expect(getElementById.firstCall.args.length).to.equal(1);
            expect(getElementById.firstCall.args[0]).to.equal(`menu-offcanvas-body-items-element-0-${path[0]}`);
            expect(focus.calledOnce).to.be.true;
            expect(focus.firstCall.args.length).to.equal(0);
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

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args.length).to.equal(3);
            expect(dispatch.firstCall.args[0]).to.equal(functionName);
            expect(dispatch.firstCall.args[1]).to.equal(isActive);
            expect(dispatch.firstCall.args[2]).to.eql({root: true});
            expect(commit.notCalled).to.be.true;
        });
        it("should commit the setActive mutation if no setActive action is present for the given moduleNamespace", () => {
            const setElementActive = actions.setElementActive.bind(context);

            setElementActive({commit, dispatch}, {moduleNamespace, isActive});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args.length).to.equal(3);
            expect(commit.firstCall.args[0]).to.equal(functionName);
            expect(commit.firstCall.args[1]).to.equal(isActive);
            expect(commit.firstCall.args[2]).to.eql({root: true});
            expect(dispatch.notCalled).to.be.true;
        });
    });
});
