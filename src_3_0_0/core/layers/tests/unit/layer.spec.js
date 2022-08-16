import {expect} from "chai";
import sinon from "sinon";
import Layer from "../../layer";

describe("src_3_0_0/core/layers/layer.js", () => {
    let warn;

    beforeEach(() => {
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);
    });

    afterEach(() => {
        sinon.restore();
    });

    it("new Layer should create an layer with warning", () => {
        const layerWrapper = new Layer({});

        expect(layerWrapper).not.to.be.undefined;
        expect(warn.calledOnce).to.be.true;
    });

    it("new Layer and updateLayerValues should create two warnings", () => {
        const layerWrapper = new Layer({});

        layerWrapper.updateLayerValues();

        expect(warn.calledTwice).to.be.true;
    });
});
