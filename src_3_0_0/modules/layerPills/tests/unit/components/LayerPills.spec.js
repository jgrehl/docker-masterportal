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
        mobile,
        replaceByIdInLayerConfigSpy,
        startLayerInformationSpy;

    beforeEach(() => {
        mobile = false;
        replaceByIdInLayerConfigSpy = sinon.spy();
        startLayerInformationSpy = sinon.spy();
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
                        LayerPills,
                        LayerInformation: {
                            namespaced: true,
                            actions: {
                                startLayerInformation: startLayerInformationSpy
                            }
                        }
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
                isMobile: () => mobile,
                visibleSubjectDataLayerConfigs: () => visibleLayers,
                portalConfig: () => mockConfigJson
            },
            mutations: {
                setVisibleSubjectDataLayerConfigs: (state, layer) => {
                    visibleLayers = layer;
                },
                setPortalConfig: (state, configJson) => {
                    mockConfigJson = configJson;
                }
            },
            actions: {
                replaceByIdInLayerConfig: replaceByIdInLayerConfigSpy
            }
        });
        store.commit("Modules/LayerPills/setActive", true);
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

        it("should not exist if active false", () => {
            store.commit("setPortalConfig", {
                tree: {
                    layerPills: {
                        active: false,
                        amount: 5
                    }
                }
            });
            store.commit("Modules/LayerPills/setActive", false);
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

        it("should not exist if layerPills are not configured in config.json", () => {
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

        it("removeLayerFromVisibleLayers shall call replaceByIdInLayerConfig", () => {
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
            wrapper.vm.removeLayerFromVisibleLayers(visibleLayers[0], "2D");

            expect(replaceByIdInLayerConfigSpy.calledOnce).to.be.true;
            expect(replaceByIdInLayerConfigSpy.firstCall.args[1]).to.deep.equals({
                layerConfigs: [{
                    id: visibleLayers[0].id,
                    layer: {
                        id: visibleLayers[0].id,
                        visibility: false
                    }
                }]
            });
        });

        it("moveLayerPills shall set scrolled and scrollEnd - scroll right", () => {
            const scrollLeft = 1000,
                scrollBySpy = sinon.spy();

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
            wrapper.vm.$el.scrollBy = scrollBySpy;
            wrapper.vm.$el.scrollWidth = 500;
            wrapper.vm.$el.scrollLeft = scrollLeft;
            wrapper.vm.moveLayerPills("right");

            expect(wrapper.vm.scrolled).to.be.equals(scrollLeft + 158);
            expect(wrapper.vm.scrollEnd).to.be.true;
            expect(scrollBySpy.calledOnce).to.be.true;
        });

        it("moveLayerPills shall set scrolled and scrollEnd - scroll left", () => {
            const scrollLeft = 1000,
                scrollBySpy = sinon.spy();

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
            wrapper.vm.$el.scrollBy = scrollBySpy;
            wrapper.vm.$el.scrollWidth = 500;
            wrapper.vm.$el.scrollLeft = scrollLeft;
            wrapper.vm.moveLayerPills("left");

            expect(wrapper.vm.scrolled).to.be.equals(scrollLeft - 158);
            expect(wrapper.vm.scrollEnd).to.be.true;
            expect(scrollBySpy.calledOnce).to.be.true;
        });

        it("setScrollEnd amount is bigger than layer count", () => {
            const layers = [{id: "1"}];

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
            wrapper.vm.setScrollEnd(layers);

            expect(wrapper.vm.scrolled).to.be.equals(0);
            expect(wrapper.vm.scrollEnd).to.be.true;
        });

        it("setScrollEnd amount is less than layer count", () => {
            const layers = [{id: "1"}, {id: "2"}, {id: "3"}];

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

            wrapper.vm.scrolled = 333;
            wrapper.vm.setScrollEnd(layers);

            expect(wrapper.vm.scrolled).to.be.equals(333);
            expect(wrapper.vm.scrollEnd).to.be.false;
        });

        it("showLayerInformationInMenu layerConf with datasets calls startLayerInformation", () => {
            const layerConf = {
                datasets: []
            };

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

            wrapper.vm.showLayerInformationInMenu(layerConf);

            expect(startLayerInformationSpy.calledOnce).to.be.true;
        });

        it("showLayerInformationInMenu layerConf without datasets does nothing", () => {
            const layerConf = {
            };

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

            wrapper.vm.showLayerInformationInMenu(layerConf);

            expect(startLayerInformationSpy.notCalled).to.be.true;
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
                expect(element.attributes()).to.own.include({"title": visibleLayers[index].name});
            });
        });
    });

    describe("computed", () => {
        it("containerWidth if not mobile", () => {
            const amount = 5;

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
            store.commit("Modules/LayerPills/setAmount", amount);

            expect(wrapper.vm.containerWidth).to.be.equals(amount * 158 + 70);
        });

        it("containerWidth if mobile", () => {
            const amount = 3;

            mobile = true;
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
            store.commit("Modules/LayerPills/setAmount", amount);

            expect(wrapper.vm.containerWidth).to.be.equals(320);
        });
    });

    describe("watcher", () => {
        it("visibleSubjectDataLayerConfigs with no oldValue", () => {
            const newValue = [{
                    id: "id"
                }],
                setVisibleLayersSpy = sinon.spy(LayerPillsComponent.methods, "setVisibleLayers");

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
            wrapper.vm.$options.watch.visibleSubjectDataLayerConfigs.handler.call(wrapper.vm, newValue, []);
            // called once on mounted and once on watcher call
            expect(setVisibleLayersSpy.calledTwice).to.be.true;
            expect(setVisibleLayersSpy.firstCall.args[0]).to.be.deep.equals([]);
            expect(setVisibleLayersSpy.firstCall.args[1]).to.be.equals("2D");
            expect(setVisibleLayersSpy.firstCall.args[2]).to.be.equals(undefined);
            expect(setVisibleLayersSpy.secondCall.args[0]).to.be.deep.equals(newValue);
            expect(setVisibleLayersSpy.secondCall.args[1]).to.be.equals("2D");
            expect(setVisibleLayersSpy.secondCall.args[2]).to.be.deep.equals(newValue);
        });

        it("visibleSubjectDataLayerConfigs with oldValue", () => {
            const old1 = {
                    id: "old1"
                },
                newValue = [{
                    id: "id"
                },
                old1],
                oldValue = [old1],
                setVisibleLayersSpy = sinon.spy(LayerPillsComponent.methods, "setVisibleLayers");

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
            wrapper.vm.$options.watch.visibleSubjectDataLayerConfigs.handler.call(wrapper.vm, newValue, oldValue);
            // called once on mounted and once on watcher call
            expect(setVisibleLayersSpy.calledTwice).to.be.true;
            expect(setVisibleLayersSpy.firstCall.args[0]).to.be.deep.equals([]);
            expect(setVisibleLayersSpy.firstCall.args[1]).to.be.equals("2D");
            expect(setVisibleLayersSpy.firstCall.args[2]).to.be.equals(undefined);
            expect(setVisibleLayersSpy.secondCall.args[0]).to.be.deep.equals(newValue);
            expect(setVisibleLayersSpy.secondCall.args[1]).to.be.equals("2D");
            expect(setVisibleLayersSpy.secondCall.args[2]).to.be.deep.equals([newValue[0]]);
        });

        it("mode change shall call setVisibleLayers", () => {
            const visibleSubjectDataLayerConfigs = [{
                    id: "id1"
                }, {
                    id: "id2"
                }],
                setVisibleLayersSpy = sinon.spy(LayerPillsComponent.methods, "setVisibleLayers");

            store.commit("setVisibleSubjectDataLayerConfigs", visibleSubjectDataLayerConfigs);
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
            wrapper.vm.$options.watch.mode.call(wrapper.vm, "3D");
            // called once on mounted and once on watcher call
            expect(setVisibleLayersSpy.calledTwice).to.be.true;
            expect(setVisibleLayersSpy.secondCall.args[0]).to.be.deep.equals(visibleSubjectDataLayerConfigs);
            expect(setVisibleLayersSpy.secondCall.args[1]).to.be.equals("3D");
        });

    });
});
