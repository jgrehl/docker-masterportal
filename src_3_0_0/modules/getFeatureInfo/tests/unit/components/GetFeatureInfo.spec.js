import {createStore} from "vuex";
import {config, shallowMount, mount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";

import GfiComponent from "../../../components/GetFeatureInfo.vue";

const mockMutations = {
        setCurrentFeature: () => sinon.stub(),
        setGfiFeatures: () => sinon.stub()
    },
    mockGetters = {
        centerMapToClickPoint: () => sinon.stub(),
        currentFeature: () => sinon.stub(),
        desktopType: () => "",
        gfiFeaturesReverse: () => sinon.stub(),
        highlightVectorRules: () => false,
        menuSide: () => false,
        showMarker: () => sinon.stub(),
        visible: () => true,
        type: () => "getFeatureInfo"
    };

config.global.mocks.$t = key => key;
config.global.mocks.$gfiThemeAddons = [];

/**
 * Returns the store.
 * @param {Boolean} mobile true or false
 * @param {String} uiStyle the uiStyle
 * @param {Array} gfiFeatures the features
 * @param {Array} mapSize the maps size
 * @returns {object} the store
 */
function getGfiStore (mobile, uiStyle, gfiFeatures, mapSize) {
    mockGetters.gfiFeaturesReverse = () => gfiFeatures;

    return createStore({
        namespaced: true,
        modules: {
            Modules: {
                namespaced: true,
                modules: {
                    GetFeatureInfo: {
                        namespaced: true,
                        mutations: mockMutations,
                        getters: mockGetters,
                        actions: {
                            addGfiToMenu: sinon.stub(),
                            updateClick: sinon.stub()
                        }
                    }
                }
            },
            Maps: {
                namespaced: true,
                getters: {
                    clickCoordinate: () => sinon.stub(),
                    mode: () => "2D",
                    size: mapSize ? () => mapSize : sinon.stub()
                },
                actions: {
                    placingPointMarker: sinon.stub(),
                    registerListener: sinon.stub(),
                    setCenter: sinon.stub(),
                    unregisterListener: sinon.stub()
                }
            },
            Menu: {
                namespaced: true,
                getters: {
                    currentComponent: () => sinon.stub(),
                    currentMouseMapInteractionsComponent: () => "getFeatureInfo",
                    expanded: () => sinon.stub()
                },
                actions: {
                    setMenuBackAndActivateItem: sinon.stub()
                }
            }
        },
        getters: {
            mobile: () => mobile ? mobile : sinon.stub(),
            gfiWindow: () => "",
            uiStyle: () => uiStyle ? uiStyle : sinon.stub(),
            ignoredKeys: () => sinon.stub()
        }
    });
}


afterEach(() => {
    sinon.restore();
});


describe("src_3_0_0/modules/getFeatureInfo/components/GetFeatureInfo.vue", () => {
    it("should find the child component GetFeatureInfoDetached", () => {
        const gfiFeatures = [{
                getGfiUrl: () => null,
                getFeatures: () => sinon.stub(),
                getProperties: () => {
                    return {};
                }
            }],
            store = getGfiStore(false, "", gfiFeatures, []);
        let wrapper = null;

        wrapper = shallowMount(GfiComponent, {
            components: {
                GetFeatureInfoDetached: {
                    name: "GetFeatureInfoDetached",
                    template: "<span />"
                },
                IconButton: {
                    name: "IconButton",
                    template: "<button>Hier</button>"
                }
            },
            global: {
                components: {
                    GetFeatureInfoDetached: {
                        name: "GetFeatureInfoDetached",
                        template: "<span />"
                    }
                },
                plugins: [store]
            }
        });

        expect(wrapper.findComponent({name: "GetFeatureInfoDetached"}).exists()).to.be.true;
    });

    it("no child component should be found if gfi is not activated", () => {
        const store = getGfiStore(undefined, undefined, null, []),
            wrapper = shallowMount(GfiComponent, {
                components: {
                    GetFeatureInfoDetached: {
                        name: "GetFeatureInfoDetached",
                        template: "<span />"
                    },
                    IconButton: {
                        name: "IconButton",
                        template: "<button>Hier</button>"
                    }
                },
                global: {
                    plugins: [store]
                }
            });

        expect(wrapper.findComponent({name: "GetFeatureInfoDetached"}).exists()).to.be.false;
    });

    it("no child component should be found if gfi has no features", () => {
        const store = getGfiStore(true, undefined, [], []);
        let wrapper = null;

        wrapper = shallowMount(GfiComponent, {
            components: {
                GetFeatureInfoDetached: {
                    name: "GetFeatureInfoDetached",
                    template: "<span />"
                },
                IconButton: {
                    name: "IconButton",
                    template: "<button>Hier</button>"
                }
            },
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.findComponent({name: "GetFeatureInfoDetached"}).exists()).to.be.false;
    });

    it("should set pagerIndex to zero if clickCoordinate change", () => {
        const gfiFeatures = [{
                getGfiUrl: () => null,
                getFeatures: () => sinon.stub(),
                getProperties: () => {
                    return {};
                }
            }],
            store = getGfiStore(false, undefined, gfiFeatures, []);
        let wrapper = null;

        wrapper = shallowMount(GfiComponent, {
            components: {
                GetFeatureInfoDetached: {
                    name: "GetFeatureInfoDetached",
                    template: "<span />"
                },
                IconButton: {
                    name: "IconButton",
                    template: "<button>Hier</button>"
                }
            },
            data () {
                return {
                    pagerIndex: 1
                };
            },
            global: {
                plugins: [store]
            }
        });

        wrapper.vm.$options.watch.clickCoordinate.handler.call(wrapper.vm, null);
        expect(wrapper.vm.pagerIndex).to.equal(0);
    });

    it("should call reset if visible is false", () => {
        const gfiFeatures = [{
                getGfiUrl: () => null,
                getFeatures: () => sinon.stub(),
                getProperties: () => {
                    return {};
                }
            }],
            store = getGfiStore(false, undefined, gfiFeatures, []),
            spyReset = sinon.spy(GfiComponent.methods, "reset");
        let wrapper = null;

        wrapper = shallowMount(GfiComponent, {
            components: {
                GetFeatureInfoDetached: {
                    name: "GetFeatureInfoDetached",
                    template: "<span />"
                },
                IconButton: {
                    name: "IconButton",
                    template: "<button>Hier</button>"
                }
            },
            data () {
                return {
                    pagerIndex: 1
                };
            },
            global: {
                plugins: [store]
            }
        });

        wrapper.vm.$options.watch.visible.call(wrapper.vm, false);
        expect(spyReset.calledOnce).to.be.true;
    });

    it("should display the footer", () => {
        const gfiFeatures = [{
                getTheme: () => "default",
                getTitle: () => "Feature 1",
                getMimeType: () => "text/html",
                getGfiUrl: () => null,
                getMappedProperties: () => null,
                getProperties: () => {
                    return {};
                },
                getlayerId: () => null,
                getFeatures: () => []
            },
            {}],
            store = getGfiStore(true, undefined, gfiFeatures, []);
        let wrapper = null;

        wrapper = mount(GfiComponent, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find(".pager-right").exists()).to.be.true;
    });

    it("should hide left pager if pagerIndex is zero", () => {
        const gfiFeatures = [{
                getTheme: () => "default",
                getTitle: () => "Feature 1",
                getGfiUrl: () => null,
                getMimeType: () => "text/html",
                getAttributesToShow: () => sinon.stub(),
                getProperties: () => {
                    return {};
                },
                getFeatures: () => [],
                attributesToShow: sinon.stub()
            },
            {}],
            store = getGfiStore(true, undefined, gfiFeatures, []);
        let wrapper = null;

        wrapper = mount(GfiComponent, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find(".pager-left").exists()).not.to.be.true;
    });

    it("should enable right pager if pagerIndex is zero", () => {
        const gfiFeatures = [{
                getTheme: () => "default",
                getTitle: () => "Feature 1",
                getGfiUrl: () => null,
                getMimeType: () => "text/html",
                getAttributesToShow: () => sinon.stub(),
                getProperties: () => {
                    return {};
                },
                getFeatures: () => []
            },
            {}],
            store = getGfiStore(true, undefined, gfiFeatures, []);
        let wrapper = null;

        wrapper = mount(GfiComponent, {
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find(".pager-right").exists()).to.be.true;
    });

    it("should hide right pager if pagerIndex === gfiFeatures.length - 1", () => {
        const gfiFeatures = [{}, {
                getTheme: () => "default",
                getTitle: () => "Feature 1",
                getGfiUrl: () => null,
                getMimeType: () => "text/html",
                getMappedProperties: () => null,
                getProperties: () => {
                    return {};
                },
                getFeatures: () => []
            }],
            store = getGfiStore(true, undefined, gfiFeatures, []);
        let wrapper = null;

        wrapper = mount(GfiComponent, {
            data () {
                return {
                    pagerIndex: 1
                };
            },
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find(".pager-right").exists()).not.to.be.true;
    });

    it("should enable left pager if pagerIndex === gfiFeatures.length - 1", () => {
        const gfiFeatures = [{}, {
                getTheme: () => "default",
                getTitle: () => "Feature 1",
                getGfiUrl: () => null,
                getMimeType: () => "text/html",
                getMappedProperties: () => null,
                getProperties: () => {
                    return {};
                },
                getFeatures: () => []
            }],
            store = getGfiStore(true, undefined, gfiFeatures, []);
        let wrapper = null;

        wrapper = mount(GfiComponent, {
            data () {
                return {
                    pagerIndex: 1
                };
            },
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find(".pager-left").exists()).to.be.true;
    });


    it("should enable left pager and right pager if pagerIndex is between zero and gfiFeature.length - 1", () => {
        const gfiFeatures = [{}, {
                getTheme: () => "default",
                getTitle: () => "Feature 1",
                getGfiUrl: () => null,
                getMimeType: () => "text/html",
                getMappedProperties: () => null,
                getProperties: () => sinon.stub(),
                getFeatures: () => sinon.stub()
            }, {}],
            store = getGfiStore(true, undefined, gfiFeatures, []);
        let wrapper = null;

        wrapper = mount(GfiComponent, {
            data () {
                return {
                    pagerIndex: 1
                };
            },
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find(".pager-left").exists()).to.be.true;
        expect(wrapper.find(".pager-right").exists()).to.be.true;
    });

    it("should find a new detached component, if componentKey was changed", async () => {
        const gfiFeatures = [{
                getGfiUrl: () => null,
                getFeatures: () => sinon.stub(),
                getProperties: () => sinon.stub()
            }],
            store = getGfiStore(false, "", gfiFeatures, []);
        let wrapper = null,
            firstDetachedComponent = "",
            secondDetachedComponent = "";

        wrapper = shallowMount(GfiComponent, {
            global: {
                plugins: [store]
            }
        });

        firstDetachedComponent = wrapper.findComponent({name: "GetFeatureInfoDetached"});
        await wrapper.setData({componentKey: true});
        secondDetachedComponent = wrapper.findComponent({name: "GetFeatureInfoDetached"});

        expect(firstDetachedComponent.exists()).to.be.false;
        expect(secondDetachedComponent.exists()).to.be.true;
    });
});
