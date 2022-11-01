import Vuex from "vuex";
import {expect} from "chai";
import sinon from "sinon";
import {shallowMount, createLocalVue} from "@vue/test-utils";
import AppComponent from "../../App.vue";
import maps from "../../core/maps/js/maps.js";

const localVue = createLocalVue();

localVue.use(Vuex);

describe("src_3_0_0/App.vue", () => {
    let store,
        wrapper,
        actions,
        initializeMapsSpy;

    beforeEach(() => {
        initializeMapsSpy = sinon.spy(maps, "initializeMaps");
        actions = {
            extendLayers: sinon.spy(),
            loadConfigJs: sinon.spy(),
            loadConfigJson: sinon.spy(),
            loadRestServicesJson: sinon.spy(),
            loadServicesJson: sinon.spy()
        };

        store = new Vuex.Store({
            namespaced: true,
            getters: {
                allConfigsLoaded: sinon.stub(),
                cesiumLibrary: () => {
                    return "path_to_cesium_library";
                },
                configJs: sinon.stub(),
                layerConfig: sinon.stub(),
                portalConfig: () => {
                    return {mapView: {}};
                },
                visibleLayerConfigs: () => {
                    return [];
                }
            },
            actions: actions,
            state: {
                loadedConfigs: {
                    configJson: false,
                    restServicesJson: false,
                    servicesJson: false
                }
            }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it("loads config on creating App", () => {
        wrapper = shallowMount(AppComponent, {store, localVue});

        expect(wrapper.find("#masterportal-container").exists()).to.be.true;
        expect(actions.loadConfigJson.calledOnce).to.be.true;
        expect(actions.loadRestServicesJson.calledOnce).to.be.true;
        expect(actions.loadServicesJson.calledOnce).to.be.true;
        expect(actions.loadConfigJs.calledOnce).to.be.true;
    });

    it("sets mapCollection as global variable", () => {
        wrapper = shallowMount(AppComponent, {store, localVue});

        expect(global.mapCollection).to.be.not.undefined;
    });

    it("watcher allConfigsLoaded is true", () => {
        wrapper = shallowMount(AppComponent, {store, localVue});

        wrapper.vm.$options.watch.allConfigsLoaded.call(wrapper.vm, true);
        expect(actions.extendLayers.calledOnce).to.be.true;
        expect(initializeMapsSpy.calledOnce).to.be.true;
    });

    it("watcher allConfigsLoaded is false", () => {
        wrapper = shallowMount(AppComponent, {store, localVue});

        wrapper.vm.$options.watch.allConfigsLoaded.call(wrapper.vm, false);
        expect(actions.extendLayers.notCalled).to.be.true;
        expect(initializeMapsSpy.notCalled).to.be.true;
    });
});
