import {createStore} from "vuex";
import {config, mount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";

import DetachedTemplate from "../../../components/GetFeatureInfoDetached.vue";

config.global.mocks.$t = key => key;
config.global.mocks.$gfiThemeAddons = [];

describe("src_3_0_0/modules/getFeatureInfo/components/GetFeatureInfoDetached.vue", () => {
    const highlightVectorRules = {
            image: {
                scale: 10
            },
            fill: sinon.stub(),
            stroke: sinon.stub()
        },
        mockMutations = {
            setCurrentFeature: () => sinon.stub(),
            setShowMarker: () => sinon.stub()
        },
        mockGetters = {
            centerMapToClickPoint: () => sinon.stub(),
            currentFeature: () => sinon.stub(),
            menuSide: () => sinon.stub(),
            highlightVectorRules: () => highlightVectorRules,
            showMarker: () => sinon.stub()
        },
        olFeature = new Feature({
            name: "feature123"
        });

    olFeature.setId("feature1");
    olFeature.setGeometry(new Point([10, 10]));

    let store;

    before(() => {
        mapCollection.clear();
        const map = {
            id: "ol",
            mode: "2D"
        };

        mapCollection.addMap(map, "2D");
    });

    beforeEach(() => {
        store = createStore({
            namespaced: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        GetFeatureInfo: {
                            namespaced: true,
                            mutations: mockMutations,
                            getters: mockGetters
                        }
                    }
                },
                Maps: {
                    namespaced: true,
                    actions: {
                        placingPointMarker: sinon.stub(),
                        removeHighlightFeature: sinon.stub(),
                        removePointMarker: sinon.stub(),
                        highlightFeature: sinon.stub(),
                        setCenter: sinon.stub()
                    },
                    getters: {
                        clickCoordinate: sinon.stub()
                    }
                },
                Menu: {
                    namespaced: true,
                    actions: {
                        setMenuBackAndActivateItem: sinon.stub()
                    }
                }
            }
        });
    });

    it("should have a title", () => {
        const wrapper = mount(DetachedTemplate, {
            propsData: {
                feature: {
                    getTheme: () => "Default",
                    getTitle: () => "Hallo",
                    getMimeType: () => "text/xml",
                    getGfiUrl: () => "",
                    getLayerId: () => sinon.stub(),
                    getOlFeature: () => olFeature
                }
            },
            components: {
                DefaultTheme: {
                    name: "DefaultTheme",
                    template: "<div />"
                }
            },
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find("div").text()).to.be.equal("Hallo");
    });

    it("should have the child component default (-Theme)", () => {
        const wrapper = mount(DetachedTemplate, {
            propsData: {
                feature: {
                    getTheme: () => "default",
                    getTitle: () => "Hallo",
                    getMimeType: () => "text/xml",
                    getGfiUrl: () => "",
                    getLayerId: () => sinon.stub(),
                    getOlFeature: () => olFeature
                }
            },
            components: {
                DefaultTheme: {
                    name: "DefaultTheme",
                    template: "<span />"
                }
            },
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.findComponent({name: "DefaultTheme"}).exists()).to.be.true;
    });

    it("should set 'isContentHtml' to true", async () => {
        const wrapper = mount(DetachedTemplate, {
            propsData: {
                feature: {
                    getTheme: () => "default",
                    getTitle: () => "Hallo",
                    getMimeType: () => "text/html",
                    getGfiUrl: () => "http",
                    getLayerId: () => sinon.stub(),
                    getOlFeature: () => olFeature
                }
            },
            components: {
                DefaultTheme: {
                    name: "DefaultTheme",
                    template: "<span />"
                }
            },
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.vm.isContentHtml).to.be.true;
    });

    it("should not set 'isContentHtml' to true", async () => {
        const wrapper = mount(DetachedTemplate, {
            propsData: {
                feature: {
                    getTheme: () => "DefaultTheme",
                    getTitle: () => "Hallo",
                    getMimeType: () => "text/xml",
                    getGfiUrl: () => "",
                    getLayerId: () => sinon.stub(),
                    getOlFeature: () => olFeature
                }
            },
            components: {
                DefaultTheme: {
                    name: "DefaultTheme",
                    template: "<span />"
                }
            },
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.vm.isContentHtml).to.be.false;
    });

});
