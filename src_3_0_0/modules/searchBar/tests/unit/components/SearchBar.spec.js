import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";

import SearchBarComponent from "../../../components/SearchBar.vue";
import SearchBar from "../../../store/indexSearchBar";

config.global.mocks.$t = key => key;

describe("src/modules/searchBar/components/SearchBar.vue", () => {
    const mockConfigJson = {
        Portalconfig: {
            searchBar: {
                id: "searchBar",
                placeholder: "common:modules.searchbar.placeholder.address"
            }
        }
    };
    let store,
        wrapper;

    beforeEach(() => {
        store = createStore({
            namespaced: true,
            modules: {
                namespaced: true,
                modules: {
                    SearchBar
                }
            },
            state: {
                configJson: mockConfigJson
            }
        });
    });

    it("renders the SearchBar", () => {
        wrapper = shallowMount(SearchBarComponent, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find("#search-bar").exists()).to.be.true;
    });
});
