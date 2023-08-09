import actions from "../../../../store/actions/actionsSearchBarSearchInterfaces";
import {expect} from "chai";
import sinon from "sinon";

const {
    cleanSearchResults,
    instantiateSearchInterfaces,
    startSearch,
    search
} = actions;

describe("src_3_0_0/modules/searchBar/store/actions/actionsSearchBarSearchInterfaces.js", () => {
    let commit,
        dispatch;

    beforeEach(() => {
        commit = sinon.spy();
        dispatch = sinon.spy();
    });

    describe("instantiateSearchInterfaces", () => {
        it("should instantiate the gazetteer search interface", () => {
            const state = {
                searchInterfaces: [
                    {
                        type: "gazetteer",
                        serviceId: "8",
                        searchAddress: true,
                        searchStreets: true,
                        searchHouseNumbers: true,
                        searchDistricts: true,
                        searchParcels: true,
                        searchStreetKey: true
                    }
                ]
            };

            instantiateSearchInterfaces({state, commit});

            expect(commit.calledOnce).to.be.true;
            expect(commit.args[0]).includes("addSearchInterfaceInstances");
        });

        it("should instantiate the gazetter and addons search interfaces", () => {
            const state = {
                    searchInterfaces: [
                        {
                            type: "abc",
                            serviceid: "100"
                        },
                        {
                            type: "gazetteer",
                            serviceId: "8",
                            searchAddress: true,
                            searchStreets: true,
                            searchHouseNumbers: true,
                            searchDistricts: true,
                            searchParcels: true,
                            searchStreetKey: true
                        }
                    ]
                },
                searchInterfaceAddons = [{
                    abc: sinon.stub()
                }];

            instantiateSearchInterfaces({state, commit}, searchInterfaceAddons);

            expect(commit.calledTwice).to.be.true;
            expect(commit.args[0]).includes("addSearchInterfaceInstances");
            expect(commit.args[0]).includes("addSearchInterfaceInstances");
        });
    });

    describe("startSearch", () => {
        it("should start search to abc-straße", () => {
            const state = {
                searchInput: "abc-straße",
                minCharacters: 3
            };

            startSearch({dispatch, state});

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.equals("search");
            expect(dispatch.firstCall.args[1]).to.deep.equals({
                searchInput: "abc-straße"
            });
        });
    });

    describe("search", () => {
        it("should search in configured search instances", async () => {
            const state = {
                    searchInterfaceInstances: [{
                        clearSearchResults: sinon.spy(),
                        search: async (searchInput) => [searchInput]
                    }]
                },
                searchInput = "Test",
                searchType = "result";

            await search({commit, dispatch, state}, {searchInput, searchType});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).equals("addSearchResults");
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).equals("cleanSearchResults");
        });
    });

    describe("cleanSearchResults", () => {
        it("should set the searchResults to empty arrays", () => {
            cleanSearchResults({commit});

            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).equals("setSearchResults");
            expect(commit.firstCall.args[1]).to.be.an("array").that.is.empty;
        });
    });
});
