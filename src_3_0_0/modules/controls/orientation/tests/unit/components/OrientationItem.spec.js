import Vuex from "vuex";
import {config, createLocalVue, mount} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import OrientationItemComponent from "../../../components/OrientationItem.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src/modules/controls/orientation/components/OrientationItem.vue", () => {
    let store;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaced: true,
            modules: {
                Controls: {
                    namespaced: true,
                    modules: {
                        orientation: {
                            namespaced: true,
                            getters: {
                                geolocation: sinon.stub(),
                                poiModeCurrentPositionEnabled: sinon.stub(),
                                showPoi: sinon.stub(),
                                showPoiChoice: sinon.stub(),
                                showPoiIcon: sinon.stub()
                            }
                        }
                    }
                }
            },
            getters: {
                visibleLayerConfigs: sinon.stub()
            }
        });
    });

    after(() => {
        sinon.restore();
    });

    it("renders the Orientation component", () => {
        const wrapper = mount(OrientationItemComponent, {store, localVue});

        expect(wrapper.find(".orientationButtons").exists()).to.be.true;
        expect(wrapper.find("#geolocation_marker").exists()).to.be.true;
    });

    it("renders the Orientation button", () => {
        const wrapper = mount(OrientationItemComponent, {store, localVue});

        expect(wrapper.find("#geolocate").exists()).to.be.true;
    });

    it("will not render the Poi Orientation button", () => {
        const wrapper = mount(OrientationItemComponent, {store, localVue});

        expect(wrapper.find("#geolocatePOI").exists()).to.be.false;
    });

    it("will union the array", () => {
        const wrapper = mount(OrientationItemComponent, {store, localVue}),
            arr1 = [3, 3, 4],
            arr2 = [5, 6, 7],
            arr = [3, 4, 5, 6, 7];

        expect(wrapper.vm.union(arr1, arr2, (obj1, obj2) => obj1 === obj2)).to.deep.equal(arr);
    });

});
