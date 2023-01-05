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
    let store,
        checkIntersectionSpy,
        showBufferSpy,
        applyValuesFromSavedUrlBufferSpy,
        loadSelectOptionsSpy,
        wrapper;

    const mockConfigJson = {
        Portalconfig: {
            navigationSecondary: {
                sections: [
                    {
                        "type": "bufferAnalysis"
                    }
                ]
            }
        }
    };

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
        checkIntersectionSpy = sinon.spy();
        showBufferSpy = sinon.spy();
        applyValuesFromSavedUrlBufferSpy = sinon.spy();
        loadSelectOptionsSpy = sinon.spy();
        // BufferAnalysis.actions.checkIntersection = sinon.spy();
        // BufferAnalysis.actions.showBuffer = sinon.spy();
        // BufferAnalysis.actions.applyValuesFromSavedUrlBuffer = sinon.spy();
        // BufferAnalysis.actions.loadSelectOptions = sinon.spy();

        store = createStore({
            namespaces: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        namespaced: true,
                        BufferAnalysis: {
                            namespaced: true,
                            actions: {
                                checkIntersection: checkIntersectionSpy,
                                showBuffer: showBufferSpy,
                                applyValuesFromSavedUrlBuffer: applyValuesFromSavedUrlBufferSpy,
                                loadSelectOptions: loadSelectOptionsSpy
                            },
                            mutations: {
                                setActive: sinon.spy()
                            },
                            getters: {
                                active: () => sinon.stub(),
                                selectOptions: () => sinon.stub()
                            }
                        }
                    }
                },
                Maps: {
                    namespaced: true,
                    mode: "2D"
                }
            },
            state: {
                configJson: mockConfigJson
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
        // BufferAnalysis.actions.checkIntersection = originalCheckIntersection;
        // BufferAnalysis.actions.showBuffer = originalShowBuffer;
        // BufferAnalysis.actions.applyValuesFromSavedUrlBuffer = originalApplyValuesFromSavedUrlBuffer;
        // BufferAnalysis.actions.loadSelectOptions = originalLoadSelectOptions;
        // store.commit("Modules/BufferAnalysis/setActive", false);
        // store.commit("Modules/BufferAnalysis/setSelectOptions", []);
        // store.commit("Modules/BufferAnalysis/setBufferRadius", 0);
        // store.dispatch("Modules/BufferAnalysis/resetModule");
        sinon.restore();
    });

    it("renders the bufferAnalysis", () => {
        wrapper = shallowMount(BufferAnalysisComponent, {
            global: {
                plugins: [store]
            }});

        expect(wrapper.find("#tool-bufferAnalysis").exists()).to.be.true;
        expect(wrapper.find("#tool-bufferAnalysis").exists()).to.be.true;
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
        expect(options.length).to.equals(2);
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
