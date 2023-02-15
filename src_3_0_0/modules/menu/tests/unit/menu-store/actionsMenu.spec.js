import {expect} from "chai";
import sinon from "sinon";
import {nextTick} from "vue";
import actions from "../../../menu-store/actionsMenu";

describe("src_3_0_0/modules/menu/menu-store/actionsMenu.js", () => {
    let commit,
        dispatch,
        getters,
        state,
        rootGetters;

    beforeEach(() => {
        state = {
            currentMouseMapInteractionsComponent: "getFeatureInfo",
            defaultComponent: "getFeatureInfo",
            mainMenu: {
                expanded: false,
                currentComponent: "root",
                title: null,
                toggleButtonIcon: "bi-list",
                sections: [[]],
                navigation: {
                    currentComponent: {
                        type: "root",
                        props: []
                    },
                    history: []
                }
            },
            secondaryMenu: {
                expanded: false,
                currentComponent: "root",
                sections: [[]],
                title: null,
                toggleButtonIcon: "bi-tools",
                navigation: {
                    currentComponent: {
                        type: "root",
                        props: []
                    },
                    history: []
                }
            }
        };
        commit = sinon.spy();
        dispatch = sinon.spy();
        getters = {
            currentComponent: () => {
                return {
                    type: "abc"
                };
            }
        };
        rootGetters = {
            "Modules/Abc/hasMouseMapInteractions": () => true,
            isMobile: false
        };
        global.window.open = sinon.spy();
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("changeCurrentComponent", () => {
        it("should set current component and change current map interactions component", () => {
            const type = "abc",
                side = "mainMenu",
                props = {
                    name: "common:menu.abc"
                };

            actions.changeCurrentComponent({commit, dispatch, state}, {type, side, props});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("setCurrentComponent");
            expect(commit.firstCall.args[1]).to.deep.equals({type, side, props});
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("changeCurrentMouseMapInteractionsComponent");
            expect(dispatch.firstCall.args[1]).to.deep.equals({type, side});
        });
    });

    describe("changeCurrentMouseMapInteractionsComponent", () => {
        it("should set current map interactions component", () => {
            const type = "abc",
                side = "mainMenu";

            actions.changeCurrentMouseMapInteractionsComponent({commit, rootGetters, state}, {type, side});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("setCurrentMouseMapInteractionsComponent");
            expect(commit.firstCall.args[1]).to.equals(type);
        });

        it("should switch secondaryMenu to root and set current map interactions component", () => {
            const type = "abc",
                side = "mainMenu";

            Object.assign(state, {
                secondaryMenu: {
                    navigation: {
                        currentComponent: {
                            type: "getFeatureInfo",
                            props: {
                                name: "common.gfi"
                            }
                        },
                        history: []
                    }
                }
            });

            actions.changeCurrentMouseMapInteractionsComponent({commit, rootGetters, state}, {type, side});

            expect(commit.calledTwice).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("switchToRoot");
            expect(commit.firstCall.args[1]).to.equals("secondaryMenu");
            expect(commit.secondCall.args[0]).to.equals("setCurrentMouseMapInteractionsComponent");
            expect(commit.secondCall.args[1]).to.equals(type);
        });
    });

    describe("clickedMenuElement", () => {
        const name = "common:abc",
            path = ["generic"],
            side = "mainMenu";
        let type,
            properties;

        it("should change current component without path", () => {
            type = "abc";

            actions.clickedMenuElement({dispatch, rootGetters}, {name, path, side, type});

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("changeCurrentComponent");
            expect(dispatch.firstCall.args[1]).to.deep.equals({type: type, side: side, props: {name: name}});
        });

        it("should change current component with path for type === 'folder'", async () => {
            type = "folder";

            actions.clickedMenuElement({dispatch, rootGetters}, {name, path, side, type});

            await nextTick(() => {
                expect(dispatch.calledOnce).to.be.true;
                expect(dispatch.firstCall.args[0]).to.equals("changeCurrentComponent");
                expect(dispatch.firstCall.args[1]).to.deep.equals({type: type, side: side, props: {path: path, name: name}});
            });
        });

        it("should open new tab if type is 'customMenuElement' and properties contains 'openURL'", () => {
            type = "customMenuElement";
            properties = {
                openURL: "http://url.de"
            };

            actions.clickedMenuElement({dispatch, rootGetters}, {name, path, side, type, properties});

            expect(dispatch.notCalled).to.be.true;
            expect(global.window.open.calledOnce).to.be.true;
            expect(global.window.open.firstCall.args[0]).to.equals(properties.openURL);
        });

        it("should open new tab if type is 'customMenuElement' and properties contains 'openURL' and 'dispatch", () => {
            type = "customMenuElement";
            properties = {
                openURL: "http://url.de",
                dispatch: {
                    action: "Alerting/addSingleAlert",
                    payload: {"title": "An alle Menschen", "content": "Hallo Welt"}
                }
            };

            actions.clickedMenuElement({dispatch, rootGetters}, {name, path, side, type, properties});

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals(properties.dispatch.action);
            expect(dispatch.firstCall.args[1]).to.be.deep.equals(properties.dispatch.payload);
            expect(dispatch.firstCall.args[2]).to.be.deep.equals({root: true});
            expect(global.window.open.calledOnce).to.be.true;
            expect(global.window.open.firstCall.args[0]).to.equals(properties.openURL);
        });

        it("should dispatch action if type is 'customMenuElement' and properties contains only 'dispatch", () => {
            type = "customMenuElement";
            properties = {
                dispatch: {
                    action: "Alerting/addSingleAlert",
                    payload: {"title": "An alle Menschen", "content": "Hallo Welt"}
                }
            };

            actions.clickedMenuElement({dispatch, rootGetters}, {name, path, side, type, properties});

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals(properties.dispatch.action);
            expect(dispatch.firstCall.args[1]).to.be.deep.equals(properties.dispatch.payload);
            expect(dispatch.firstCall.args[2]).to.be.deep.equals({root: true});
        });

        it("mobile: should dispatch action if type is 'customMenuElement' and properties contains only dispatch, closes menu", () => {
            rootGetters.isMobile = true;
            type = "customMenuElement";
            properties = {
                dispatch: {
                    action: "Alerting/addSingleAlert",
                    payload: {"title": "An alle Menschen", "content": "Hallo Welt"}
                }
            };

            actions.clickedMenuElement({dispatch, rootGetters}, {name, path, side, type, properties});

            expect(dispatch.calledTwice).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals(properties.dispatch.action);
            expect(dispatch.firstCall.args[1]).to.be.deep.equals(properties.dispatch.payload);
            expect(dispatch.firstCall.args[2]).to.be.deep.equals({root: true});
            expect(dispatch.secondCall.args[0]).to.equals("Menu/toggleMenu");
            expect(dispatch.secondCall.args[1]).to.equals(side);
            expect(dispatch.secondCall.args[2]).to.be.deep.equals({root: true});
        });

        it("mobile: should dispatch action if type is 'customMenuElement' and properties contains 'openURL', closes menu", () => {
            rootGetters.isMobile = true;
            type = "customMenuElement";
            properties = {
                openURL: "http://url.de"
            };

            actions.clickedMenuElement({dispatch, rootGetters}, {name, path, side, type, properties});

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("Menu/toggleMenu");
            expect(dispatch.firstCall.args[1]).to.equals(side);
            expect(dispatch.firstCall.args[2]).to.be.deep.equals({root: true});
            expect(global.window.open.calledOnce).to.be.true;
            expect(global.window.open.firstCall.args[0]).to.equals(properties.openURL);
        });
    });

    describe("navigateBack", () => {
        const side = "mainMenu";

        it("should switch to previous component", async () => {
            actions.navigateBack({commit, dispatch, getters, state}, side);

            await nextTick(() => {
                expect(commit.calledOnce).to.be.true;
                expect(commit.firstCall.args[0]).to.equals("switchToPreviousComponent");
                expect(commit.firstCall.args[1]).to.equals(side);
                expect(dispatch.notCalled).to.be.true;
            });
        });

        it("should switch to previous component and change current mouse map interactionscomponent'", async () => {
            Object.assign(state, {currentMouseMapInteractionsComponent: "abc"});

            actions.navigateBack({commit, dispatch, getters, state}, side);

            await nextTick(() => {
                expect(commit.calledOnce).to.be.true;
                expect(commit.firstCall.args[0]).to.equals("switchToPreviousComponent");
                expect(commit.firstCall.args[1]).to.equals(side);
                expect(dispatch.calledOnce).to.be.true;
                expect(dispatch.firstCall.args[0]).to.equals("changeCurrentMouseMapInteractionsComponent");
                expect(dispatch.firstCall.args[1]).to.deep.equals({type: state.defaultComponent, side});
            });
        });
    });

    describe("toggleMenu", () => {
        it("should set main menu to expanded === true", () => {
            const side = "mainMenu";

            actions.toggleMenu({commit, rootGetters, state}, side);

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("setExpandedBySide");
            expect(commit.firstCall.args[1]).to.deep.equals({
                expanded: true,
                side
            });
        });
        it("should set secondary menu to expanded === true", () => {
            const side = "secondaryMenu";

            actions.toggleMenu({commit, rootGetters, state}, side);

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("setExpandedBySide");
            expect(commit.firstCall.args[1]).to.deep.equals({
                expanded: true,
                side
            });
        });
        it("should set main menu to expanded === true, if isMobile is true and secodary menu is not expanded === false", () => {
            const side = "secondaryMenu";

            rootGetters.isMobile = true;
            actions.toggleMenu({commit, rootGetters, state}, side);

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("setExpandedBySide");
            expect(commit.firstCall.args[1]).to.deep.equals({
                expanded: true,
                side
            });
        });
        it("should set main menu to expanded === false, if isMobile is true and secodary menu is expanded === true", () => {
            const side = "secondaryMenu";

            state.secondaryMenu.expanded = true;
            rootGetters.isMobile = true;
            actions.toggleMenu({commit, rootGetters, state}, side);

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.equals("setExpandedBySide");
            expect(commit.firstCall.args[1]).to.deep.equals({
                expanded: false,
                side
            });
        });
    });
});
