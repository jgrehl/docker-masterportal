import {expect} from "chai";

import layerCollection from "../../layerCollection";

describe("src_3_0_0/core/layers/layerCollection.js", () => {
    let layer1,
        layer2,
        layer3;

    before(() => {
        layer1 = {
            attributes: {
                id: "firstLayer"
            }
        };
        layer2 = {
            attributes: {
                id: "secondLayer"
            }
        };
        layer3 = {
            attributes: {
                id: "thirdLayer"
            }
        };
    });

    beforeEach(() => {
        layerCollection.clear();
    });

    after(() => {
        layerCollection.clear();
    });

    describe("addLayer and getLayers", () => {
        it("adds one layer to collection", () => {
            layerCollection.addLayer(layer1);

            expect(layerCollection.getLayers().length).to.equals(1);
            expect(layerCollection.getLayers()).to.deep.include(layer1);
        });

        it("adds two layer to collection", () => {
            layerCollection.addLayer(layer1);
            layerCollection.addLayer(layer2);

            expect(layerCollection.getLayers().length).to.equals(2);
            expect(layerCollection.getLayers()).to.have.deep.members([layer1, layer2]);
        });
    });

    describe("addLayer and getLayerById", () => {
        it("adds three layer to collection and get the layers by id", () => {
            layerCollection.addLayer(layer1);
            layerCollection.addLayer(layer2);
            layerCollection.addLayer(layer3);

            expect(layerCollection.getLayers().length).to.equals(3);
            expect(layerCollection.getLayerById("thirdLayer")).to.equals(layer3);
            expect(layerCollection.getLayerById("secondLayer")).to.equals(layer2);
            expect(layerCollection.getLayerById("firstLayer")).to.equals(layer1);
        });
    });
});