import Vuex from "vuex";
import {config, mount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";

import DetachedTemplate from "../../../components/GetFeatureInfoDetached.vue";

const localVue = createLocalVue();

config.mocks.$t = key => key;
localVue.use(Vuex);

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
            showMarker: () => sinon.stub(),
            highlightVectorRules: () => highlightVectorRules,
            currentFeature: () => sinon.stub()
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
        store = new Vuex.Store({
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
                        removeHighlightFeature: sinon.stub(),
                        highlightFeature: sinon.stub(),
                        setCenter: sinon.stub()
                    },
                    getters: {
                        clickCoordinate: sinon.stub()
                    }
                },
                MapMarker: {
                    namespaced: true,
                    actions: {
                        removePointMarker: sinon.stub(),
                        placingPointMarker: sinon.stub()
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
                    template: "<span />"
                }
            },
            computed: {
                styleAll: () => [{
                    "right": ""
                }],
                styleContent: () => [{
                    "max-width": "",
                    "max-height": ""
                }]
            },
            store: store,
            localVue
        });

        expect(wrapper.find("span").text()).to.be.equal("Hallo");
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
            computed: {
                styleAll: () => [{
                    "right": ""
                }],
                styleContent: () => [{
                    "max-width": "",
                    "max-height": ""
                }]
            },
            store: store,
            localVue
        });

        expect(wrapper.findComponent({name: "DefaultTheme"}).exists()).to.be.true;
    });

    it("should render the footer slot within .gfi-footer", () => {
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
                slots: {
                    footer: "<div class=\"gfi-footer\">Footer</div>"
                },
                store: store,
                localVue
            }),
            footer = wrapper.find(".gfi-footer");

        expect(footer.text()).to.be.equal("Footer");
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
            store: store,
            localVue
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
            store: store,
            localVue
        });

        expect(wrapper.vm.isContentHtml).to.be.false;
    });

});
