import {expect} from "chai";
import sinon from "sinon";
import LayerOl2dVector from "../../layerOl2dVector";

describe("src_3_0_0/core/layers/layerOl2dVector.js", () => {
    let warn;

    before(() => {
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);
    });

    after(() => {
        sinon.restore();
    });

    it("new LayerOl2dVector should create an layer with warning", () => {
        const layerWrapper = new LayerOl2dVector({});

        expect(layerWrapper).not.to.be.undefined;
        expect(warn.calledOnce).to.be.true;
    });
});
