import {expect} from "chai";
import sinon from "sinon";
import Layer2dVector from "../../layer2dVector";

describe("src_3_0_0/core/layers/layer2dVector.js", () => {
    let warn;

    before(() => {
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);
    });

    after(() => {
        sinon.restore();
    });

    it("new Layer2dVector should create an layer with warning", () => {
        const layerWrapper = new Layer2dVector({});

        expect(layerWrapper).not.to.be.undefined;
        expect(warn.calledOnce).to.be.true;
    });
});
