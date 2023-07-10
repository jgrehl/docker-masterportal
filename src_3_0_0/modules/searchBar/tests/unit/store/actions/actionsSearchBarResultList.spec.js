import actions from "../../../../store/actions/actionsSearchBarResultList";
import rawLayerList from "@masterportal/masterportalapi/src/rawLayerList";
import {expect} from "chai";
import sinon from "sinon";

const {
    addSingleSearchResult,
    addSingleSearchResultToTopicTree,
    addSelectedSearchResultToTopicTree
} = actions;

describe("src_3_0_0/modules/searchBar/store/actions/actionsSearchBarResultList.js", () => {
    let commit,
        getters,
        dispatch;

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
    it("addSingleSearchResultToTopicTree has a commit and dipatch", () => {

        addSingleSearchResultToTopicTree({dispatch, commit}, {});

        expect(dispatch.calledOnce).to.be.true;
        expect(dispatch.args[0]).includes("addSingleSearchResult");
        expect(commit.args[0]).includes("setSearchResultsActive");
    });
    it("addSingleSearchResultToTopicTree has 3 commits and dipatch", () => {
        getters = {
            selectedSearchResults: [{}]
        };

        addSelectedSearchResultToTopicTree({getters, dispatch, commit});

        expect(dispatch.calledOnce).to.be.true;
        expect(dispatch.args[0]).includes("addSingleSearchResult");
        expect(commit.calledThrice).to.be.true;
    });
});
