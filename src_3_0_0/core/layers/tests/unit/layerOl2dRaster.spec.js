import {expect} from "chai";
import sinon from "sinon";
import LayerOl2dRaster from "../../layerOl2dRaster";

describe("src_3_0_0/core/layers/layerOl2dRaster.js", () => {
    let warn;

    before(() => {
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);
    });

    after(() => {
        sinon.restore();
    });

    it("new layerOl2dRaster should create an layer with warning", () => {
        const layerWrapper = new LayerOl2dRaster({});

        expect(layerWrapper).not.to.be.undefined;
        expect(warn.calledOnce).to.be.true;
    });
});
