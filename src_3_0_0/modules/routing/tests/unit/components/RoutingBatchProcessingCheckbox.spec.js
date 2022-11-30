import Vuex from "vuex";
import {expect} from "chai";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import RoutingBatchProcessingCheckboxComponent from "../../../components/RoutingBatchProcessingCheckbox.vue";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src/modules/routing/components/RoutingBatchProcessingCheckbox.vue", () => {
    let store,
        wrapper,
        props;

    beforeEach(() => {
        store = new Vuex.Store({
            namespaced: true,
            modules: {
            }
        });

        props = {
            batchProcessing: {
                active: false
            }
        };
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
    });

    it("renders RoutingBatchProcessingCheckboxComponent", () => {
        wrapper = shallowMount(RoutingBatchProcessingCheckboxComponent, {
            store,
            localVue,
            propsData: props
        });
        expect(wrapper.find("#routing-batch-processing-checkbox").exists()).to.be.true;
        expect(wrapper.find("input").element.checked).to.be.false;
    });

    it("changes checked input", () => {
        props.batchProcessing.active = true;
        wrapper = shallowMount(RoutingBatchProcessingCheckboxComponent, {
            store,
            localVue,
            propsData: props
        });
        expect(wrapper.find("input").element.checked).to.be.true;
    });


    it("emits input on change", async () => {
        wrapper = shallowMount(RoutingBatchProcessingCheckboxComponent, {
            store,
            localVue,
            propsData: props
        });
        const input = wrapper.find("input");

        input.element.checked = true;
        input.trigger("input");
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted().input.length).equal(1);
        expect(wrapper.emitted().input[0]).deep.to.equal([true]);
    });
});