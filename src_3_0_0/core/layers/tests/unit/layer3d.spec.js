import {expect} from "chai";
import sinon from "sinon";
import Layer3d from "../../layer3d";

describe("src_3_0_0/core/layers/layer3d.js", () => {
    let warn;

    before(() => {
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);
    });

    after(() => {
        sinon.restore();
    });

    describe("createLayer", () => {
        it("new Layer3d should create an layer with warning", () => {
            const layer3d = new Layer3d({});

            expect(layer3d).not.to.be.undefined;
            expect(warn.calledOnce).to.be.true;
        });
    });
});
