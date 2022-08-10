import Vuex from "vuex";
import {expect} from "chai";
import sinon from "sinon";
import {shallowMount, createLocalVue} from "@vue/test-utils";
import AppComponent from "../../App.vue";


const localVue = createLocalVue();

localVue.use(Vuex);

describe("src_3_0_0/App.vue", () => {
    let store,
        wrapper,
        actions,
        mutations;

    beforeEach(() => {
        actions = {
            loadConfigJs: sinon.spy(),
            loadConfigJson: sinon.spy(),
            loadRestServicesJson: sinon.spy(),
            loadServicesJson: sinon.spy(),
            prepareVisibleLayers: sinon.spy()
        };
        mutations = {
            setConfigJs: sinon.spy()
        };

        store = new Vuex.Store({
            namespaced: true,
            getters: {
                allConfigsLoaded: sinon.stub(),
                configJs: sinon.stub(),
                portalConfig: () => {
                    return {mapView: {}};
                }
            },
            mutations: mutations,
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
        expect(actions.prepareVisibleLayers.calledOnce).to.be.true;
        // todo createMaps call cannot be tested due to problems mocking imported functions
    });

    it("watcher allConfigsLoaded is false", () => {
        wrapper = shallowMount(AppComponent, {store, localVue});

        wrapper.vm.$options.watch.allConfigsLoaded.call(wrapper.vm, false);
        expect(actions.prepareVisibleLayers.notCalled).to.be.true;
        // todo createMaps call cannot be tested due to problems mocking imported functions
    });
});
