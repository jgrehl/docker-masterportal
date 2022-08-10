import Vuex from "vuex";
import {expect} from "chai";
import sinon from "sinon";
import {shallowMount, createLocalVue} from "@vue/test-utils";
import AppComponent from "../../App.vue";
import mutations from "../../app-store/mutations";
import actions from "../../app-store/actions";


const localVue = createLocalVue();

localVue.use(Vuex);

describe("src_3_0_0/App.vue", () => {
    let store,
        wrapper,
        loadConfigJsonFn,
        loadRestServicesJson,
        loadServicesJson,
        loadConfigJs;

    beforeEach(() => {
        loadConfigJsonFn = actions.loadConfigJson;
        loadRestServicesJson = actions.loadRestServicesJson;
        loadServicesJson = actions.loadServicesJson;
        loadConfigJs = actions.loadConfigJs;
        actions.loadConfigJson = sinon.spy();
        actions.loadRestServicesJson = sinon.spy();
        actions.loadServicesJson = sinon.spy();
        actions.loadConfigJs = sinon.spy();

        store = new Vuex.Store({
            namespaced: true,
            getters: {
                allConfigsLoaded: sinon.stub(),
                configJs: sinon.stub(),
                portalConfig: sinon.stub()
            },
            mutations: mutations,
            actions: actions
        });
    });

    afterEach(() => {
        sinon.restore();
        actions.loadConfigJson = loadConfigJsonFn;
        actions.loadRestServicesJson = loadRestServicesJson;
        actions.loadServicesJson = loadServicesJson;
        actions.loadConfigJs = loadConfigJs;
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
});
