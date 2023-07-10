import mutations from "../../../store/mutationsSearchBar";
import {expect} from "chai";

const {
    addSearchInterfaceInstances,
    addSearchResults,
    addSuggestionItem,
    addSelectedSearchResults,
    removeSelectedSearchResults


} = mutations;

describe("src/modules/searchBar/store/mutationsSearchBar.spec.js", () => {
    describe("addSearchInterfaceInstances", () => {
        it("Should add a given SearchInterface to state", () => {
            const state = {
                    searchInterfaceInstances: []
                },
                searchInterfaceInstance = {
                    searchInterfaceId: "The first instance"
                };

            addSearchInterfaceInstances(state, searchInterfaceInstance);

            expect(state.searchInterfaceInstances).to.deep.equals([searchInterfaceInstance]);
        });
    });

    describe("addSearchResults", () => {
        const searchResults = {
            id: "The first search hit",
            searchInterfaceId: "The first instance"
        };

        it("Should add search hits to state searchResults", () => {
            const state = {
                    searchResults: []
                },
                searchType = "result";

            addSearchResults(state, {searchResults, searchType});

            expect(state.searchResults).to.deep.equals([{
                id: "The first search hit",
                searchInterfaceId: "The first instance"
            }]);
        });
    });

    describe("addSearchItem", () => {
        const item = {"id": "test"};

        it("Should add item to state searchSuggestion", () => {
            const state = {
                searchSuggestions: []
            };

            addSuggestionItem(state, item);

            expect(state.searchSuggestions[0].id).to.deep.equal("test");
        });
    });
});
