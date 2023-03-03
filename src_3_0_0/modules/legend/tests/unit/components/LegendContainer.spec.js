import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import layerCollection from "../../../../../core/layers/js/layerCollection";
import LegendContainer from "../../../components/LegendContainer.vue";
import Legend from "../../../store/indexLegend";
import {expect} from "chai";
import sinon from "sinon";

config.global.mocks.$t = key => key;

describe("src_3_0_0/modules/legend/components/LegendContainer.vue", () => {
    let store,
        wrapper,
        layersInCollection,
        visibleLayerConfigs,
        layer,
        layerAttributes;

    beforeEach(() => {
        layersInCollection = [];
        visibleLayerConfigs = [];
        layerAttributes = {
            id: "1132",
            name: "100 Jahre Stadtgruen POIs",
            visibility: true
        };
        layer = {
            id: "1132",
            get: (key) => {
                return layerAttributes[key];
            },
            getLegend: () => true,
            getLayerSource: () => []
        };

        Legend.actions.prepareLegend = sinon.stub().returns(true);
        Legend.actions.prepareLegendForGroupLayer = sinon.stub().returns(true);
        Legend.getters.preparedLegend = sinon.stub().returns(["url"]);
        Legend.actions.addLegend = sinon.spy();
        Legend.actions.removeLegend = sinon.spy();
        Legend.actions.sortLegend = sinon.spy();
        store = createStore({
            namespaces: true,
            modules: {
                Modules: {
                    namespaced: true,
                    modules: {
                        namespaced: true,
                        Legend
                    }

                }
            },
            getters: {
                uiStyle: () => "DEFAULT",
                visibleLayerConfigs: () => visibleLayerConfigs
            }
        });

        sinon.stub(layerCollection, "getLayers").returns(
            layersInCollection
        );
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("render LegendContainer", () => {
        it("renders the legend container without legends", () => {
            wrapper = shallowMount(LegendContainer, {
                global: {
                    plugins: [store]
                }});

            expect(wrapper.find("#legend").exists()).to.be.true;
        });
    });
    describe("LegendContainer.vue methods", () => {
        it("calls prepareLegend and addLegend, if layer is in collection", () => {
            layersInCollection.push(layer);
            wrapper = shallowMount(LegendContainer, {
                global: {
                    plugins: [store]
                }});

            expect(wrapper.find("#legend").exists()).to.be.true;
            expect(Legend.actions.prepareLegend.calledOnce).to.be.true;
            expect(Legend.actions.addLegend.calledOnce).to.be.true;
            expect(Legend.actions.addLegend.firstCall.args[1]).to.be.deep.equals({
                id: layerAttributes.id,
                name: layerAttributes.name,
                legend: ["url"]
            });
            expect(Legend.actions.sortLegend.calledOnce).to.be.true;
        });
        it("calls prepareLegend, removeLegend and addLegend, if legend changes", () => {
            layersInCollection.push(layer);
            sinon.stub(LegendContainer.methods, "isLegendChanged").returns(true);
            sinon.stub(LegendContainer.methods, "isLayerInLegend").returns(true);
            wrapper = shallowMount(LegendContainer, {
                global: {
                    plugins: [store]
                }});

            expect(wrapper.find("#legend").exists()).to.be.true;
            expect(Legend.actions.prepareLegend.calledOnce).to.be.true;
            expect(Legend.actions.removeLegend.calledOnce).to.be.true;
            expect(Legend.actions.removeLegend.firstCall.args[1]).to.be.equals(layerAttributes.id);
            expect(Legend.actions.addLegend.calledOnce).to.be.true;
            expect(Legend.actions.addLegend.firstCall.args[1]).to.be.deep.equals({
                id: layerAttributes.id,
                name: layerAttributes.name,
                legend: ["url"]
            });
            expect(Legend.actions.sortLegend.calledOnce).to.be.true;
        });
        it("calls prepareLegendForGroupLayer and addLegend, if layer has typ GROUP", () => {
            layerAttributes.typ = "GROUP";
            layersInCollection.push(layer);
            wrapper = shallowMount(LegendContainer, {
                global: {
                    plugins: [store]
                }});

            expect(wrapper.find("#legend").exists()).to.be.true;
            expect(Legend.actions.prepareLegendForGroupLayer.calledOnce).to.be.true;
            expect(Legend.actions.addLegend.calledOnce).to.be.true;
            expect(Legend.actions.addLegend.firstCall.args[1]).to.be.deep.equals({
                id: layerAttributes.id,
                name: layerAttributes.name,
                legend: ["url"]
            });
            expect(Legend.actions.sortLegend.calledOnce).to.be.true;
        });

        it("method generateId", () => {
            wrapper = shallowMount(LegendContainer, {
                global: {
                    plugins: [store]
                }});
            expect(wrapper.vm.generateId("Layername 1")).to.be.equals("legend_Layername_1");
            expect(wrapper.vm.generateId("Layername 1:")).to.be.equals("legend_Layername_1_");
            expect(wrapper.vm.generateId("Layername (1)")).to.be.equals("legend_Layername_1_");
            expect(wrapper.vm.generateId("Layername (/)")).to.be.equals("legend_Layername_");
            expect(wrapper.vm.generateId("Layername (//)")).to.be.equals("legend_Layername_");
            expect(wrapper.vm.generateId("Layername (/abc/)")).to.be.equals("legend_Layername_abc_");
        });

        it("method isLayerInLegend", () => {
            const legendObj = {
                id: "1",
                name: "layer_1",
                legend: ["link_to_legend"]
            };

            wrapper = shallowMount(LegendContainer, {
                global: {
                    plugins: [store]
                }});
            store.commit("Modules/Legend/setLegends", [legendObj]);
            expect(wrapper.vm.isLayerInLegend("id")).to.be.equals(false);
            expect(wrapper.vm.isLayerInLegend("1")).to.be.equals(true);
        });

        describe("method isLegendChanged", () => {
            it("returns true if legend changed", () => {
                const legendObj = {
                    id: "1",
                    name: "layer_1",
                    legend: ["link_to_legend"],
                    position: 1
                };

                wrapper = shallowMount(LegendContainer, {
                    global: {
                        plugins: [store]
                    }});
                store.commit("Modules/Legend/setLegends", [legendObj]);
                expect(wrapper.vm.isLegendChanged(legendObj.id, {
                    id: "1",
                    name: "layer_1",
                    legend: ["link_to_legend"],
                    position: 0
                })).to.be.equals(true);
                expect(wrapper.vm.isLegendChanged(legendObj.id, {
                    id: "1",
                    name: "layer_1",
                    legend: ["changed_link_to_legend"],
                    position: 1
                })).to.be.equals(true);
                expect(wrapper.vm.isLegendChanged(legendObj.id, {
                    id: "1",
                    name: "layer_1",
                    legend: ["link_to_legend", "new_link"],
                    position: 1
                })).to.be.equals(true);
                expect(wrapper.vm.isLegendChanged(legendObj.id, {
                    id: "1",
                    name: "changed_layer_1",
                    legend: ["link_to_legend"],
                    position: 1
                })).to.be.equals(true);
                expect(wrapper.vm.isLegendChanged(legendObj.id, {
                    id: "changed_1",
                    name: "layer_1",
                    legend: ["link_to_legend"],
                    position: 1
                })).to.be.equals(true);
                expect(wrapper.vm.isLegendChanged(legendObj.id, {
                    id: "2042",
                    name: "Festgestellte Änderungen – Berichtigungen – Nachrichtliche Übernahmen seit 1997",
                    legend: ["https://geodienste.hamburg.de/HH_WMS_FNP_Aend?VERSION=1.3.0&SERVICE=WMS&REQUEST=GetLegendGraphic&FORMAT=image/png&LAYER=fnp_aenderungsuebersicht_aenderungen_festgestellt"],
                    position: 2
                })).to.be.equals(true);
            });
            it("returns false if legend doesn't changed", () => {
                const legendObj = {
                    id: "1",
                    name: "layer_1",
                    legend: ["link_to_legend"],
                    position: 1
                };

                wrapper = shallowMount(LegendContainer, {
                    global: {
                        plugins: [store]
                    }});
                store.commit("Modules/Legend/setLegends", [legendObj]);
                expect(wrapper.vm.isLegendChanged(legendObj.id, legendObj)).to.be.equals(false);
            });
        });
        describe("watcher", () => {

            it("visibleLayerConfigs shall call toggleLayerInLegend with true", async () => {
                let toggleLayerInLegendStub = null;
                const config_1 = {
                        id: "1",
                        name: "layer_1"
                    },
                    config_2 = {
                        id: "2",
                        name: "layer_2"
                    },
                    newLayerConfigs = [config_1, config_2],
                    oldLayerConfigs = [config_1];

                sinon.stub(layerCollection, "getLayerById").callsFake(
                    function (id) {
                        if (id === "1") {
                            return config_1;
                        }
                        if (id === "2") {
                            return config_2;
                        }
                        return null;
                    }
                );
                toggleLayerInLegendStub = sinon.stub(LegendContainer.methods, "toggleLayerInLegend");
                wrapper = shallowMount(LegendContainer, {
                    global: {
                        plugins: [store]
                    }});

                wrapper.vm.$options.watch.visibleLayerConfigs.handler.call(wrapper.vm, newLayerConfigs, oldLayerConfigs);
                await wrapper.vm.$nextTick();
                expect(toggleLayerInLegendStub.calledOnce).to.be.true;
                expect(toggleLayerInLegendStub.firstCall.args[0]).to.be.deep.equals(config_2);
                expect(toggleLayerInLegendStub.firstCall.args[1]).to.be.equals(true);
            });

            it("visibleLayerConfigs shall call toggleLayerInLegend with false", async () => {
                let toggleLayerInLegendStub = null;
                const config_1 = {
                        id: "1",
                        name: "layer_1"
                    },
                    config_2 = {
                        id: "2",
                        name: "layer_2"
                    },
                    newLayerConfigs = [config_1],
                    oldLayerConfigs = [config_1, config_2];

                sinon.stub(layerCollection, "getLayerById").callsFake(
                    function (id) {
                        if (id === "1") {
                            return config_1;
                        }
                        if (id === "2") {
                            return config_2;
                        }
                        return null;
                    }
                );
                toggleLayerInLegendStub = sinon.stub(LegendContainer.methods, "toggleLayerInLegend");
                wrapper = shallowMount(LegendContainer, {
                    global: {
                        plugins: [store]
                    }});

                wrapper.vm.$options.watch.visibleLayerConfigs.handler.call(wrapper.vm, newLayerConfigs, oldLayerConfigs);
                await wrapper.vm.$nextTick();
                expect(toggleLayerInLegendStub.calledOnce).to.be.true;
                expect(toggleLayerInLegendStub.firstCall.args[0]).to.be.deep.equals(config_2);
                expect(toggleLayerInLegendStub.firstCall.args[1]).to.be.equals(false);
            });

            it("legendOnChanged shall call createLegend if legend available", () => {
                const createLegendSpy = sinon.spy(LegendContainer.methods, "createLegend");

                wrapper = shallowMount(LegendContainer, {
                    global: {
                        plugins: [store]
                    }});

                wrapper.vm.$options.watch.legendOnChanged.handler.call(wrapper.vm, {});
                // is called once on mounted
                expect(createLegendSpy.calledTwice).to.be.true;
            });

            it("legendOnChanged shall not call createLegend if legend not available", () => {
                const createLegendSpy = sinon.spy(LegendContainer.methods, "createLegend");

                wrapper = shallowMount(LegendContainer, {
                    global: {
                        plugins: [store]
                    }});

                wrapper.vm.$options.watch.legendOnChanged.handler.call(wrapper.vm);
                // is called once on mounted
                expect(createLegendSpy.calledOnce).to.be.true;
            });
        });
    });
});
