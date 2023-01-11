import {expect} from "chai";
import sinon from "sinon";
import actions from "../../../store/actionsStartModule";

const {
    setConfiguredModuleStates,
    extendModuleState,
    onClick
} = actions;


describe("src_3_0_0/modules/controls/startModule/store/actionsStartModule.js", () => {
    let commit,
        dispatch,
        rootState,
        map;

    beforeEach(() => {
        mapCollection.clear();

        commit = sinon.spy();
        dispatch = sinon.spy();
        rootState = {
            Modules: {
                Abc: {
                    type: "abc"
                },
                Xyz: {
                    type: "xyz"
                }
            }
        };

        map = {
            id: "ol",
            mode: "2D",
            removeLayer: () => sinon.spy()
        };

        mapCollection.addMap(map, "2D");
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("setConfiguredModuleStates", () => {
        it("should set state of the configured modules", () => {
            const menuModels = [
                    {
                        type: "abc"
                    },
                    {
                        type: "xyz"
                    }
                ],
                menuSide = "secondaryMenu";

            setConfiguredModuleStates({commit, dispatch, rootState}, {menuModels, menuSide});

            expect(commit.calledTwice).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("addConfiguredModel");
            expect(commit.firstCall.args[1]).to.deep.equals({
                menuSide: menuSide,
                state: {
                    type: "abc"
                }
            });
            expect(commit.secondCall.args[0]).to.equals("addConfiguredModel");
            expect(commit.secondCall.args[1]).to.deep.equals({
                menuSide: menuSide,
                state: {
                    type: "xyz"
                }
            });

            expect(dispatch.calledTwice).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("extendModuleState");
            expect(dispatch.firstCall.args[1]).to.deep.equals({
                module: {
                    type: "abc"
                },
                menuSide: menuSide
            });
            expect(dispatch.secondCall.args[0]).to.equals("extendModuleState");
            expect(dispatch.secondCall.args[1]).to.deep.equals({
                module: {
                    type: "xyz"
                },
                menuSide: menuSide
            });
        });
    });

    describe("extendModuleState", () => {
        it("should extend the state of the configured module", () => {
            const module = {
                    type: "abc"
                },
                menuSide = "secondaryMenu";

            extendModuleState({rootState}, {module, menuSide});

            expect(commit.notCalled).to.be.true;
            expect(dispatch.notCalled).to.be.true;
            expect(rootState.Modules).to.deep.equals({
                Abc: {
                    type: "abc",
                    isVisibleInMenu: false,
                    menuSide: menuSide
                },
                Xyz: {
                    type: "xyz"
                }
            });
        });
    });

    describe("onClick", () => {
        it("should reset meu and activate menu navigation, if module is active === false", () => {
            const moduleState = {
                    active: false,
                    type: "selectFeatures"
                },
                menuSide = "secondaryMenu";

            onClick({commit, dispatch}, {moduleState, menuSide});

            expect(dispatch.calledTwice).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("Menu/resetMenu");
            expect(dispatch.firstCall.args[1]).to.deep.equals({
                side: "secondaryMenu",
                module: {
                    type: "SelectFeatures"
                }
            });
            expect(dispatch.secondCall.args[0]).to.equals("Menu/activateMenuNavigation");
            expect(dispatch.secondCall.args[1]).to.deep.equals({
                side: "secondaryMenu",
                module: {
                    type: "SelectFeatures"
                }
            });

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("Modules/SelectFeatures/setActive");
            expect(commit.firstCall.args[1]).to.be.true;
        });

        it("should reset meu and don't activate menu navigation, if module is active === true", () => {
            const moduleState = {
                    active: true,
                    type: "selectFeatures"
                },
                menuSide = "secondaryMenu";

            onClick({commit, dispatch}, {moduleState, menuSide});

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("Menu/resetMenu");
            expect(dispatch.firstCall.args[1]).to.deep.equals({
                side: "secondaryMenu",
                module: {
                    type: "SelectFeatures"
                }
            });

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("Modules/SelectFeatures/setActive");
            expect(commit.firstCall.args[1]).to.be.false;
        });
    });
});
