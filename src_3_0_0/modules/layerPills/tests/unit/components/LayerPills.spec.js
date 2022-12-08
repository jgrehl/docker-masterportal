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
        mockConfigJson,
        startIndex,
        endIndex;

    beforeEach(() => {
        visibleLayers = [
            {id: 0, name: "layer1", typ: "WMS"},
            {id: 1, name: "layer2", typ: "WMS"},
            {id: 2, name: "layer3", typ: "WFS"},
            {id: 3, name: "layer4", typ: "WFS"}
        ];
        mockConfigJson = {
            tree: {
                layerPillsAmount: 2
            }
        };
        startIndex = 0;
        endIndex = 2;
        store = createStore({
            namespaced: true,
            modules: {
                LayerPills,
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

        store.commit("LayerPills/setStartIndex", startIndex);
        store.commit("LayerPills/setEndIndex", endIndex);
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

        it("layerPillsAmount is 0", () => {
            store.commit("setPortalConfig", {
                tree: {
                    layerPillsAmount: 0
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
        it("scroll left and right buttons not showing ", () => {
            store.commit("setPortalConfig", {
                tree: {
                    layerPillsAmount: 0
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
            expect(wrapper.find("#layerpills-left-button").element.disabled).to.be.true;
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
            expect(wrapper.find("#layerpills-right-button").element.disabled).to.be.false;
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

            expect(wrapper.findAll(".close-button").length).to.equals(endIndex);
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

            expect(store.state.LayerPills.visibleSubjectDataLayers).to.deep.equal(visibleLayers);
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

            expect(store.state.LayerPills.visibleSubjectDataLayers).to.deep.equal([
                {id: 2, name: "layer3", typ: "WFS"},
                {id: 3, name: "layer4", typ: "WFS"}]
            );
        });
        it("moveLayerPills to the right increases and to the left decreases start and end index by 1", () => {
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
            expect(store.state.LayerPills.startIndex).to.equal(0);
            expect(store.state.LayerPills.endIndex).to.equal(2);
            wrapper.vm.moveLayerPills("right");
            expect(store.state.LayerPills.startIndex).to.equal(1);
            expect(store.state.LayerPills.endIndex).to.equal(3);
            wrapper.vm.moveLayerPills("left");
            expect(store.state.LayerPills.startIndex).to.equal(0);
            expect(store.state.LayerPills.endIndex).to.equal(2);
        });
    });

    describe("watchers", () => {
        it("startIndex < 0", () => {
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
            wrapper.vm.$options.watch.startIndex.call(wrapper.vm, 0);

            expect(store.state.LayerPills.leftScrollDisabled).to.equal(true);
        });
        it("startIndex > 0", () => {
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
            wrapper.vm.$options.watch.startIndex.call(wrapper.vm, 2);

            expect(store.state.LayerPills.leftScrollDisabled).to.equal(false);
        });
        it("endIndex < visibleSubjectDataLayers.length", () => {
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
            wrapper.vm.$options.watch.endIndex.call(wrapper.vm, 0);

            expect(store.state.LayerPills.rightScrollDisabled).to.equal(false);
        });
        it("endIndex >= visibleSubjectDataLayers.length", () => {
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
            wrapper.vm.$options.watch.endIndex.call(wrapper.vm, 4);

            expect(store.state.LayerPills.rightScrollDisabled).to.equal(true);
        });
    });
});
