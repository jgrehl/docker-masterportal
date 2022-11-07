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
    const mockConfigJson = {
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
        wrapper;

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
                        ShareView: {
                            namespaced: true,
                            getters: {
                                url: sinon.stub()
                            }
                        }
                    }
                },
                Maps: {
                    namespaced: true,
                    getters: {
                        getView: sinon.stub()
                    },
                    actions: {}
                }
            },
            state: {
                configJson: mockConfigJson
            },
            getters: {
                visibleLayerConfigs: sinon.stub(),
                isMobile: sinon.stub()
            }
        });

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
