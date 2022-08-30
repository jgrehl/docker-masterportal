import {expect} from "chai";
import sinon from "sinon";

import Layer2dRasterWmts from "../../layer2dRasterWmts";

describe("src_3_0_0/core/layers/layer2dRasterWmts.js", () => {
    let attributes,
        fetch,
        warn;

    before(() => {
        fetch = global.fetch;
        global.fetch = sinon.spy(() => new Promise(r => r));

        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);
    });

    beforeEach(() => {
        attributes = {
            id: "id",
            layers: "layer1,layer2",
            name: "wmtsTestLayer",
            optionsFromCapabilities: false,
            typ: "WMTS"
        };
    });

    after(() => {
        global.fetch = fetch;
        sinon.restore();
    });

    describe("createLayer", () => {
        it("new Layer2dRasterWmts should create an layer with no warning", () => {
            const wmtsLayer = new Layer2dRasterWmts({});

            expect(wmtsLayer).not.to.be.undefined;
            expect(warn.notCalled).to.be.true;
        });

        it("new Layer2dRasterWmts with attributes should create an layer", () => {
            const wmtsLayer = new Layer2dRasterWmts(attributes);

            expect(wmtsLayer).not.to.be.undefined;
            expect(wmtsLayer.getLayer()).not.to.be.undefined;
        });
    });
});
