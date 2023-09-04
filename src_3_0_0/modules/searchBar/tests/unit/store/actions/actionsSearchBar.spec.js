import actions from "../../../../store/actions/actionsSearchBar";
import {expect} from "chai";
import sinon from "sinon";

const {
    updateSearchNavigation
} = actions;

describe("src_3_0_0/modules/searchBar/store/actions/actionsSearchBar.js", () => {
    let commit,
        getters,
        rootState;

    beforeEach(() => {
        commit = sinon.spy();
    });

    it("it updates the search navigation", () => {
        getters = {
            currentSide: "mainMenu",
            searchInput: "Test",
            minCharacters: "3",
            showAllResults: true,
            searchResultsActive: undefined
        };
        rootState = {
            "Menu": {
                "currentComponent": {props: [], name: ""},
                "mainMenu": {
                    "navigation": {
                        "history": [],
                        "currentComponent": {props: {name: "xxx"}}
                    }
                }
            }
        };

        updateSearchNavigation({getters, commit, rootState}, "mainMenu");


        expect(commit.calledOnce).to.be.true;
        expect(commit.firstCall.args[0]).to.eql("setShowAllResults");
        expect(commit.firstCall.args[1]).to.be.false;
        expect(rootState.Menu.mainMenu.navigation.history).to.deep.eql([{type: "root", props: []}]);
        expect(rootState.Menu.mainMenu.navigation.currentComponent.props.name).to.deep.eql("common:modules.searchBar.searchResultList");
    });
});
