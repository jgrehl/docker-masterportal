import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import BufferAnalysisComponent from "../../../components/BufferAnalysis.vue";
import BufferAnalysis from "../../../store/indexBufferAnalysis";
import {expect} from "chai";
import sinon from "sinon";
import {createLayersArray} from "../utils/functions";
import FakeTimers from "@sinonjs/fake-timers";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/bufferAnalysis/components/BufferAnalysis.vue", () => {
    let store, originalCheckIntersection, originalShowBuffer, originalApplyValuesFromSavedUrlBuffer, wrapper;

    before(() => {
        mapCollection.clear();
        const map = {
            id: "ol",
            mode: "2D",
            removeLayer: sinon.spy()
        };

        mapCollection.addMap(map, "2D");
    });

    beforeEach(() => {
        originalCheckIntersection = BufferAnalysis.actions.checkIntersection;
        originalShowBuffer = BufferAnalysis.actions.showBuffer;
        originalApplyValuesFromSavedUrlBuffer = BufferAnalysis.actions.applyValuesFromSavedUrlBuffer;
        BufferAnalysis.actions.checkIntersection = sinon.spy();
        BufferAnalysis.actions.showBuffer = sinon.spy();
        BufferAnalysis.actions.applyValuesFromSavedUrlBuffer = sinon.spy();

        store = createStore({
            namespaces: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        BufferAnalysis
                    }
                },
                Maps: {
                    namespaced: true,
                    mode: "2D"
                }
            }
        });
        store.commit("Modules/BufferAnalysis/setActive", true);
    });

    afterEach(() => {
        const map = {
            id: "ol",
            mode: "2D",
            addLayer: sinon.spy(),
            removeLayer: sinon.spy()
        };

        mapCollection.clear();
        mapCollection.addMap(map, "2D");
        BufferAnalysis.actions.checkIntersection = originalCheckIntersection;
        BufferAnalysis.actions.showBuffer = originalShowBuffer;
        BufferAnalysis.actions.applyValuesFromSavedUrlBuffer = originalApplyValuesFromSavedUrlBuffer;
        store.commit("Modules/BufferAnalysis/setActive", false);
        store.commit("Modules/BufferAnalysis/setSelectOptions", []);
        store.commit("Modules/BufferAnalysis/setBufferRadius", 0);
        store.dispatch("Modules/BufferAnalysis/resetModule");
        if (wrapper) {
            wrapper.destroy();
        }
    });

    it("renders the bufferAnalysis", () => {
        wrapper = shallowMount(BufferAnalysisComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#tool-bufferAnalysis").exists()).to.be.true;
    });

    it("do not render the bufferAnalysiss select if not active", () => {
        store.commit("Modules/BufferAnalysis/setActive", false);
        wrapper = shallowMount(BufferAnalysisComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#tool-bufferAnalysis").exists()).to.be.false;
    });

    it("has initially set nothing to layer-analysis-select-source and layer-analysis-select-target", () => {
        wrapper = shallowMount(BufferAnalysisComponent, {
            global: {
                plugins: [store]
            }});
        const selectSource = wrapper.find("#tool-bufferAnalysis-selectSourceInput"),
            selectTarget = wrapper.find("#tool-bufferAnalysis-selectTargetInput");

        expect(selectSource.element.value).to.equals("");
        expect(selectTarget.element.value).to.equals("");
    });

    it("has initially set eight available options to select", async () => {
        wrapper = shallowMount(BufferAnalysisComponent, {
            global: {
                plugins: [store]
            }});
        const layers = createLayersArray(3);
        let options = [];

        await store.commit("Modules/BufferAnalysis/setSelectOptions", layers);
        await wrapper.vm.$nextTick();

        options = wrapper.findAll("option");
        expect(options.length).to.equals(8); // 2 * 3 (selectOptions) + 2 (resultType)
    });

    it("triggers showBuffer action when source layer and buffer radius are set", async () => {
        wrapper = shallowMount(BufferAnalysisComponent, {
            global: {
                plugins: [store]
            }});
        const selectSource = wrapper.find("#tool-bufferAnalysis-selectSourceInput"),
            range = wrapper.find("#tool-bufferAnalysis-radiusTextInput"),
            layers = createLayersArray(3),
            clock = FakeTimers.install();


        let sourceOptions = [];

        await store.commit("Modules/BufferAnalysis/setSelectOptions", layers);
        sourceOptions = selectSource.findAll("option");
        await wrapper.vm.$nextTick();

        sourceOptions.at(1).setSelected();
        await wrapper.vm.$nextTick();
        expect(layers[1].setIsSelected.calledOnce).to.equal(true);

        range.setValue(1000);
        await wrapper.vm.$nextTick();
        clock.tick(1000);
        expect(BufferAnalysis.actions.showBuffer.calledOnce).to.equal(true);
        clock.uninstall();
    });

    it("sets focus to first input control", async () => {
        const elem = document.createElement("div");

        if (document.body) {
            document.body.appendChild(elem);
        }
        // eslint-disable-next-line one-var
        // wrapper = shallowMount(BufferAnalysisComponent, {store, localVue, attachTo: elem});
        wrapper = shallowMount(BufferAnalysisComponent, {
            global: {
                plugins: [store]
            }});

        wrapper.vm.setFocusToFirstControl();
        await wrapper.vm.$nextTick();
        expect(wrapper.find("#tool-bufferAnalysis-selectSourceInput").element).to.equal(document.activeElement);
    });
});
