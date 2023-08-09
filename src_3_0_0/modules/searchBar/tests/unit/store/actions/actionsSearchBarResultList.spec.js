import actions from "../../../../store/actions/actionsSearchBarResultList";
import rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";
import {expect} from "chai";
import sinon from "sinon";

const {
    addSingleSearchResult,
    addSingleSearchResultToTopicTree,
    addSelectedSearchResultToTopicTree,
    updateSearchNavigation
} = actions;

describe("src_3_0_0/modules/searchBar/store/actions/actionsSearchBarResultList.js", () => {
    let commit,
        getters,
        dispatch,
        rootState;

    beforeEach(() => {
        commit = sinon.spy();
        dispatch = sinon.spy();
    });

    it("adds the layer if layer was found", () => {
        sinon.stub(rawLayerList, "getLayerWhere").returns({});

        addSingleSearchResult({dispatch}, {id: "123"});

        expect(dispatch.calledOnce).to.be.true;
        expect(dispatch.args[0]).includes("addLayerToLayerConfig");
    });
    it("addSingleSearchResultToTopicTree has a commit and dispatch", () => {

        addSingleSearchResultToTopicTree({dispatch, commit}, {});

        expect(dispatch.calledOnce).to.be.true;
        expect(dispatch.args[0]).includes("addSingleSearchResult");
        expect(commit.args[0]).includes("setSearchResultsActive");
    });
    it("addSingleSearchResultToTopicTree has 3 commits and dispatch", () => {
        getters = {
            selectedSearchResults: [{}]
        };

        addSelectedSearchResultToTopicTree({getters, dispatch, commit});

        expect(dispatch.calledOnce).to.be.true;
        expect(dispatch.args[0]).includes("addSingleSearchResult");
        expect(commit.calledThrice).to.be.true;
    });
    it("updates the search navigation", () => {
        getters = {
            showAllResults: true
        };
        rootState = {
            "Menu": {
                "currentComponent": "",
                "mainMenu": {
                    "currentComponent": {},
                    "navigation": {
                        "history": [],
                        "currentComponent": {
                            "props": {
                                "name": ""
                            }
                        }
                    }
                }
            }
        };

        updateSearchNavigation({getters, commit, rootState}, "mainMenu");

        expect(commit.calledOnce).to.be.true;
        expect(commit.firstCall.args[0]).to.be.eql("setShowAllResults");
        expect(commit.firstCall.args[1]).to.be.false;
        expect(rootState.Menu.mainMenu.navigation.currentComponent.props.name).to.be.eql("common:modules.searchBar.searchResultList");
        expect(rootState.Menu.mainMenu.navigation.history[0]).to.deep.eql({type: "root", props: []});
    });
});
