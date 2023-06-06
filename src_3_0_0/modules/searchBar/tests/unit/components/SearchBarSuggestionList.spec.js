import {createStore} from "vuex";
import {config, mount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import SearchBarSuggestionListComponent from "../../../components/SearchBarSuggestionList.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/searchBar/components/SearchBarSuggestionList.vue", () => {
    let store,
        wrapper;
    const searchResults = [
            {
                "category": "Straße",
                "id": "BeidemNeuenKrahnStraße",
                "index": 0,
                "name": "Bei dem Neuen Krahn",
                "searchInterfaceId": "gazetteer",
                "displayedInfo": "",
                "icon": "bi-signpost",
                "imagePath": "",
                "toolTip": "",
                "events": {
                }

            },
            {
                "category": "Adresse",
                "id": "BeidemNeuenKrahn2Adresse",
                "index": 1,
                "name": "Bei dem Neuen Krahn 2",
                "searchInterfaceId": "gazetteer",
                "displayedInfo": "",
                "icon": "bi-signpost",
                "imagePath": "",
                "toolTip": "",
                "events": {
                }
            }
        ],
        searchInterfaces = {
            "gazetteer": {
                "serviceId": "6",
                "searchAddress": true,
                "searchStreets": true,
                "searchHouseNumbers": true,
                "searchDistricts": true,
                "searchParcels": true,
                "searchStreetKey": true
            }
        },
        minCharacters = 3,
        searchInput = "Neuenfelder";


    beforeEach(() => {
        store = createStore({
            namespaced: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        SearchBar: {
                            namespaced: true,
                            actions: {
                                instantiateSearchInterfaces: sinon.stub(),
                                overwriteDefaultValues: sinon.stub(),
                                search: sinon.stub()
                            },
                            getters: {
                                minCharacters: () => minCharacters,
                                searchInput: () => searchInput,
                                searchResults: () => searchResults,
                                searchSuggestions: () => [],
                                searchInterfaces: () => searchInterfaces

                            }
                        }
                    }
                }
            }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("startSearch", () => {
        it("renders the SearchBarSuggestionList", async () => {
            wrapper = await mount(SearchBarSuggestionListComponent, {
                global: {
                    plugins: [store]
                }
            });
            expect(wrapper.find("#search-bar-suggestion-list").exists()).to.be.true;
            expect(wrapper.find(".showAllSection").exists()).to.be.true;
        });
        it("tests the computed property SearchBarSuggestionList", async () => {
            wrapper = await mount(SearchBarSuggestionListComponent, {
                global: {
                    plugins: [store]
                }
            });
            expect(wrapper.vm.limitedSortedSearchResults).to.deep.equal({availableCategories: ["Straße", "Adresse"], "StraßeCount": 1, AdresseCount: 1});
        });
    });
});
