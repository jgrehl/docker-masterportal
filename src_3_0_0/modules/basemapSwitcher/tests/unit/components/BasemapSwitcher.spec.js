import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import BasemapSwitcherComponent from "../../../components/BasemapSwitcher.vue";
import BasemapSwitcher from "../../../store/indexBasemapSwitcher";
import {expect} from "chai";
import sinon from "sinon";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/BasemapSwitcher.vue", () => {
    let store,
        wrapper,
        backgroundlayerConfigs,
        visibleBackgroundLayerConfigs,
        originalUpdateLayerVisibilityAndZIndex;

    beforeEach(() => {
        backgroundlayerConfigs = [
            {id: "WMTS", name: "EOC Basemap", visibility: false, backgroundLayer: true, showInLayerTree: true},
            {id: "VectorTile", name: "ArcGIS VectorTile", visibility: false, backgroundLayer: true, showInLayerTree: true},
            {id: "453", name: "Geobasiskarten (HamburgDE)", visibility: true, backgroundLayer: true, showInLayerTree: true},
            {id: "452", name: "Digitale Orthophotos (belaubt) Hamburg", visibility: false, backgroundLayer: true, showInLayerTree: true}
        ];
        visibleBackgroundLayerConfigs = [
            {id: "VectorTile", name: "ArcGIS VectorTile", visibility: true, backgroundLayer: true, showInLayerTree: true},
            {id: "453", name: "Geobasiskarten (HamburgDE)", visibility: true, backgroundLayer: true, showInLayerTree: true}
        ];

        originalUpdateLayerVisibilityAndZIndex = BasemapSwitcher.actions.updateLayerVisibilityAndZIndex;
        BasemapSwitcher.actions.updateLayerVisibilityAndZIndex = sinon.spy();

        store = createStore({
            namespaced: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        BasemapSwitcher
                    }
                }
            },
            getters: {
                isMobile: () => false,
                layerConfigsByAttributes: () => () => visibleBackgroundLayerConfigs,
                allBackgroundLayerConfigs: () => backgroundlayerConfigs,
                visibleBackgroundLayerConfigs: () => visibleBackgroundLayerConfigs,
                activatedExpandable: () => false
            },
            mutations: {
                setLayerConfigsByAttributes: (state, layer) => {
                    return layer;
                },
                setAllBackgroundLayerConfigs: (state, layer) => {
                    backgroundlayerConfigs = layer;
                },
                setVisibleBackgroundLayerConfigs: (state, layer) => {
                    visibleBackgroundLayerConfigs = layer;
                }
            }
        });
    });

    afterEach(() => {
        BasemapSwitcher.actions.updateLayerVisibilityAndZIndex = originalUpdateLayerVisibilityAndZIndex;

        sinon.restore();
    });

    describe("basemapSwitcher DOM elements", () => {
        it("renders BasemapSwitcher", () => {
            wrapper = shallowMount(BasemapSwitcherComponent, {
                global: {
                    plugins: [store]
                }
            });

            expect(wrapper.find("#basemap-switcher").exists()).to.be.true;
        });

        it("does not render basemapSwitcher", () => {
            store.commit("setAllBackgroundLayerConfigs", []);

            wrapper = shallowMount(BasemapSwitcherComponent, {
                global: {
                    plugins: [store]
                }
            });

            expect(wrapper.find("#basemap-switcher").exists()).to.be.false;
        });

        it("basemapSwitcher is expanded", () => {
            store.commit("Modules/BasemapSwitcher/setActivatedExpandable", true);
            wrapper = shallowMount(BasemapSwitcherComponent, {
                global: {
                    plugins: [store]
                }
            });

            expect(wrapper.find("#basemap-switcher").exists()).to.be.true;
            expect(wrapper.find("#bs-expanded").exists()).to.be.true;
            expect(wrapper.findAll("#bs-expanded").length).to.equal(store.state.Modules.BasemapSwitcher.backgroundLayerIds.length);
        });

        it("backgroundLayerId of layer with highest zIndex is shown as preview", () => {
            wrapper = shallowMount(BasemapSwitcherComponent, {
                global: {
                    plugins: [store]
                }
            });

            expect(wrapper.find("#basemap-switcher").exists()).to.be.true;
            expect(wrapper.find("#layer-tree-layer-preview-" + store.state.Modules.BasemapSwitcher.topBackgroundLayerId).exists()).to.be.true;
        });
        it("placeholder is shown as preview", () => {
            store.commit("setVisibleBackgroundLayerConfigs", []);

            wrapper = shallowMount(BasemapSwitcherComponent, {
                global: {
                    plugins: [store]
                }
            });

            expect(wrapper.find("#basemap-switcher").exists()).to.be.true;
            expect(wrapper.find("#bs-placeholder").exists()).to.be.true;
        });
    });

    describe("watcher", () => {
        it("visibleBackgroundLayerConfigs with new backgroundLayer", () => {
            const newValue = [{
                    id: "WMTS",
                    name: "EOC Basemap",
                    visibility: true,
                    backgroundLayer: true,
                    showInLayerTree: true,
                    zIndex: 1
                }],
                oldValue = [];

            wrapper = shallowMount(BasemapSwitcherComponent, {
                global: {
                    plugins: [store]
                }});

            wrapper.vm.$options.watch.visibleBackgroundLayerConfigs.handler.call(wrapper.vm, newValue, oldValue);
            expect(store.state.Modules.BasemapSwitcher.topBackgroundLayerId).to.equal("WMTS");
        });
        it("visibleBackgroundLayerConfigs with no selected backgroundLayer", () => {
            const newValue = [],
                oldValue = [{id: "453", visibility: true, backgroundLayer: true, showInLayerTree: true, zIndex: 1}];

            wrapper = shallowMount(BasemapSwitcherComponent, {
                global: {
                    plugins: [store]
                }
            });

            wrapper.vm.$options.watch.visibleBackgroundLayerConfigs.handler.call(wrapper.vm, newValue, oldValue);
            expect(store.state.Modules.BasemapSwitcher.topBackgroundLayerId).to.equal(null);
        });
    });

    describe("created", () => {
        it("backgroundLayerIds and topBackgroundLayer", () => {
            backgroundlayerConfigs = [
                {id: "Karte1", name: "EOC Basemap", visibility: false, backgroundLayer: true, showInLayerTree: true},
                {id: "Karte2", name: "ArcGIS VectorTile", visibility: false, backgroundLayer: true, showInLayerTree: true},
                {id: "Karte3", name: "Geobasiskarten (HamburgDE)", visibility: true, backgroundLayer: true, showInLayerTree: true},
                {id: "Karte4", name: "Digitale Orthophotos (belaubt) Hamburg", visibility: false, backgroundLayer: true, showInLayerTree: true}
            ];
            visibleBackgroundLayerConfigs = [
                {id: "Karte3", name: "Geobasiskarten (HamburgDE)", visibility: true, backgroundLayer: true, showInLayerTree: true}
            ];
            wrapper = shallowMount(BasemapSwitcherComponent, {
                global: {
                    plugins: [store]
                }
            });

            expect(store.state.Modules.BasemapSwitcher.backgroundLayerIds).to.deep.equal(["Karte1", "Karte2", "Karte4"]);
            expect(store.state.Modules.BasemapSwitcher.topBackgroundLayerId).to.deep.equal("Karte3");

        });
    });

    describe("BasemapSwitcher methods", () => {
        it("switchActiveBackgroundLaye to new layerId", () => {
            const layerId = "VectorTile";

            wrapper = shallowMount(BasemapSwitcherComponent, {
                global: {
                    plugins: [store]
                }
            });

            wrapper.vm.switchActiveBackgroundLayer(layerId);

            expect(BasemapSwitcher.actions.updateLayerVisibilityAndZIndex.calledOnce).to.equal(true);
            expect(store.state.Modules.BasemapSwitcher.topBackgroundLayerId).to.deep.equal(layerId);
            expect(store.state.Modules.BasemapSwitcher.activatedExpandable).to.equal(false);
        });

    });
});
