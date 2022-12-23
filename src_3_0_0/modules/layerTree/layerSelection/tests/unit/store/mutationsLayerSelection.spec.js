import {expect} from "chai";

import mutations from "../../../store/mutationsLayerSelection";

const {clearSelectedLayer, addSelectedLayer, removeSelectedLayer} = mutations;

describe("src_3_0_0/modules/layerTree/layerSelection/store/mutationsLayerSelection", function () {
    describe("clearSelectedLayer", function () {
        it("Clears layersToAdd", function () {
            const state = {
                layersToAdd: ["1", "2"]
            };

            clearSelectedLayer(state);
            expect(state.layersToAdd).to.be.deep.equals([]);
        });
    });

    describe("addSelectedLayer", function () {
        it("add layer id to layersToAdd", function () {
            const state = {
                layersToAdd: ["1", "2"]
            };

            addSelectedLayer(state, {layerId: "3"});
            expect(state.layersToAdd.length).to.be.equals(3);
            expect(state.layersToAdd[2]).to.be.equals("3");
            addSelectedLayer(state, {layerId: "4"});
            expect(state.layersToAdd.length).to.be.equals(4);
            expect(state.layersToAdd[3]).to.be.equals("4");
        });
    });

    describe("removeSelectedLayer", function () {
        it("removes layer id from layersToAdd", function () {
            const state = {
                layersToAdd: ["1", "2"]
            };

            removeSelectedLayer(state, {layerId: "3"});
            expect(state.layersToAdd.length).to.be.equals(2);
            removeSelectedLayer(state, {layerId: "2"});
            expect(state.layersToAdd.length).to.be.equals(1);
            expect(state.layersToAdd[0]).to.be.equals("1");
        });
    });

});
