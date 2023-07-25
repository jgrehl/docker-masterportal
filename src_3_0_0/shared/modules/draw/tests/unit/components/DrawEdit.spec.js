import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import {expect} from "chai";
import Feature from "ol/Feature.js";
import modifyInteractions from "@masterportal/masterportalapi/src/maps/interactions/modifyInteractions";
import {pointerMove} from "ol/events/condition.js";
import selectInteractions from "@masterportal/masterportalapi/src/maps/interactions/selectInteractions";
import sinon from "sinon";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector";

import DrawEditComponent from "../../../components/DrawEdit.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/shared/modules/draw/components/DrawEdit.vue", () => {
    let addInteractionSpy,
        createModifyInteractionSpy,
        createSelectInteractionSpy,
        layer,
        removeInteractionSpy,
        removeSelectedFeatureSpy,
        store,
        wrapper;

    beforeEach(() => {
        addInteractionSpy = sinon.spy();
        createModifyInteractionSpy = sinon.spy(modifyInteractions, "createModifyInteraction");
        createSelectInteractionSpy = sinon.spy(selectInteractions, "createSelectInteraction");
        layer = new VectorLayer({source: new VectorSource()});
        removeSelectedFeatureSpy = sinon.spy(selectInteractions, "removeSelectedFeature");
        removeInteractionSpy = sinon.spy();


        store = createStore({
            namespaces: true,
            modules: {
                Maps: {
                    namespaced: true,
                    actions: {
                        addInteraction: addInteractionSpy,
                        removeInteraction: removeInteractionSpy
                    },
                    getters: {
                        projection: () => "EPSG:4326"
                    }
                }
            }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it("renders the drawEdits, if undoFeatures or redoFeatures length > 0", async () => {
        wrapper = shallowMount(DrawEditComponent, {
            propsData: {
                layer
            },
            global: {
                plugins: [store]
            }
        });

        wrapper.setData({undoFeatures: ["feature"]});
        await wrapper.vm.$nextTick();

        expect(wrapper.find("#draw-edit-deleteAll").exists()).to.be.true;
        expect(wrapper.find("#draw-edit-deleteAll").attributes().aria).to.equals("common:shared.modules.draw.drawEdit.deleteAll");

        expect(wrapper.find("#draw-edit-delete").exists()).to.be.true;
        expect(wrapper.find("#draw-edit-delete").attributes().aria).to.equals("common:shared.modules.draw.drawEdit.delete");

        expect(wrapper.find("#draw-edit-edit").exists()).to.be.true;
        expect(wrapper.find("#draw-edit-edit").attributes().aria).to.equals("common:shared.modules.draw.drawEdit.edit");

        expect(wrapper.find("#draw-edit-undo").exists()).to.be.true;
        expect(wrapper.find("#draw-edit-undo").attributes().aria).to.equals("common:shared.modules.draw.drawEdit.undo");

        expect(wrapper.find("#draw-edit-redo").exists()).to.be.true;
        expect(wrapper.find("#draw-edit-redo").attributes().aria).to.equals("common:shared.modules.draw.drawEdit.redo");
    });

    describe("regulateDelete", () => {
        it("should create select interactons for deleteting features", () => {
            wrapper = shallowMount(DrawEditComponent, {
                propsData: {
                    layer
                },
                global: {
                    plugins: [store]
                }
            });

            wrapper.vm.regulateDelete();

            expect(createSelectInteractionSpy.calledTwice).to.be.true;
            expect(createSelectInteractionSpy.firstCall.args[0]).to.deep.equals(layer);
            expect(createSelectInteractionSpy.secondCall.args[0]).to.deep.equals(layer);
            expect(createSelectInteractionSpy.secondCall.args[1]).to.deep.equals(pointerMove);

            expect(removeSelectedFeatureSpy.calledOnce).to.be.true;
            expect(removeSelectedFeatureSpy.firstCall.args[0]).to.deep.equals(wrapper.vm.currentSelectInteractions[0]);
            expect(removeSelectedFeatureSpy.firstCall.args[1]).to.deep.equals(wrapper.vm.source);

            expect(addInteractionSpy.calledTwice).to.be.true;
            expect(addInteractionSpy.firstCall.args[1]).to.deep.equals(wrapper.vm.currentSelectInteractions[0]);
            expect(addInteractionSpy.secondCall.args[1]).to.deep.equals(wrapper.vm.currentSelectInteractions[1]);
        });
    });

    describe("regulateDeleteAll", () => {
        it("should clear vector source", async () => {
            wrapper = shallowMount(DrawEditComponent, {
                propsData: {
                    layer
                },
                global: {
                    plugins: [store]
                }
            });

            wrapper.vm.regulateDeleteAll();

            expect(wrapper.vm.mode).to.equals("");
            expect(wrapper.vm.source.getFeatures()).to.deep.equals([]);
        });
    });

    describe("regulateModify", () => {
        it("should create modify interaction", async () => {
            wrapper = shallowMount(DrawEditComponent, {
                propsData: {
                    layer
                },
                global: {
                    plugins: [store]
                }
            });

            wrapper.vm.regulateModify();

            expect(createModifyInteractionSpy.calledOnce).to.be.true;
            expect(createModifyInteractionSpy.firstCall.args[0]).to.deep.equals(wrapper.vm.source);

            expect(removeInteractionSpy.calledOnce).to.be.true;
            expect(removeInteractionSpy.firstCall.args[1]).to.be.null;

            expect(addInteractionSpy.calledOnce).to.be.true;
            expect(addInteractionSpy.firstCall.args[1]).to.deep.equals(wrapper.vm.currentModifyInteraction);
        });
    });

    describe("regulateUndo and regulateRedo", () => {
        let undoRedoFeaturesSpy;

        beforeEach(() => {
            wrapper = shallowMount(DrawEditComponent, {
                propsData: {
                    layer
                },
                global: {
                    plugins: [store]
                }
            });

            undoRedoFeaturesSpy = sinon.spy(wrapper.vm, "undoRedoFeatures");
        });

        it("should start undoRedoFeatures with 'undo'", async () => {
            wrapper.vm.regulateUndo();

            expect(undoRedoFeaturesSpy.calledOnce).to.be.true;
            expect(undoRedoFeaturesSpy.firstCall.args[0]).to.deep.equals(wrapper.vm.undoFeatures);
            expect(undoRedoFeaturesSpy.firstCall.args[1]).to.equals("undo");
        });

        it("should start undoRedoFeatures with 'redo'", async () => {
            wrapper.vm.regulateRedo();

            expect(undoRedoFeaturesSpy.calledOnce).to.be.true;
            expect(undoRedoFeaturesSpy.firstCall.args[0]).to.deep.equals(wrapper.vm.redoFeatures);
            expect(undoRedoFeaturesSpy.firstCall.args[1]).to.equals("redo");
        });
    });

    describe("undoRedoFeatures", () => {
        let feature1,
            feature2,
            undoRedoFeatureArraySpy;

        beforeEach(() => {
            wrapper = shallowMount(DrawEditComponent, {
                propsData: {
                    layer
                },
                global: {
                    plugins: [store]
                }
            });

            undoRedoFeatureArraySpy = sinon.spy(wrapper.vm, "undoRedoFeatureArray");

            feature1 = new Feature();
            feature2 = new Feature();
        });

        it("should remove the last feature from source, if feature mode is 'draw'", async () => {
            const features = [
                    {
                        feature: feature1,
                        mode: "draw"
                    },
                    {
                        feature: feature2,
                        mode: "draw"
                    }
                ],
                mode = "undo";

            wrapper.vm.source.addFeatures([feature1, feature2]);
            wrapper.vm.undoRedoFeatures(features, mode);

            expect(wrapper.vm.source.getFeatures().length).to.equals(1);
            expect(wrapper.vm.source.getFeatures()[0]).to.deep.equals(feature1);
        });

        it("should add the last feature from source, if feature mode is 'delete'", async () => {
            const features = [
                    {
                        feature: feature1,
                        mode: "delete"
                    },
                    {
                        feature: feature2,
                        mode: "delete"
                    }
                ],
                mode = "redo";

            wrapper.vm.source.addFeatures([feature1]);
            wrapper.vm.undoRedoFeatures(features, mode);

            expect(wrapper.vm.source.getFeatures().length).to.equals(2);
            expect(wrapper.vm.source.getFeatures()[0]).to.deep.equals(feature1);
            expect(wrapper.vm.source.getFeatures()[1]).to.deep.equals(feature2);
        });

        it("should start undoRedoFeatureArraySpy, if the last feature is an array", () => {
            const features = [
                    [
                        feature1,
                        feature2
                    ]
                ],
                mode = "redo";

            wrapper.vm.undoRedoFeatures(features, mode);

            expect(undoRedoFeatureArraySpy.calledOnce).to.be.true;
            expect(undoRedoFeatureArraySpy.firstCall.args[0]).to.equals(mode);
            expect(undoRedoFeatureArraySpy.firstCall.args[1]).to.deep.equals(features);
            expect(undoRedoFeatureArraySpy.firstCall.args[2]).to.deep.equals(wrapper.vm.source);
        });
    });

    describe("undoRedoFeatureArray", () => {
        let feature1,
            feature2;

        beforeEach(() => {
            feature1 = new Feature();
            feature2 = new Feature();
        });

        it("should add all features to vector source, if mode === undo", () => {
            const mode = "undo",
                features = [
                    [
                        feature1,
                        feature2
                    ]
                ];

            wrapper = shallowMount(DrawEditComponent, {
                propsData: {
                    layer
                },
                global: {
                    plugins: [store]
                }
            });

            wrapper.vm.undoRedoFeatureArray(mode, features, wrapper.vm.source);

            expect(wrapper.vm.source.getFeatures().length).to.equals(2);
            expect(wrapper.vm.source.getFeatures()[0]).to.deep.equals(feature1);
            expect(wrapper.vm.source.getFeatures()[1]).to.deep.equals(feature2);
            expect(wrapper.vm.redoFeatures.length).to.equals(1);
            expect(wrapper.vm.redoFeatures[0]).to.deep.equals([feature1, feature2]);
            expect(wrapper.vm.mode).to.equals("");
        });

        it("should remove all features from vector source, if mode === redo", async () => {
            const mode = "redo",
                features = [
                    [
                        feature1,
                        feature2
                    ]
                ];

            layer.getSource().addFeatures([feature1, feature2]);

            wrapper = shallowMount(DrawEditComponent, {
                propsData: {
                    layer
                },
                global: {
                    plugins: [store]
                }
            });

            wrapper.vm.undoRedoFeatureArray(mode, features, wrapper.vm.source);
            await wrapper.vm.$nextTick();

            expect(wrapper.vm.source.getFeatures().length).to.equals(0);
            expect(wrapper.vm.undoFeatures.length).to.equals(1);
            expect(wrapper.vm.undoFeatures[0]).to.deep.equals([feature1, feature2]);
            expect(wrapper.vm.mode).to.equals("");
        });
    });

    describe("changeUndoRedoFeatures", () => {
        it("should move feature from undoFeatures to redoFeatures, if mode === undo", () => {
            const feature = new Feature(),
                mode = "draw";

            wrapper = shallowMount(DrawEditComponent, {
                propsData: {
                    layer
                },
                global: {
                    plugins: [store]
                }
            });

            wrapper.setData({mode: "undo"});
            wrapper.vm.changeUndoRedoFeatures(feature, mode);

            expect(wrapper.vm.mode).to.equals("");
            expect(wrapper.vm.undoFeatures).to.deep.equals([]);
            expect(wrapper.vm.redoFeatures).to.deep.equals([
                {
                    feature,
                    mode
                }
            ]);
        });

        it("should move feature from redoFeatures to undoFeatures, if mode === redo", () => {
            const feature = new Feature(),
                mode = "draw";

            wrapper = shallowMount(DrawEditComponent, {
                propsData: {
                    layer
                },
                global: {
                    plugins: [store]
                }
            });

            wrapper.setData({mode: "redo"});
            wrapper.vm.changeUndoRedoFeatures(feature, mode);

            expect(wrapper.vm.mode).to.equals("");
            expect(wrapper.vm.redoFeatures).to.deep.equals([]);
            expect(wrapper.vm.undoFeatures).to.deep.equals([
                {
                    feature,
                    mode
                }
            ]);
        });

        it("should add feature to undoFeatures and clear redofeatures, if mode === ''", () => {
            const feature = new Feature(),
                mode = "draw";

            wrapper = shallowMount(DrawEditComponent, {
                propsData: {
                    layer
                },
                global: {
                    plugins: [store]
                }
            });

            wrapper.setData({mode: "redo"});
            wrapper.vm.changeUndoRedoFeatures(feature, mode);

            expect(wrapper.vm.mode).to.equals("");
            expect(wrapper.vm.redoFeatures).to.deep.equals([]);
            expect(wrapper.vm.undoFeatures).to.deep.equals([
                {
                    feature,
                    mode
                }
            ]);
        });
    });
});
