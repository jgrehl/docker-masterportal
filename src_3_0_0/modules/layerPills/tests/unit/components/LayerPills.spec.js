import {createStore} from "vuex";
import {config, shallowMount, mount} from "@vue/test-utils";
import LayerPillsComponent from "../../../components/LayerPills.vue";
import LayerPills from "../../../store/indexLayerPills";
import {expect} from "chai";
import sinon from "sinon";

config.global.mocks.$t = key => key;


describe("src_3_0_0/modules/LayerPills.vue", () => {
    let store,
        wrapper,
        visibleLayers,
        mockConfigJson;

    beforeEach(() => {
        visibleLayers = [
            {id: 0, name: "layer1", typ: "WMS"},
            {id: 1, name: "layer2", typ: "WMS"},
            {id: 2, name: "layer3", typ: "WFS"},
            {id: 3, name: "layer4", typ: "WFS"}
        ];
        mockConfigJson = {
            tree: {
                layerPills: {
                    "active": true,
                    "amount": 2
                }
            }
        };
        store = createStore({
            namespaced: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        LayerPills
                    }
                },
                Maps: {
                    namespaced: true,
                    getters: {
                        mode: () => "2D"
                    }
                }
            },
            getters: {
                isMobile: () => false,
                visibleSubjectDataLayerConfigs: () => visibleLayers,
                portalConfig: () => mockConfigJson
            },
            mutations: {
                setVisibleSubjectDataLayerConfigs: (state, layer) => {
                    visibleLayers = layer;
                },
                setPortalConfig: (state, configJson) => {
                    mockConfigJson = configJson;
                },
                replaceByIdInLayerConfig: (state, layerId) => {
                    visibleLayers = [{
                        id: layerId,
                        layer: {
                            id: layerId,
                            visibility: false
                        }
                    }];
                }
            }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("renders or does not render div", () => {
        it("renders div", () => {
            wrapper = shallowMount(LayerPillsComponent, {
                components: {
                    IconButton: {
                        name: "IconButton",
                        template: "<button>Hier</button>"
                    }
                },
                global: {
                    plugins: [store]
                }});
            expect(wrapper.find("#layer-pills").exists()).to.be.true;
        });

        it("no visibleSubjectDataLayers", () => {
            store.commit("setVisibleSubjectDataLayerConfigs", []);
            wrapper = shallowMount(LayerPillsComponent, {
                components: {
                    IconButton: {
                        name: "IconButton",
                        template: "<button>Hier</button>"
                    }
                },
                global: {
                    plugins: [store]
                }});

            expect(wrapper.find("#layer-pills").exists()).to.be.false;
        });

        it("should not exist if layerPillsAmount is 0", () => {
            store.commit("setPortalConfig", {
                tree: {
                    layerPills: {
                        active: true,
                        amount: 0
                    }
                }
            });
            wrapper = shallowMount(LayerPillsComponent, {
                components: {
                    IconButton: {
                        name: "IconButton",
                        template: "<button>Hier</button>"
                    }
                },
                global: {
                    plugins: [store]
                }});

            expect(wrapper.find("#layer-pills").exists()).to.be.false;
        });

        it("should not exist if layerPills are not activated", () => {
            store.commit("setPortalConfig", {
                tree: {
                    layerPills: {

                    }
                }
            });
            wrapper = shallowMount(LayerPillsComponent, {
                components: {
                    IconButton: {
                        name: "IconButton",
                        template: "<button>Hier</button>"
                    }
                },
                global: {
                    plugins: [store]
                }});

            expect(wrapper.find("#layer-pills").exists()).to.be.false;
        });
    });

    describe("left scroll disabled", () => {
        it("left scroll is disabled", () => {
            wrapper = mount(LayerPillsComponent, {
                components: {
                    IconButton: {
                        name: "IconButton",
                        template: "<button>Hier</button>"
                    }
                },
                global: {
                    plugins: [store]
                }});
            expect(wrapper.find("#layerpills-left-button").attributes().style).to.include("visibility: hidden");
        });
    });
    describe("right scroll enabled", () => {
        it("right scroll is enabled", async () => {
            wrapper = mount(LayerPillsComponent, {
                components: {
                    IconButton: {
                        name: "IconButton",
                        template: "<button>Hier</button>"
                    }
                },
                global: {
                    plugins: [store]
                }});

            await wrapper.vm.$nextTick();
            expect(wrapper.find("#layerpills-right-button").attributes().style).to.be.undefined;
        });
    });

    describe("close layerPill", () => {
        it("count close-buttons", () => {
            wrapper = shallowMount(LayerPillsComponent, {
                components: {
                    IconButton: {
                        name: "IconButton",
                        template: "<button>Hier</button>"
                    }
                },
                global: {
                    plugins: [store]
                }});

            expect(wrapper.findAll(".close-button").length).to.equals(store.state.Modules.LayerPills.visibleSubjectDataLayers.length);
        });
    });

    describe("method testing", () => {
        it("setVisibleLayers", () => {
            wrapper = shallowMount(LayerPillsComponent, {
                components: {
                    IconButton: {
                        name: "IconButton",
                        template: "<button>Hier</button>"
                    }
                },
                global: {
                    plugins: [store]
                }});
            wrapper.vm.setVisibleLayers(visibleLayers, "2D");

            expect(store.state.Modules.LayerPills.visibleSubjectDataLayers).to.deep.equal(visibleLayers);
        });
        it("setVisibleLayers only sets 2D layers if 2D mode is selected", () => {
            const visibleLayers3D2D = [
                {id: 0, name: "layer1", typ: "ENTITIES3D"},
                {id: 1, name: "layer2", typ: "ENTITIES3D"},
                {id: 2, name: "layer3", typ: "WFS"},
                {id: 3, name: "layer4", typ: "WFS"}
            ];

            wrapper = shallowMount(LayerPillsComponent, {
                components: {
                    IconButton: {
                        name: "IconButton",
                        template: "<button>Hier</button>"
                    }
                },
                global: {
                    plugins: [store]
                }});
            wrapper.vm.setVisibleLayers(visibleLayers3D2D, "2D");

            expect(store.state.Modules.LayerPills.visibleSubjectDataLayers).to.deep.equal([
                {id: 2, name: "layer3", typ: "WFS"},
                {id: 3, name: "layer4", typ: "WFS"}]
            );
        });
    });


    describe("tooltip of anchor", () => {
        it("anchors should have the correct tooltip", () => {
            wrapper = shallowMount(LayerPillsComponent, {
                components: {
                    IconButton: {
                        name: "IconButton",
                        template: "<button>Hier</button>"
                    }
                },
                global: {
                    plugins: [store]
                }});

            wrapper.findAll("li.nav-item a").forEach((element, index) => {
                expect(element.attributes()).to.own.include({"data-bs-toggle": "tooltip"});
                expect(element.attributes()).to.own.include({"data-bs-placement": "bottom"});
                expect(element.attributes()).to.own.include({"data-bs-custom-class": "custom-tooltip"});
                expect(element.attributes()).to.own.include({"data-bs-original-title": visibleLayers[index].name});
                expect(element.attributes()).to.own.include({"title": visibleLayers[index].name});
            });
        });
    });
});
