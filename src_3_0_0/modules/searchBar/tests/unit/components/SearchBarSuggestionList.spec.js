import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";

import SearchBarSuggestionListComponent from "../../../components/SearchBarSuggestionList.vue";
import SearchBar from "../../../store/indexSearchBar";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/searchBar/components/SearchBarSuggestionList.vue", () => {
    const mockConfigJson = {
        Portalconfig: {
            searchBar: {
                id: "searchBar",
                placeholder: "common:modules.searchBar.placeholder.address"
            }
        }
    };
    let store,
        wrapper;

    beforeEach(() => {
        store = createStore({
            namespaced: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        SearchBar
                    }
                }
            },
            state: {
                configJson: mockConfigJson
            }
        });
    });

    it("renders the SearchBarSuggestionList", () => {
        wrapper = shallowMount(SearchBarSuggestionListComponent, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find("#search-bar-suggestion-list").exists()).to.be.true;
    });
});
