import {expect} from "chai";
import sinon from "sinon";
import LayerOl2dRasterWms from "../../layerOl2dRasterWms";

describe("src_3_0_0/core/layers/layerOl2dRasterWms.js", () => {
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
                    getResolutions: () => [2000, 1000],
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
            name: "wmsTestLayer",
            singleTile: false,
            tilesize: 512,
            transparent: false,
            typ: "WMS"
        };
    });


    after(() => {
        sinon.restore();
    });

    it("new LayerOl2dRasterWms should create an layer with no warning", () => {
        const layerWrapper = new LayerOl2dRasterWms({});

        expect(layerWrapper).not.to.be.undefined;
        expect(warn.notCalled).to.be.true;
    });

    it("new LayerOl2dRasterWms with attributes should create an layer", () => {
        const layerWrapper = new LayerOl2dRasterWms(attributes);

        expect(layerWrapper).not.to.be.undefined;
        expect(layerWrapper.layer).not.to.be.undefined;
    });
});
