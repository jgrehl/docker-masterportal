import Vuex from "vuex";
import {expect} from "chai";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import RoutingDistanceDisplayComponent from "../../../components/RoutingDistanceDisplay.vue";
import thousandsSeparator from "../../../../../shared/js/utils/thousandsSeparator";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src/modules/routing/components/RoutingDistanceDisplay.vue", () => {
    let store,
        wrapper,
        props;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaced: true
        });

        props = {
            distance: 1
        };
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
    });

    it("renders RoutingDistanceDisplayComponent", () => {
        wrapper = shallowMount(RoutingDistanceDisplayComponent, {
            store,
            localVue,
            propsData: props
        });
        expect(wrapper.find("span").exists()).to.be.true;
    });

    it("renders distance in m", () => {
        props.distance = 999;
        wrapper = shallowMount(RoutingDistanceDisplayComponent, {
            store,
            localVue,
            propsData: props
        });
        expect(wrapper.find("span").text()).equal("999 m");
    });

    it("renders distance in km", () => {
        props.distance = 1234;
        wrapper = shallowMount(RoutingDistanceDisplayComponent, {
            store,
            localVue,
            propsData: props
        });
        const expectedResult = thousandsSeparator(1.2);

        expect(wrapper.find("span").text()).equal(`${expectedResult} km`);
    });
});
