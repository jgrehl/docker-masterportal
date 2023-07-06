import {createStore} from "vuex";
import {config, shallowMount} from "@vue/test-utils";
import drawInteractions from "@masterportal/masterportalapi/src/maps/interactions/drawInteractions";
import {expect} from "chai";
import sinon from "sinon";
import VectorSource from "ol/source/Vector";

import DrawTypesComponent from "../../../components/DrawTypes.vue";

config.global.mocks.$t = key => key;

describe("src_3_0_0/shared/modules/draw/components/DrawTypes.vue", () => {
    let addInteractionSpy,
        createDrawInteractionSpy,
        currentLayout,
        drawCircleSpy,
        removeInteractionSpy,
        setSelectedDrawType,
        source,
        store,
        wrapper;

    beforeEach(() => {
        addInteractionSpy = sinon.spy();
        createDrawInteractionSpy = sinon.spy(drawInteractions, "createDrawInteraction");
        currentLayout = {
            fillColor: [55, 126, 184],
            fillTransparency: 0,
            strokeColor: [0, 0, 0],
            strokeWidth: 1
        };
        drawCircleSpy = sinon.spy(drawInteractions, "drawCircle");
        removeInteractionSpy = sinon.spy();
        setSelectedDrawType = sinon.stub();
        source = new VectorSource();


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

    it("renders the drawTypes", () => {
        wrapper = shallowMount(DrawTypesComponent, {
            propsData: {
                currentLayout,
                setSelectedDrawType,
                source
            },
            global: {
                plugins: [store]
            }
        });

        expect(wrapper.find("#draw-pen").exists()).to.be.true;
        expect(wrapper.find("#draw-pen").attributes().aria).to.equals("common:shared.modules.draw.drawTypes.pen");

        expect(wrapper.find("#draw-geometries").exists()).to.be.true;
        expect(wrapper.find("#draw-geometries").attributes().aria).to.equals("common:shared.modules.draw.drawTypes.geometries");

        expect(wrapper.find("#draw-symbols").exists()).to.be.true;
        expect(wrapper.find("#draw-symbols").attributes().aria).to.equals("common:shared.modules.draw.drawTypes.symbols");
    });

    describe("regulateInteraction", () => {
        it("should remove current interaction and add new interaction", () => {
            const drawType = "pen";

            wrapper = shallowMount(DrawTypesComponent, {
                propsData: {
                    currentLayout,
                    setSelectedDrawType,
                    source
                },
                global: {
                    plugins: [store]
                }
            });

            wrapper.vm.regulateInteraction(drawType);

            expect(removeInteractionSpy.calledTwice).to.be.true;
            expect(addInteractionSpy.calledOnce).to.be.true;
        });
    });

    describe("regulateInteraction", () => {
        it("should remove current interaction and don't add interaction, if drawType is missing", () => {
            const drawType = "abc";

            wrapper = shallowMount(DrawTypesComponent, {
                propsData: {
                    currentLayout,
                    setSelectedDrawType,
                    source
                },
                global: {
                    plugins: [store]
                }
            });

            wrapper.vm.regulateInteraction(drawType);

            expect(removeInteractionSpy.calledTwice).to.be.true;
            expect(addInteractionSpy.notCalled).to.be.true;
        });
    });

    describe("regulateDrawInteraction", () => {
        it("should create 'box' draw interaction and add interaction ", () => {
            const drawType = "box";

            wrapper = shallowMount(DrawTypesComponent, {
                propsData: {
                    currentLayout,
                    setSelectedDrawType,
                    source
                },
                global: {
                    plugins: [store]
                }
            });

            wrapper.vm.regulateDrawInteraction(drawType);

            expect(createDrawInteractionSpy.calledOnce).to.be.true;
            expect(createDrawInteractionSpy.firstCall.args[0]).to.equals(drawType);
            expect(createDrawInteractionSpy.firstCall.args[1]).to.deep.equals(source);
            expect(addInteractionSpy.calledOnce).to.be.true;
        });

        it("should create 'circle' draw interaction and add interaction ", () => {
            const drawType = "circle";

            wrapper = shallowMount(DrawTypesComponent, {
                propsData: {
                    currentLayout,
                    setSelectedDrawType,
                    source
                },
                global: {
                    plugins: [store]
                }
            });

            wrapper.vm.regulateDrawInteraction(drawType);

            expect(createDrawInteractionSpy.calledOnce).to.be.true;
            expect(createDrawInteractionSpy.firstCall.args[0]).to.equals(drawType);
            expect(createDrawInteractionSpy.firstCall.args[1]).to.deep.equals(source);
            expect(drawCircleSpy.calledOnce).to.be.true;
            expect(drawCircleSpy.firstCall.args[0]).to.deep.equals(wrapper.vm.drawInteraction);
            expect(drawCircleSpy.firstCall.args[1]).to.equals(drawType);
            expect(drawCircleSpy.firstCall.args[2]).to.equals("EPSG:4326");
            expect(drawCircleSpy.firstCall.args[3]).to.deep.equals(source);
            expect(drawCircleSpy.firstCall.args[4]).to.deep.equals({
                innerRadius: 0,
                interactive: true,
                outerRadius: 0
            });
            expect(addInteractionSpy.calledOnce).to.be.true;
        });
    });

    describe("regulateStaticCircleInteraction", () => {
        it("should start drawCircle", () => {
            const drawType = "circle";

            wrapper = shallowMount(DrawTypesComponent, {
                propsData: {
                    currentLayout,
                    setSelectedDrawType,
                    source
                },
                global: {
                    plugins: [store]
                }
            });

            wrapper.vm.regulateStaticCircleInteraction(drawType);

            expect(drawCircleSpy.calledOnce).to.be.true;
            expect(drawCircleSpy.firstCall.args[0]).to.deep.equals(wrapper.vm.drawInteraction);
            expect(drawCircleSpy.firstCall.args[1]).to.equals(drawType);
            expect(drawCircleSpy.firstCall.args[2]).to.equals("EPSG:4326");
            expect(drawCircleSpy.firstCall.args[3]).to.deep.equals(source);
            expect(drawCircleSpy.firstCall.args[4]).to.deep.equals({
                innerRadius: 0,
                interactive: true,
                outerRadius: 0
            });
        });
    });
});
