import actions from "../../../../store/actions/actionsSearchBar";
import {expect} from "chai";
import sinon from "sinon";

const {
    startSearch
} = actions;

describe("src_3_0_0/modules/searchBar/store/actions/actionsSearchBar.js", () => {
    let commit,
        getters,
        dispatch,
        rootState;

    beforeEach(() => {
        commit = sinon.spy();
        dispatch = sinon.spy();
    });

    it("starts the search with searchinput > mincharacter", () => {
        getters = {
            currentSide: "mainMenu",
            searchInput: "Test",
            minCharacters: "3",
            searchResultsActive: undefined
        };
        rootState = {
            "Menu": {
                "currentComponent": "",
                "mainMenu": {
                    "currentComponent": "",
                    "navigation": {
                        "history": []
                    }
                }
            }
        };

        startSearch({getters, dispatch, commit, rootState});

        expect(dispatch.calledTwice).to.be.true;
        expect(commit.calledTwice).to.be.true;
        expect(dispatch.firstCall.args[0]).to.eql("search");
        expect(dispatch.firstCall.args[1]).to.deep.eql({searchInput: getters.searchInput});
        expect(dispatch.secondCall.args[0]).to.eql("Menu/clickedMenuElement");
        expect(dispatch.secondCall.args[1]).to.deep.eql({
            name: "common:modules.searchBar.searchResultList",
            side: "mainMenu",
            type: "searchbarresultlist"
        });
        expect(commit.firstCall.args[0]).to.eql("setShowAllResults");
        expect(commit.firstCall.args[1]).to.be.false;
        expect(commit.secondCall.args[0]).to.eql("setSearchResultsActive");
        expect(commit.secondCall.args[1]).to.be.true;
        expect(rootState.Menu.mainMenu.navigation.history[0]).to.to.deep.eql({0: {type: "root", props: []}});
    });
    it("it navigates the menu back with searchinput < mincharacter and search is active", () => {
        getters = {
            currentSide: "mainMenu",
            searchInput: "Test",
            minCharacters: "5",
            searchResultsActive: true
        };
        rootState = {
            "Menu": {
                "currentComponent": "",
                "mainMenu": {
                    "currentComponent": "",
                    "navigation": {
                        "history": []
                    }
                }
            }
        };

        startSearch({getters, dispatch, commit, rootState});

        expect(dispatch.calledOnce).to.be.true;
        expect(dispatch.firstCall.args[0]).to.eql("Menu/navigateBack");
        expect(dispatch.firstCall.args[1]).to.eql("mainMenu");

    });
});
