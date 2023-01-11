import sinon from "sinon";
import {expect} from "chai";
import gettersMenu from "../../../menu-store/gettersMenu";
import stateMenu from "../../../menu-store/stateMenu";
import idx from "../../../../../shared/js/utils/idx";

describe.skip("src_3_0_0/modules/menu/menu-store/gettersMenu.js", () => {
    const component = Symbol("Am component"),
        mainMenuSymbol = Symbol("mainMenu"),
        secondaryMenuSymbol = Symbol("secondaryMenu");
    let consoleErrorSpy,
        getters,
        rootState,
        rootGetters,
        state;

    beforeEach(() => {
        consoleErrorSpy = sinon.spy();
        sinon.stub(console, "error").callsFake(consoleErrorSpy);
        state = {
            mainMenu: mainMenuSymbol,
            secondaryMenu: secondaryMenuSymbol
        };
        getters = {
            mainMenu: null,
            secondaryMenu: null
        };
        rootState = {
            Modules: {
                Measure: {
                    deactivateGfi: true
                },
                ExampleModule: {}
            }
        };
        rootGetters = {
            loadedConfigs: {
                configJson: false
            },
            portalConfig: {
                mainMenu: mainMenuSymbol,
                secondaryMenu: secondaryMenuSymbol
            },
            "Menu/Navigation/lastEntry": sinon.stub()
        };
    });

    afterEach(sinon.restore);

    describe("componentFromPath", () => {
        const type = "component";
        let objectFromPathFake, side;

        beforeEach(() => {
            state = {};
            objectFromPathFake = sinon.fake.returns({type});
            rootGetters = {
                "Modules/componentMap": {component: component}
            };
            getters.objectFromPath = objectFromPathFake;
        });

        it("should return a component from the componentMap if the parameter side equals 'mainMenu'", () => {
            side = "mainMenu";

            expect(gettersMenu.componentFromPath(state, getters, undefined, rootGetters)(side)).to.equal(component);
            expect(objectFromPathFake.calledOnce).to.be.true;
            expect(objectFromPathFake.firstCall.args.length).to.equal(2);
            expect(objectFromPathFake.firstCall.args[0]).to.equal(side);
            expect(objectFromPathFake.firstCall.args[1]).to.equal("last");
        });
        it("should return a component from the componentMap if the parameter side equals 'secondaryMenu'", () => {
            side = "secondaryMenu";

            expect(gettersMenu.componentFromPath(state, getters, undefined, rootGetters)(side)).to.equal(component);
            expect(objectFromPathFake.calledOnce).to.be.true;
            expect(objectFromPathFake.firstCall.args.length).to.equal(2);
            expect(objectFromPathFake.firstCall.args[0]).to.equal(side);
            expect(objectFromPathFake.firstCall.args[1]).to.equal("last");
        });
        it("should return null and log an error if the given side does not equal 'mainMenu' or 'secondaryMenu'", () => {
            side = "newMenu";

            expect(gettersMenu.componentFromPath(state, getters)(side)).to.equal(null);
            expect(objectFromPathFake.notCalled).to.be.true;
            expect(consoleErrorSpy.calledOnce).to.be.true;
            expect(consoleErrorSpy.firstCall.args.length).to.equal(1);
            expect(consoleErrorSpy.firstCall.args[0]).to.equal(`Menu.componentMap: The given menu side ${side} is not allowed. Please use "mainMenu" or "secondaryMenu" instead.`);
        });
    });

    describe("deactivateModule", () => {
        beforeEach(() => {
            state = {
                activeModuleMouseMapInteractions: "GetFeatureInfo"
            };
        });

        it("should return true, if module hasMouseMapInteractions === true and is not equal activeModuleMouseMapInteractions", () => {
            const type = "measure";

            rootGetters = {
                "Modules/Measure/hasMouseMapInteractions": true
            };

            expect(gettersMenu.deactivateModule(state, undefined, undefined, rootGetters)(type)).to.be.true;
        });

        it("should return false, if module hasMouseMapInteractions === false and is not equal activeModuleMouseMapInteractions", () => {
            const type = "measure";

            rootGetters = {
                "Modules/Measure/hasMouseMapInteractions": false
            };

            expect(gettersMenu.deactivateModule(state, undefined, undefined, rootGetters)(type)).to.be.false;
        });
    });

    describe("mainExpanded", () => {
        it("should return false if mainMenu is null", () => {
            state.mainMenu = {
                expanded: false
            };

            expect(gettersMenu.mainExpanded(state)).to.equal(false);
        });
        it("should return false if Expanded is not a boolean set on mainMenu", () => {
            expect(gettersMenu.mainExpanded(stateMenu)).to.equal(false);
        });
        it("should return the value of Expanded if mainMenu is not null (loaded) and is a boolean value on mainMenu", () => {
            state.mainMenu = {expanded: true};

            expect(gettersMenu.mainExpanded(state)).to.equal(true);
        });
    });

    describe("mainTitle", () => {
        it("should return null if mainMenu is null", () => {
            state.mainMenu = {
                title: null
            };

            expect(gettersMenu.mainTitle(state)).to.equal(null);
        });
        it("should return null if title is not defined on mainMenu", () => {
            expect(gettersMenu.mainTitle(stateMenu)).to.equal(null);
        });
        it("should return the title if it is defined on mainMenu", () => {
            const title = {
                "text": "Master",
                "logo": "https://geodienste.hamburg.de/lgv-config/img/hh-logo.png",
                "link": "https://geoinfo.hamburg.de",
                "toolTip": "Landesbetrieb Geoinformation und Vermessung"
            };

            state.mainMenu = {title};

            expect(gettersMenu.mainTitle(state)).to.deep.equal(title);
        });
    });

    describe("mainToggleButtonIcon", () => {
        it("should return the configured icon for the mainMenu if configured", () => {
            const toggleButtonIcon = "bi-bucket";

            state.mainMenu = {toggleButtonIcon};

            expect(gettersMenu.mainToggleButtonIcon(state)).to.equal(toggleButtonIcon);
        });
        it("should return the default icon if it isn't configured on mainMenu", () => {
            expect(gettersMenu.mainToggleButtonIcon(stateMenu)).to.equal("bi-list");
        });
    });

    describe("objectFromPath", () => {
        const foundObject = Symbol("am object"),
            lastEntrySymbol = Symbol("last entry"),
            previousEntrySymbol = Symbol("previous entry");
        let entry, lastEntryFake, previousEntryFake, sectionFake, side;

        beforeEach(() => {
            lastEntryFake = sinon.fake.returns(lastEntrySymbol);
            rootGetters["Menu/Navigation/lastEntry"] = lastEntryFake;
            previousEntryFake = sinon.fake.returns(previousEntrySymbol);
            rootGetters["Menu/Navigation/previousEntry"] = previousEntryFake;
            sectionFake = sinon.fake.returns(foundObject);
            getters.section = sectionFake;
        });

        it("should return the last entry of the menuNavigation for the mainMenu if the respective values are set", () => {
            entry = "last";
            side = "mainMenu";

            expect(gettersMenu.objectFromPath(undefined, getters, undefined, rootGetters)(side, entry)).to.equal(foundObject);
            expect(sectionFake.calledOnce).to.be.true;
            expect(sectionFake.firstCall.args.length).to.equal(1);
            expect(sectionFake.firstCall.args[0]).to.equal(lastEntrySymbol);
            expect(lastEntryFake.calledOnce).to.be.true;
            expect(lastEntryFake.firstCall.args.length).to.equal(1);
            expect(lastEntryFake.firstCall.args[0]).to.equal(side);
            expect(previousEntryFake.notCalled).to.be.true;
        });
        it("should return the previous entry of the menuNavigation for the mainMenu if the respective values are set", () => {
            entry = "previous";
            side = "mainMenu";

            expect(gettersMenu.objectFromPath(undefined, getters, undefined, rootGetters)(side, entry)).to.equal(foundObject);
            expect(sectionFake.calledOnce).to.be.true;
            expect(sectionFake.firstCall.args.length).to.equal(1);
            expect(sectionFake.firstCall.args[0]).to.equal(previousEntrySymbol);
            expect(previousEntryFake.calledOnce).to.be.true;
            expect(previousEntryFake.firstCall.args.length).to.equal(1);
            expect(previousEntryFake.firstCall.args[0]).to.equal(side);
            expect(lastEntryFake.notCalled).to.be.true;
        });
        it("should return the last entry of the menuNavigation for the secondaryMenu if the respective values are set", () => {
            entry = "last";
            side = "secondaryMenu";

            expect(gettersMenu.objectFromPath(undefined, getters, undefined, rootGetters)(side, entry)).to.equal(foundObject);
            expect(sectionFake.calledOnce).to.be.true;
            expect(sectionFake.firstCall.args.length).to.equal(1);
            expect(sectionFake.firstCall.args[0]).to.equal(lastEntrySymbol);
            expect(lastEntryFake.calledOnce).to.be.true;
            expect(lastEntryFake.firstCall.args.length).to.equal(1);
            expect(lastEntryFake.firstCall.args[0]).to.equal(side);
            expect(previousEntryFake.notCalled).to.be.true;
        });
        it("should return the previous entry of the menuNavigation for the secondaryMenu if the respective values are set", () => {
            entry = "previous";
            side = "secondaryMenu";

            expect(gettersMenu.objectFromPath(undefined, getters, undefined, rootGetters)(side, entry)).to.equal(foundObject);
            expect(sectionFake.calledOnce).to.be.true;
            expect(sectionFake.firstCall.args.length).to.equal(1);
            expect(sectionFake.firstCall.args[0]).to.equal(previousEntrySymbol);
            expect(previousEntryFake.calledOnce).to.be.true;
            expect(previousEntryFake.firstCall.args.length).to.equal(1);
            expect(previousEntryFake.firstCall.args[0]).to.equal(side);
            expect(lastEntryFake.notCalled).to.be.true;
        });
        it("should return null and log three error messages if the given side does not equal 'mainMenu' or 'secondaryMenu'", () => {
            entry = "last";
            side = "newMenu";

            expect(gettersMenu.objectFromPath(undefined, getters, undefined, rootGetters)(side, entry)).to.equal(null);
            expect(sectionFake.notCalled).to.be.true;
            expect(lastEntryFake.notCalled).to.be.true;
            expect(previousEntryFake.notCalled).to.be.true;
            expect(consoleErrorSpy.calledThrice).to.be.true;
            expect(consoleErrorSpy.firstCall.args.length).to.equal(1);
            expect(consoleErrorSpy.firstCall.args[0]).to.equal("Menu.objectFromPath: One of the following errors occurred:");
            expect(consoleErrorSpy.secondCall.args.length).to.equal(1);
            expect(consoleErrorSpy.secondCall.args[0]).to.equal(`Menu.objectFromPath: a) The given menu side ${side} is not allowed. Please use "mainMenu" or "secondaryMenu" instead.`);
            expect(consoleErrorSpy.thirdCall.args.length).to.equal(1);
            expect(consoleErrorSpy.thirdCall.args[0]).to.equal(`Menu.objectFromPath: b) The given entry in the navigation ${entry} is not allowed. Please use "last" or "previous" instead.`);
        });
        it("should return null and log three error messages if the given entry does not equal 'last' or 'previous'", () => {
            entry = "middle";
            side = "mainMenu";

            expect(gettersMenu.objectFromPath(undefined, getters, undefined, rootGetters)(side, entry)).to.equal(null);
            expect(sectionFake.notCalled).to.be.true;
            expect(lastEntryFake.notCalled).to.be.true;
            expect(previousEntryFake.notCalled).to.be.true;
            expect(consoleErrorSpy.calledThrice).to.be.true;
            expect(consoleErrorSpy.firstCall.args.length).to.equal(1);
            expect(consoleErrorSpy.firstCall.args[0]).to.equal("Menu.objectFromPath: One of the following errors occurred:");
            expect(consoleErrorSpy.secondCall.args.length).to.equal(1);
            expect(consoleErrorSpy.secondCall.args[0]).to.equal(`Menu.objectFromPath: a) The given menu side ${side} is not allowed. Please use "mainMenu" or "secondaryMenu" instead.`);
            expect(consoleErrorSpy.thirdCall.args.length).to.equal(1);
            expect(consoleErrorSpy.thirdCall.args[0]).to.equal(`Menu.objectFromPath: b) The given entry in the navigation ${entry} is not allowed. Please use "last" or "previous" instead.`);
        });
    });

    describe("secondaryExpanded", () => {
        it("should return false if secondaryMenu is null", () => {
            state.secondaryMenu = {
                expanded: false
            };

            expect(gettersMenu.secondaryExpanded(state)).to.equal(false);
        });
        it("should return false if Expanded is not a boolean set on secondaryMenu", () => {
            expect(gettersMenu.secondaryExpanded(stateMenu)).to.equal(false);
        });
        it("should return the value of Expanded if secondaryMenu is not null (loaded) and is a boolean value on secondaryMenu", () => {
            state.secondaryMenu = {expanded: true};

            expect(gettersMenu.secondaryExpanded(state)).to.equal(true);
        });
    });

    describe("secondaryTitle", () => {
        it("should return null if secondaryMenu is null", () => {
            state.secondaryMenu = {
                title: null
            };

            expect(gettersMenu.secondaryTitle(state)).to.equal(null);
        });
        it("should return null if title is not defined on secondaryMenu", () => {
            getters.secondaryMenu = {};

            expect(gettersMenu.secondaryTitle(stateMenu)).to.equal(null);
        });
        it("should return the title if it is defined on secondaryMenu", () => {
            const title = {
                "text": "Master",
                "logo": "https://geodienste.hamburg.de/lgv-config/img/hh-logo.png",
                "link": "https://geoinfo.hamburg.de",
                "toolTip": "Landesbetrieb Geoinformation und Vermessung"
            };

            state.secondaryMenu = {title};

            expect(gettersMenu.secondaryTitle(state)).to.deep.equal(title);
        });
    });

    describe("secondaryToggleButtonIcon", () => {
        it("should return the configured icon for the secondaryMenu if configured", () => {
            const toggleButtonIcon = "bi-bucket";

            state.secondaryMenu = {toggleButtonIcon};

            expect(gettersMenu.secondaryToggleButtonIcon(state)).to.equal(toggleButtonIcon);
        });
        it("should return the default icon if it isn't configured on secondaryMenu", () => {
            expect(gettersMenu.secondaryToggleButtonIcon(stateMenu)).to.equal("bi-tools");
        });
    });

    describe("section", () => {
        const goodPath = Symbol("woowee we found something");
        let foundSection, path;

        beforeEach(() => {
            foundSection = idx.badPathSymbol;
            path = [];
            sinon.stub(idx, "idx").callsFake(() => foundSection);
        });

        it("should return a found object from the getters through the given path if it exists for mainMenu", () => {
            foundSection = goodPath;
            path.push("mainMenu", "sections", 0);
            getters.mainMenu = {
                sections: [
                    goodPath
                ]
            };

            expect(gettersMenu.section(undefined, getters)(path)).to.equal(goodPath);
            expect(consoleErrorSpy.notCalled).to.be.true;
        });
        it("should return a found object from the getters through the given path if it exists for secondaryMenu", () => {
            foundSection = goodPath;
            path.push("secondaryMenu", "sections", 0);
            getters.secondaryMenu = {
                sections: [
                    goodPath
                ]
            };

            expect(gettersMenu.section(undefined, getters)(path)).to.equal(goodPath);
            expect(consoleErrorSpy.notCalled).to.be.true;
        });
        it("should return null and log an error if the first index of the path ('mainMenu' or 'secondaryMenu') is not null but the idx function return badPathSymbol", () => {
            path.push("mainMenu", "sections", 0);
            getters.mainMenu = {
                sections: [
                    goodPath
                ]
            };

            expect(gettersMenu.section(undefined, getters)(path)).to.equal(null);
            expect(consoleErrorSpy.calledOnce).to.be.true;
            expect(consoleErrorSpy.firstCall.args.length).to.equal(1);
            expect(consoleErrorSpy.firstCall.args[0]).to.equal(`Menu.getters.section: ${idx.badPathSymbol.description} ${path}.`);
        });
        it("should return null and log an error if the first index of the path ('mainMenu' or 'secondaryMenu') is null", () => {
            path.push("mainMenu", "sections", 0);

            expect(gettersMenu.section(undefined, getters)(path)).to.equal(null);
            expect(consoleErrorSpy.calledOnce).to.be.true;
            expect(consoleErrorSpy.firstCall.args.length).to.equal(1);
            expect(consoleErrorSpy.firstCall.args[0]).to.equal(`Menu: The given menu ${path[0]} is not configured in the config.json.`);
        });
    });

    describe("titleBySide", () => {
        const exampleTitle = {
            text: "Precise name",
            logo: "some png source",
            link: "https://valid.url.com",
            toolTip: "More info"
        };

        it("should return the mainTitle properties as well as the side as idAppendix if the side is 'mainMenu' and 'mainTitle' is defined", () => {
            getters.mainTitle = exampleTitle;

            const side = "mainMenu",
                nameObject = gettersMenu.titleBySide(undefined, getters)(side);

            expect(nameObject).to.not.equal(null);
            expect(nameObject.text).to.equal(exampleTitle.text);
            expect(nameObject.logo).to.equal(exampleTitle.logo);
            expect(nameObject.link).to.equal(exampleTitle.link);
            expect(nameObject.toolTip).to.equal(exampleTitle.toolTip);
            expect(nameObject.idAppendix).to.equal(side);
        });
        it("should return the mainTitle properties as well as the side as idAppendix if the side is 'secondaryMenu' and 'secondaryTitle' is defined", () => {
            getters.secondaryTitle = exampleTitle;

            const side = "secondaryMenu",
                nameObject = gettersMenu.titleBySide(undefined, getters)(side);

            expect(nameObject).to.not.equal(null);
            expect(nameObject.text).to.equal(exampleTitle.text);
            expect(nameObject.logo).to.equal(exampleTitle.logo);
            expect(nameObject.link).to.equal(exampleTitle.link);
            expect(nameObject.toolTip).to.equal(exampleTitle.toolTip);
            expect(nameObject.idAppendix).to.equal(side);
        });
        it("should return null if a given side does not have a name defined", () => {
            expect(gettersMenu.titleBySide(undefined, getters)("mainMenu")).to.equal(null);
        });
        it("should return null if a given side does not equal 'mainMenu' or 'secondaryMenu'", () => {
            expect(gettersMenu.titleBySide(undefined, getters)("newMenu")).to.equal(null);
        });
    });
});
