import {expect} from "chai";
import getters from "../../../store/gettersLegend";
import sinon from "sinon";

describe("src_3_0_0/modules/legend/store/gettersLegend.js", () => {
    // let warn;

    beforeEach(() => {
        // warn = sinon.spy();
        // sinon.stub(console, "warn").callsFake(warn);
    });

    afterEach(() => {
        sinon.restore();
    });

    it("isLayerInLegend", () => {
        const state = {
            legends: [
                {id: "layer1"},
                {id: "layer2"}
            ]
        };

        expect(getters.isLayerInLegend(state)("layer1")).to.be.true;
        expect(getters.isLayerInLegend(state)("layer2")).to.be.true;
        expect(getters.isLayerInLegend(state)("layer3")).to.be.false;
        expect(getters.isLayerInLegend(state)(undefined)).to.be.false;
        expect(getters.isLayerInLegend(state)(null)).to.be.false;
    });

    it("isLegendChanged", () => {
        const legendObj = {
                id: "layer1",
                name: "layer1Name",
                legend: ["string"],
                position: 0
            },
            state = {
                legends: [
                    {
                        id: "layer1",
                        name: "layer1Name",
                        legend: ["string"],
                        position: 0
                    },
                    {id: "layer2"}
                ]
            };

        expect(getters.isLegendChanged(state)(legendObj)).to.be.false;
        legendObj.legend = ["changed"];
        expect(getters.isLegendChanged(state)(legendObj)).to.be.true;
        state.legends = [{id: "layer2"}];
        expect(getters.isLegendChanged(state)(legendObj)).to.be.true;

    });

});
