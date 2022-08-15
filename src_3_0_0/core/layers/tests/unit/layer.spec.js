import {expect} from "chai";
import sinon from "sinon";
import Layer from "../../layer";

describe("src_3_0_0/core/layers/layer.js", () => {
    let warn;

    before(() => {
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);
    });

    after(() => {
        sinon.restore();
    });

    it("new Layer should create an layer with warning", () => {
        const layerWrapper = new Layer({});

        expect(layerWrapper).not.to.be.undefined;
        expect(warn.calledOnce).to.be.true;
    });
});
