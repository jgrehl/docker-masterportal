import Vuex from "vuex";
import {config, shallowMount, createLocalVue} from "@vue/test-utils";
import {expect} from "chai";
import sinon from "sinon";
import MeasureInMapComponent from "../../../components/MeasureInMap.vue";
import MeasureModule from "../../../store/indexMeasure";
import View from "ol/View";

const localVue = createLocalVue();

localVue.use(Vuex);
config.mocks.$t = key => key;

describe("src_3_0_0/modules/measure/components/MeasureInMap.vue", () => {
    let store,
        wrapper,
        origcreateDrawInteraction,
        origdeleteFeatures,
        map;

    const mockConfigJson = {
        Portalconfig: {
            navigationSecondary: {
                sections: [
                    {
                        "type": "measure"
                    }
                ]
            }
        }
    };

    beforeEach(() => {

        mapCollection.clear();

        origcreateDrawInteraction = MeasureModule.actions.createDrawInteraction;
        origdeleteFeatures = MeasureModule.actions.deleteFeatures;
        MeasureModule.actions.createDrawInteraction = sinon.spy();
        MeasureModule.actions.deleteFeatures = sinon.spy();
        MeasureModule.mutations.setSelectedGeometry = sinon.spy();
        MeasureModule.mutations.setSelectedUnit = sinon.spy();

        store = new Vuex.Store({
            namespaces: true,
            modules: {
                namespaced: true,
                Modules: {
                    namespaced: true,
                    modules: {
                        namespaced: true,
                        Measure: MeasureModule
                    }
                },
                Maps: {
                    namespaced: true,
                    state: {
                        mode: "2D"
                    },
                    getters: {
                        layerById: () => id => ({})[id],
                        mode: () => "2D"
                    },
                    mutations: {
                        addLayerToMap: sinon.spy(),
                        setActive: sinon.spy()
                    },
                    actions: {
                        addInteraction: sinon.spy(),
                        removeInteraction: sinon.spy(),
                        addLayer: sinon.spy(),
                        checkLayer: sinon.spy()
                    }
                }
            },
            state: {
                configJson: mockConfigJson
            },
            getters: {
                uiStyle: () => ""
            }
        });

        store.commit("Modules/Measure/setActive", true);

    });

    afterEach(() => {
        if (wrapper) {
            wrapper.destroy();
        }
        MeasureModule.actions.createDrawInteraction = origcreateDrawInteraction;
        MeasureModule.actions.deleteFeatures = origdeleteFeatures;
        sinon.restore();
    });


    it("renders the measure tool with the expected form fields", () => {
        wrapper = shallowMount(MeasureInMapComponent, {store, localVue});

        expect(wrapper.find("#measure").exists()).to.be.true;
        expect(wrapper.find("#measure-tool-geometry-select").exists()).to.be.true;
        expect(wrapper.find("#measure-tool-unit-select").exists()).to.be.true;
        expect(wrapper.find(".inaccuracy-list").exists()).to.be.true;
        expect(wrapper.find("#measure-delete").exists()).to.be.true;
    });

    it("select element interaction produces expected mutations, actions, and updates", async () => {
        wrapper = shallowMount(MeasureInMapComponent, {store, localVue});
        const geometrySelect = wrapper.find("#measure-tool-geometry-select"),
            unitSelect = wrapper.find("#measure-tool-unit-select");

        // form initially "LineString" with m/km
        expect(geometrySelect.element.value).equals("LineString");
        expect(unitSelect.text())
            .to.contain("m")
            .and.to.contain("km")
            .and.not.to.contain("²");

        // select "Polygon" geometry
        geometrySelect.element.value = "Polygon";
        geometrySelect.trigger("change");
        await wrapper.vm.$nextTick();
        expect(MeasureModule.mutations.setSelectedGeometry.calledOnce).to.be.true;

        // draw interaction should have been remade on geometry change
        expect(MeasureModule.actions.createDrawInteraction.calledOnce).to.be.true;

        // after changing to "Polygon", m²/km² are the units
        expect(geometrySelect.element.value).equals("Polygon");

        // check if changing unit produces expected effects
        expect(unitSelect.element.value).equals("0");
        unitSelect.element.value = "1";
        unitSelect.trigger("change");
        await wrapper.vm.$nextTick();
        expect(unitSelect.element.value).equals("1");
        expect(MeasureModule.mutations.setSelectedUnit.calledOnce).to.be.true;

        // // no further draw interaction recreation should have happened
        expect(MeasureModule.actions.createDrawInteraction.calledOnce).to.be.true;
    });

    it("clicking delete will call the appropriate action", async () => {
        wrapper = shallowMount(MeasureInMapComponent, {store, localVue});
        const deleteButton = wrapper.find("#measure-delete");

        deleteButton.trigger("click");
        expect(MeasureModule.actions.deleteFeatures.calledOnce).to.be.true;
    });

    it("sets focus to first input control", async () => {
        const elem = document.createElement("div");

        if (document.body) {
            document.body.appendChild(elem);
        }
        wrapper = shallowMount(MeasureInMapComponent, {store, localVue, attachTo: elem});

        wrapper.vm.setFocusToFirstControl();
        await wrapper.vm.$nextTick();
        expect(wrapper.find("#measure-tool-geometry-select").element).to.equal(document.activeElement);
    });

    it("createDrawInteraction should not called if active is false and setSelectedGeometry is changend", async () => {
        store.commit("Modules/Measure/setActive", false);

        wrapper = shallowMount(MeasureInMapComponent, {store, localVue});

        store.commit("Modules/Measure/setSelectedGeometry", "123");
        await wrapper.vm.$nextTick;

        expect(MeasureModule.actions.createDrawInteraction.called).to.be.false;
    });

});
