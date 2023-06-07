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
        layerConfigs,
        backgroundlayerConfigs,
        visibleBackgroundLayerConfigs;

    beforeEach(() => {
        layerConfigs = [
            {id: "WMTS", visibility: false, backgroundLayer: true, showInLayerTree: true, zIndex: 0},
            {id: "VectorTile", visibility: false, backgroundLayer: true, showInLayerTree: true, zIndex: 0},
            {id: "453", visibility: true, backgroundLayer: true, showInLayerTree: true, zIndex: 1},
            {id: "452", visibility: false, backgroundLayer: true, showInLayerTree: true, zIndex: 0},
            {id: "12883", visibility: false, backgroundLayer: false, showInLayerTree: true, zIndex: 0}
        ];
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
                layerConfigsByAttributes: () => () => layerConfigs,
                allBackgroundLayerConfigs: () => backgroundlayerConfigs,
                visibleBackgroundLayerConfigs: () => visibleBackgroundLayerConfigs,
                activatedExpandable: () => false
            },
            mutations: {
                setLayerConfigsByAttributes: (state, layer) => {
                    layerConfigs = layer;
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
        sinon.restore();
    });

    describe("basemapSwitcher DOM elements", () => {
        it.only("renders BasemapSwitcher", () => {
            wrapper = shallowMount(BasemapSwitcherComponent, {
                global: {
                    plugins: [store]
                }});

            expect(wrapper.find("#basemap-switcher").exists()).to.be.true;
        });

        it.only("does not render basemapSwitcher", () => {
            store.commit("setAllBackgroundLayerConfigs", []);

            wrapper = shallowMount(BasemapSwitcherComponent, {
                global: {
                    plugins: [store]
                }});

            expect(wrapper.find("#basemap-switcher").exists()).to.be.false;
        });

        it.only("basemapSwitcher is expanded", () => {
            store.commit("Modules/BasemapSwitcher/setActivatedExpandable", true);
            wrapper = shallowMount(BasemapSwitcherComponent, {
                global: {
                    plugins: [store]
                }});

            expect(wrapper.find("#basemap-switcher").exists()).to.be.true;
            expect(wrapper.find("#bs-expanded").exists()).to.be.true;
            expect(wrapper.findAll("#bs-expanded").length).to.equal(store.state.Modules.BasemapSwitcher.backgroundLayerIds.length);
        });

        it.only("backgroundLayerId of layer with highest zIndex is shown as preview", () => {
            wrapper = shallowMount(BasemapSwitcherComponent, {
                global: {
                    plugins: [store]
                }});

            expect(wrapper.find("#basemap-switcher").exists()).to.be.true;
            expect(wrapper.find("#bs-topBackgroundLayer").exists()).to.be.true;
            expect(wrapper.find("#bs-topBackgroundLayer").text()).to.equal(store.state.Modules.BasemapSwitcher.topBackgroundLayerId);
        });
        it.only("placeholder is shown as preview", () => {
            store.commit("setLayerConfigsByAttributes", [
                {id: "WMTS", visibility: false, backgroundLayer: true, showInLayerTree: true, zIndex: 0},
                {id: "VectorTile", visibility: false, backgroundLayer: true, showInLayerTree: true, zIndex: 0},
                {id: "453", visibility: false, backgroundLayer: true, showInLayerTree: true, zIndex: 0}
            ]);

            wrapper = shallowMount(BasemapSwitcherComponent, {
                global: {
                    plugins: [store]
                }});

            expect(wrapper.find("#basemap-switcher").exists()).to.be.true;
            expect(wrapper.find("#bs-placeholder").exists()).to.be.true;
        });
    });

    describe("watcher", () => {
        it.only("visibleBackgroundLayerConfigs with new backgroundLayer", () => {
            const newValue = [{
                id: "WMTS",
                name: "EOC Basemap",
                visibility: true,
                backgroundLayer: true,
                showInLayerTree: true,
                zIndex: 1
            }];

            wrapper = shallowMount(BasemapSwitcherComponent, {
                global: {
                    plugins: [store]
                }});

            wrapper.vm.$options.watch.visibleBackgroundLayerConfigs.handler.call(wrapper.vm, newValue);
            expect(store.state.Modules.BasemapSwitcher.topBackgroundLayerId).to.equal("WMTS");
        });
        it.only("visibleBackgroundLayerConfigs with no selected backgroundLayer", () => {
            const newValue = [];

            wrapper = shallowMount(BasemapSwitcherComponent, {
                global: {
                    plugins: [store]
                }});

            wrapper.vm.$options.watch.visibleBackgroundLayerConfigs.handler.call(wrapper.vm, newValue);
            expect(store.state.Modules.BasemapSwitcher.topBackgroundLayerId).to.equal(undefined);
        });
    });

    describe("created", () => {
        it.skip("", () => {
            wrapper = shallowMount(BasemapSwitcherComponent, {
                global: {
                    plugins: [store]
                }});

        });
    });

    describe("BasemapSwitcher methods", () => {
        it.skip("switchActiveBackgroundLayer", () => {
            wrapper = shallowMount(BasemapSwitcherComponent, {
                global: {
                    plugins: [store]
                }});
        });
    });
});
