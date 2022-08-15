import {expect} from "chai";
import sinon from "sinon";
import LayerOl2d from "../../layerOl2d";

describe("src_3_0_0/core/layers/layerOl2d.js", () => {
    let warn;

    before(() => {
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);
    });

    after(() => {
        sinon.restore();
    });

    it("new LayerOl2d should create an layer with warning", () => {
        const layerWrapper = new LayerOl2d({});

        expect(layerWrapper).not.to.be.undefined;
        expect(warn.calledOnce).to.be.true;
    });
});
