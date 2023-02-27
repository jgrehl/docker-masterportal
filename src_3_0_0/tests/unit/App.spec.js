import {createStore} from "vuex";
import {expect} from "chai";
import sinon from "sinon";
import {shallowMount} from "@vue/test-utils";
import AppComponent from "../../App.vue";
import maps from "../../core/maps/js/maps.js";

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

        store = createStore({
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
            },
            mutations: {
                setDeviceMode: sinon.spy()
            }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it("loads config on creating App", () => {
        wrapper = shallowMount(AppComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#masterportal-container").exists()).to.be.true;
        expect(actions.loadConfigJson.calledOnce).to.be.true;
        expect(actions.loadRestServicesJson.calledOnce).to.be.true;
        expect(actions.loadServicesJson.calledOnce).to.be.true;
        expect(actions.loadConfigJs.calledOnce).to.be.true;
    });

    it("sets mapCollection as global variable", () => {
        wrapper = shallowMount(AppComponent, {
            global: {
                plugins: [store]
            }});

        expect(global.mapCollection).to.be.not.undefined;
    });

    it("watcher allConfigsLoaded is false", () => {
        wrapper = shallowMount(AppComponent, {
            global: {
                plugins: [store]
            }});

        wrapper.vm.$options.watch.allConfigsLoaded.call(wrapper.vm, false);
        expect(actions.extendLayers.notCalled).to.be.true;
        expect(initializeMapsSpy.notCalled).to.be.true;
    });
});
