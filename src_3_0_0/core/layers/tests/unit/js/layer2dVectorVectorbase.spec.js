import {expect} from "chai";
import sinon from "sinon";

import Layer2dVectorVectorbase from "../../../js/layer2dVectorVectorbase";

describe("src_3_0_0/core/js/layers/layer2dVectorVectorbase.js", () => {
    let attributes,
        warn;

    before(() => {
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);

        mapCollection.clear();
        const map = {
            id: "ol",
            mode: "2D",
            getView: () => {
                return {
                    getProjection: () => {
                        return {
                            getCode: () => "EPSG:25832"
                        };
                    }
                };
            }
        };

        mapCollection.addMap(map, "2D");
    });

    beforeEach(() => {
        attributes = {
            id: "id",
            layers: "layer1,layer2",
            name: "vectorbaseTestLayer",
            typ: "VECTORBASE"
        };
    });


    after(() => {
        sinon.restore();
    });

    describe("createLayer", () => {
        it("new Layer2dVectorVectorbase should create an layer with no warning", () => {
            const vectorbaseLayer = new Layer2dVectorVectorbase(attributes);

            expect(vectorbaseLayer).not.to.be.undefined;
            expect(warn.notCalled).to.be.true;
        });
    });


});
