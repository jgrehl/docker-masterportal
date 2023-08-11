import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import SearchBarComponent from "../../../components/SearchBar.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/searchBar/components/SearchBar.vue", () => {
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
        searchInterfaceInstances = [
            {
                "searchInterfaceId": "gazetteer"
            }
        ];
    let store,
        wrapper;


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
                                configPaths: () => [],
                                minCharacters: () => 3,
                                placeholder: () => "ABC",
                                searchInput: () => "abc-straße",
                                searchInterfaceInstances: () => searchInterfaceInstances,
                                searchResults: () => searchResults,
                                showAllResults: () => false,
                                suggestionListLength: () => 0,
                                type: () => "searchBar"
                            },
                            mutations: {
                                addSuggestionItem: sinon.stub(),
                                setSearchInput: sinon.stub(),
                                setShowAllResults: sinon.stub(),
                                setSearchResultsActive: sinon.stub(),
                                setSearchSuggestions: sinon.stub()
                            }
                        }
                    }
                }
            },
            actions: {
                initializeModule: sinon.stub()
            }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("render SearchBar", () => {
        it("should render the SearchBar with button and input", () => {
            wrapper = shallowMount(SearchBarComponent, {
                global: {
                    plugins: [store]
                }
            });

            expect(wrapper.find("#search-bar").exists()).to.be.true;
            expect(wrapper.find("#search-button").exists()).to.be.true;
            expect(wrapper.find("input").exists()).to.be.true;
        });
    });

    describe("click button", () => {
        it("should start search to abc-straße, if button is clicked", async () => {
            wrapper = shallowMount(SearchBarComponent, {
                global: {
                    plugins: [store]
                }
            });

            const startSearchSpy = sinon.spy(wrapper.vm, "startSearch");

            await wrapper.find("#search-button").trigger("click");

            expect(startSearchSpy.calledOnce).to.be.true;
        });
    });

    describe("limitedSortedSearchResults", () => {
        it("tests the computed property SearchBarSuggestionList", async () => {
            wrapper = await shallowMount(SearchBarComponent, {
                global: {
                    plugins: [store]
                }
            });

            expect(wrapper.vm.limitedSortedSearchResults.results).to.deep.equal({
                categoryProvider: {
                    Straße: "gazetteer",
                    Adresse: "gazetteer"
                },
                availableCategories: ["Straße", "Adresse"],
                StraßeCount: 1,
                AdresseCount: 1,
                AdresseIcon: "bi-signpost",
                StraßeIcon: "bi-signpost"
            });
        });
    });
});
