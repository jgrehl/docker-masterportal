import {expect} from "chai";
import sinon from "sinon";
import Layer2dRaster from "../../layer2dRaster";

describe("src_3_0_0/core/layers/layer2dRaster.js", () => {
    let warn;

    before(() => {
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);
    });

    after(() => {
        sinon.restore();
    });

    describe("createLayer", () => {
        it("new Layer2dRaster should create an layer with warning", () => {
            const layerWrapper = new Layer2dRaster({});

            expect(layerWrapper).not.to.be.undefined;
            expect(warn.calledOnce).to.be.true;
        });
    });
});
