import actions from "../../../../store/actions/actionsSearchBar";
import {expect} from "chai";
import sinon from "sinon";

const {
    updateSearchNavigation
} = actions;

describe("src_3_0_0/modules/searchBar/store/actions/actionsSearchBar.js", () => {
    let commit,
        getters,
        rootGetters;

    beforeEach(() => {
        rootGetters = {};
        commit = sinon.spy();
    });

    describe("updateSearchNavigation", () => {
        it("it updates the search navigation", () => {
            getters = {
                currentSide: "mainMenu",
                searchInput: "Test",
                minCharacters: "3",
                showAllResults: true,
                searchResultsActive: undefined
            };
            rootGetters["Menu/currentComponent"] = () => {
                return {
                    type: "searchbar"
                };
            };

            updateSearchNavigation({getters, rootGetters, commit}, "mainMenu");

            expect(commit.calledThrice).to.be.true;
            expect(commit.firstCall.args[0]).to.eql("setShowAllResults");
            expect(commit.firstCall.args[1]).to.be.false;
            expect(commit.secondCall.args[0]).to.eql("Menu/setCurrentComponentPropsName");
            expect(commit.secondCall.args[1]).to.deep.eql({side: "mainMenu", name: "common:modules.searchBar.searchResultList"});
            expect(commit.thirdCall.args[0]).to.eql("Menu/setNavigationHistoryBySide");
            expect(commit.thirdCall.args[1]).to.deep.eql({side: "mainMenu", newHistory: [{type: "root", props: []}]});
        });
        it("other side: it switches to previous component", () => {
            getters = {
                currentSide: "NotMainMenu",
                searchInput: "Test",
                minCharacters: "3",
                showAllResults: true,
                searchResultsActive: undefined
            };
            rootGetters["Menu/currentComponent"] = () => {
                return {
                    type: "searchbar"
                };
            };

            updateSearchNavigation({getters, rootGetters, commit}, "mainMenu");

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.eql("Menu/switchToPreviousComponent");
            expect(commit.firstCall.args[1]).to.eql("mainMenu");
        });

        it("currentComponent is not searchbar, side is mainMenu: it switches to previous component", () => {
            getters = {
                currentSide: "mainMenu",
                searchInput: "Test",
                minCharacters: "3",
                showAllResults: true,
                searchResultsActive: undefined
            };
            rootGetters["Menu/currentComponent"] = () => {
                return {
                    type: "layerSelection"
                };
            };

            updateSearchNavigation({getters, rootGetters, commit}, "mainMenu");

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.eql("Menu/switchToPreviousComponent");
            expect(commit.firstCall.args[1]).to.eql("mainMenu");
        });
    });
});
