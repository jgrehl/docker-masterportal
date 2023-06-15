import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import SearchBarComponent from "../../../components/SearchBar.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/searchBar/components/SearchBar.vue", () => {
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
                                startSearch: sinon.stub()
                            },
                            getters: {
                                configPaths: () => [],
                                minCharacters: () => 3,
                                placeholder: () => "ABC",
                                searchInput: () => "abc-straße",
                                searchResults: () => [],
                                type: () => "searchBar"
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
            const startSearchSpy = sinon.spy(wrapper.vm, "startSearch");

            await wrapper.find("#search-button").trigger("click");

            expect(startSearchSpy.calledOnce).to.be.true;
        });
    });
});
