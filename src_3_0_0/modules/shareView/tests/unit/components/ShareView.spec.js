import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import ShareViewComponent from "../../../components/ShareView.vue";
import ShareView from "../../../store/indexShareView";
import {expect} from "chai";
import sinon from "sinon";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/shareView/components/ShareView.vue", () => {
    const mockMapGetters = {
            zoom: sinon.stub(),
            center: sinon.stub()
        },
        mockConfigJson = {
            Portalconfig: {
                navigationSecondary: {
                    sections: [
                        {
                            shareView: {
                                "title": "Share",
                                "icon": "bi-share",
                                "itemType": "shareView"
                            }
                        }
                    ]
                }
            }
        };
    let defaultState,
        store,
        wrapper,
        rootGetters;

    before(() => {
        defaultState = {...ShareView.state};
    });

    beforeEach(() => {
        mapCollection.clear();

        store = new Vuex.Store({
            namespaces: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        ShareView
                    }
                },
                Maps: {
                    namespaced: true,
                    getters: mockMapGetters,
                    actions: {}
                }
            },
            state: {
                configJson: mockConfigJson
            }
        });

        rootGetters = {
            visibleLayerConfigs: [
                {
                    id: "1",
                    visibility: "true",
                    transparency: "0"
                },
                {
                    id: "2",
                    visibility: "true",
                    transparency: "50"
                }
            ],
            "Maps/center": [123, 456],
            "Maps/zoom": "7"
        };

    });

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
    });

    after(() => {
        ShareView.state = defaultState;
    });

    it("renders the shareView component", () => {
        wrapper = shallowMount(ShareViewComponent, {store, localVue});

        expect(wrapper.find("#share-view").exists()).to.be.true;
    });


});
