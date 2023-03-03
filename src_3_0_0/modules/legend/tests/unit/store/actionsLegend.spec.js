import {expect} from "chai";
import sinon from "sinon";
import validator from "../../../js/validator";
import layerCollection from "../../../../../core/layers/js/layerCollection";
import layerFactory from "../../../../../core/layers/js/layerFactory";
import legendDraw from "../../../js/legendDraw";
import actions from "../../../store/actionsLegend";

const {
    addLegend,
    sortLegend,
    removeLegend,
    createLegendForLayerInfo,
    prepareLegend,
    prepareLegendForGroupLayer
} = actions;

describe("src_3_0_0/modules/legend/store/actionsLegend.js", () => {
    let commit,
        dispatch;

    beforeEach(() => {
        commit = sinon.spy();
        dispatch = sinon.spy();
        sinon.stub(validator, "isValidLegendObj").returns(true);
    });

    afterEach(sinon.restore);


    it("addLegend should add legend to legends", () => {
        const payload = {
                id: "123",
                name: "foobar",
                legend: ["getLegendGraphicRequest"],
                position: 1
            },
            state = {
                legends: []
            };

        addLegend({state, commit}, payload);
        expect(commit.calledOnce).to.be.true;
        expect(commit.firstCall.args[0]).to.be.equals("setLegends");
        expect(commit.firstCall.args[1]).to.be.deep.equals([payload]);
    });


    it("sortLegend should sort legends by position descending", () => {
        const state = {
                legends: [{
                    id: "123",
                    name: "foobar",
                    legend: ["getLegendGraphicRequest"],
                    position: 1
                },
                {
                    id: "789",
                    name: "barfoo",
                    legend: ["getLegendGraphicRequest"],
                    position: 3
                },
                {
                    id: "456",
                    name: "foofoo",
                    legend: ["getLegendGraphicRequest"],
                    position: 2
                }]
            },
            sorted = [
                {
                    id: "789",
                    name: "barfoo",
                    legend: ["getLegendGraphicRequest"],
                    position: 3
                },
                {
                    id: "456",
                    name: "foofoo",
                    legend: ["getLegendGraphicRequest"],
                    position: 2
                },
                {
                    id: "123",
                    name: "foobar",
                    legend: ["getLegendGraphicRequest"],
                    position: 1
                }
            ];

        sortLegend({state, commit});
        expect(commit.calledOnce).to.be.true;
        expect(commit.firstCall.args[0]).to.be.equals("setLegends");
        expect(commit.firstCall.args[1]).to.be.deep.equals(sorted);
    });


    it("removeLegend should remove legend by id", () => {
        const state = {
                legends: [{
                    id: "789",
                    name: "barfoo",
                    legend: ["getLegendGraphicRequest"],
                    position: 3
                },
                {
                    id: "456",
                    name: "foofoo",
                    legend: ["getLegendGraphicRequest"],
                    position: 2
                },
                {
                    id: "123",
                    name: "foobar",
                    legend: ["getLegendGraphicRequest"],
                    position: 1
                }]
            },
            payload = "456",
            legendsAfterRemove = [
                {
                    id: "789",
                    name: "barfoo",
                    legend: ["getLegendGraphicRequest"],
                    position: 3
                },
                {
                    id: "123",
                    name: "foobar",
                    legend: ["getLegendGraphicRequest"],
                    position: 1
                }
            ];

        removeLegend({state, commit}, payload);
        expect(commit.calledOnce).to.be.true;
        expect(commit.firstCall.args[0]).to.be.equals("setLegends");
        expect(commit.firstCall.args[1]).to.be.deep.equals(legendsAfterRemove);
    });

    describe("createLegendForLayerInfo", () => {
        let layerAttributes,
            layerConfig,
            layer,
            getters,
            rootGetters;

        beforeEach(() => {
            layerAttributes = {
                id: "123",
                name: "foobar",
                type: "WMS"
            };
            layerConfig = {
                id: layerAttributes.id,
                name: layerAttributes.name,
                legend: ["getLegendGraphicRequest"],
                position: 1
            };
            layer = {
                id: layerAttributes.id,
                get: (key) => {
                    return layerAttributes[key];
                },
                getLegend: () => layerConfig.legend,
                getLayerSource: () => [],
                getLayer: () => {
                    return {
                        getZIndex: () => 1
                    };
                }
            };
            getters = {
                preparedLegend: ["getLegendGraphicRequest"]
            };
            rootGetters = {
                layerConfigById: () => layerConfig
            };

        });

        it("for visible layer should commit LayerInfoLegend", () => {
            sinon.stub(layerCollection, "getLayerById").returns(layer);

            createLegendForLayerInfo({commit, dispatch, getters, rootGetters}, layerConfig.id);
            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.be.equals("setLayerInfoLegend");
            expect(commit.firstCall.args[1]).to.be.deep.equals({
                id: layerAttributes.id,
                name: layerAttributes.name,
                legend: ["getLegendGraphicRequest"],
                position: 1
            });
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.be.equals("prepareLegend");
            expect(dispatch.firstCall.args[1]).to.be.deep.equals(layerConfig.legend);
        });

        it("for not visible layer should commit LayerInfoLegend", () => {
            sinon.stub(layerCollection, "getLayerById").returns(null);
            sinon.stub(layerFactory, "createLayer").returns(layer);

            createLegendForLayerInfo({commit, dispatch, getters, rootGetters}, layerConfig.id);
            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.be.equals("setLayerInfoLegend");
            expect(commit.firstCall.args[1]).to.be.deep.equals({
                id: layerAttributes.id,
                name: layerAttributes.name,
                legend: ["getLegendGraphicRequest"],
                position: 1
            });
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.be.equals("prepareLegend");
            expect(dispatch.firstCall.args[1]).to.be.deep.equals(layerConfig.legend);
        });

        it("for visible group-layer should commit LayerInfoLegend", () => {
            layerAttributes.typ = "GROUP";
            sinon.stub(layerCollection, "getLayerById").returns(layer);

            createLegendForLayerInfo({commit, dispatch, getters, rootGetters}, layerConfig.id);
            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.be.equals("setLayerInfoLegend");
            expect(commit.firstCall.args[1]).to.be.deep.equals({
                id: layerAttributes.id,
                name: layerAttributes.name,
                legend: ["getLegendGraphicRequest"],
                position: 1
            });
            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args[0]).to.be.equals("prepareLegendForGroupLayer");
            expect(dispatch.firstCall.args[1]).to.be.deep.equals(layer.getLayerSource());
        });
    });
    describe("prepareLegend", () => {
        it("prepareLegend with urls", () => {
            const legendInfos = ["legendUrl1", "legendUrl2"],
                legendObj = {
                    label: "name",
                    geometryType: "Point",
                    styleObject: {}
                };

            sinon.stub(legendDraw, "prepare").returns(legendObj);

            prepareLegend({commit}, legendInfos);
            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.be.equals("setPreparedLegend");
            expect(commit.firstCall.args[1]).to.be.deep.equals(legendInfos);
        });

        it("prepareLegend with objects in legendInfos", () => {
            const
                legendObj = {
                    label: "name",
                    geometryType: "Point",
                    styleObject: {}
                },
                legendInfos = [legendObj, legendObj];

            sinon.stub(legendDraw, "prepare").returns(legendObj);

            prepareLegend({commit}, legendInfos);
            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.be.equals("setPreparedLegend");
            expect(commit.firstCall.args[1]).to.be.deep.equals(legendInfos);
        });

        it("prepareLegend with array in legendObj", () => {
            const
                legendObj = {
                    label: "name",
                    geometryType: "Point",
                    styleObject: {}
                },
                legendInfos = [legendObj];

            sinon.stub(legendDraw, "prepare").returns([legendObj, legendObj]);

            prepareLegend({commit}, legendInfos);
            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.be.equals("setPreparedLegend");
            expect(commit.firstCall.args[1]).to.be.deep.equals([legendObj, legendObj]);
        });

        it("prepareLegend with wms style", () => {
            const
                legendObj = {
                    name: "name",
                    graphic: {}
                },
                legendInfos = [legendObj];

            sinon.stub(legendDraw, "prepare").returns({});

            prepareLegend({commit}, legendInfos);
            expect(commit.calledOnce).to.be.true;
            expect(commit.firstCall.args[0]).to.be.equals("setPreparedLegend");
            expect(commit.firstCall.args[1]).to.be.deep.equals(legendInfos);
        });
    });


    it("prepareLegendForGroupLayer", () => {
        const layer1 = {
                id: "1",
                getLegend: () => ["legendUrl1"]
            },
            layer2 = {
                id: "2",
                getLegend: () => ["legendUrl2"]
            },
            layerSource = [
                layer1,
                layer2
            ],
            getters = {
                preparedLegend: ["getLegendGraphicRequest"]
            };

        sinon.stub(legendDraw, "prepare").returns({});

        prepareLegendForGroupLayer({commit, dispatch, getters}, layerSource);
        expect(commit.calledOnce).to.be.true;
        expect(commit.firstCall.args[0]).to.be.equals("setPreparedLegend");
        expect(commit.firstCall.args[1]).to.be.deep.equals(["getLegendGraphicRequest", "getLegendGraphicRequest"]);
        expect(dispatch.calledTwice).to.be.true;
        expect(dispatch.firstCall.args[0]).to.be.equals("prepareLegend");
        expect(dispatch.firstCall.args[1]).to.be.deep.equals(["legendUrl1"]);
        expect(dispatch.secondCall.args[0]).to.be.equals("prepareLegend");
        expect(dispatch.secondCall.args[1]).to.be.deep.equals(["legendUrl2"]);
    });


});
