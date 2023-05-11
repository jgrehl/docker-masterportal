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
        backgroundlayerConfigs;

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
    });
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
            // layerConfigsByAttributes: () => (attributes = {}) => layerConfigs,
            allBackgroundLayerConfigs: () => backgroundlayerConfigs
        },
        mutations: {
            // setLayerConfigsByAttributes: (state, layer) => {
            //     layerConfigs = layer;
            // },
            setAllBackgroundLayerConfigs: (state, layer) => {
                backgroundlayerConfigs = layer;
            }
        }
    });

    afterEach(() => {
        sinon.restore();
    });

    it("renders BasemapSwitcher", () => {
        wrapper = shallowMount(BasemapSwitcherComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#basemap-switcher").exists()).to.be.true;
    });

    it.only("does not render BasemapSwitcher", () => {
        // store.state.Modules.BasemapSwitcher.backgroundLayerIds = [];
        // store.commit("setLayerConfigsByAttributes", []);
        store.commit("setAllBackgroundLayerConfigs", []);

        wrapper = shallowMount(BasemapSwitcherComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#basemap-switcher").exists()).to.be.false;
    });
});
