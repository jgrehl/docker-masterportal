import SearchInterface from "../../../searchInterfaces/searchInterface.js";
import {expect} from "chai";
import axios from "axios";
import sinon from "sinon";

describe("src/modules/searchBar/searchInterfaces/searchInterface.js", () => {
    let SearchInterface1 = null;

    before(() => {
        SearchInterface1 = new SearchInterface();
    });

    afterEach(() => {
        SearchInterface1.clearSearchResults();
    });

    describe("createPossibleActions", () => {
        it("should throw an error if function 'createPossibleActions' is uses in SearchInterface", () => {
            expect(SearchInterface1.search).to.throw();
        });
    });

    describe("normalizeResults", () => {
        it("should throw an error if function 'normalizeResults' is uses in SearchInterface", () => {
            expect(SearchInterface1.search).to.throw();
        });
    });

    describe("search", () => {
        it("should throw an error if function 'search' is uses in SearchInterface", () => {
            expect(SearchInterface1.search).to.throw();
        });
    });

    describe("clearSearchResults", () => {
        it("should clear the searchResults array", () => {
            SearchInterface1.searchResults.push("abc");
            SearchInterface1.clearSearchResults();

            expect(SearchInterface1.searchResults).is.an("array").that.is.empty;
        });
    });

    describe("pushHitsToSearchResults", () => {
        beforeEach(() => {
            SearchInterface1.searchResults = [];
        });

        it("should push two to searchResults", () => {
            SearchInterface1.pushHitsToSearchResults([{id: "abc"}, {id: "def"}]);

            expect(SearchInterface1.totalHits).equals(2);
            expect(SearchInterface1.searchResults.length).equals(2);
            expect(SearchInterface1.searchResults[0].id).equals("abc");
            expect(SearchInterface1.searchResults[1].id).equals("def");
        });
    });

    describe("pushHitToSearchResults", () => {
        beforeEach(() => {
            SearchInterface1.searchResults = [];
        });

        it("should push one hit with id '123' to searchResults", () => {
            SearchInterface1.pushHitToSearchResults({id: "123"});

            expect(SearchInterface1.searchResults.length).equals(1);
            expect(SearchInterface1.searchResults[0].id).equals("123");
        });
    });

    describe("requestSearch", () => {
        it("should send a get request", async () => {
            const urlMock = "/testUrl",
                responseMock = {test: 123},
                axiosMock = sinon.stub(axios, "get").resolves(responseMock);

            await SearchInterface1.requestSearch(urlMock);

            expect(axiosMock.calledOnce).to.be.true;
            expect(axiosMock.args[0][0]).to.equals(urlMock);
        });
    });

    describe("resultEventsToObject", () => {
        it("should convert result events to an object structure", () => {
            const resultEvents = {
                onClick: ["setMarker", "zoomToFeature"],
                onHover: ["setMarker"]
            };

            expect(SearchInterface1.resultEventsToObject(resultEvents)).to.deep.equals({
                onClick: {
                    setMarker: {},
                    zoomToFeature: {}
                },
                onHover: {
                    setMarker: {}
                }
            });
        });
    });
});
