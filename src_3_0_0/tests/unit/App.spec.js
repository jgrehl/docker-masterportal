import Vuex from "vuex";
import {expect} from "chai";
import sinon from "sinon";
import {shallowMount, createLocalVue} from "@vue/test-utils";
import AppComponent from "../../App.vue";
import * as maps from "../../core/maps/maps.js";


const localVue = createLocalVue();

localVue.use(Vuex);

describe("src_3_0_0/App.vue", () => {
    let store,
        wrapper,
        actions;

    beforeEach(() => {
        createMapsSpy = sinon.spy(maps, "createMaps");
        actions = {
            extendLayers: sinon.spy(),
            extendVisibleLayers: sinon.spy(),
            loadConfigJs: sinon.spy(),
            loadConfigJson: sinon.spy(),
            loadRestServicesJson: sinon.spy(),
            loadServicesJson: sinon.spy()
        };

        store = new Vuex.Store({
            namespaced: true,
            getters: {
                allConfigsLoaded: sinon.stub(),
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

    it("sets mapCollection as  lobal variable", () => {
        wrapper = shallowMount(AppComponent, {store, localVue});

        expect(global.mapCollection).to.be.not.undefined;
    });

    it("watcher allConfigsLoaded is true", () => {
        wrapper = shallowMount(AppComponent, {store, localVue});

        wrapper.vm.$options.watch.allConfigsLoaded.call(wrapper.vm, true);
        expect(actions.extendLayers.calledOnce).to.be.true;
        expect(createMapsSpy.calledOnce).to.be.true;
    });

    it("watcher allConfigsLoaded is false", () => {
        wrapper = shallowMount(AppComponent, {store, localVue});

        wrapper.vm.$options.watch.allConfigsLoaded.call(wrapper.vm, false);
        expect(actions.extendLayers.notCalled).to.be.true;
        expect(createMapsSpy.notCalled).to.be.true;
    });
});
