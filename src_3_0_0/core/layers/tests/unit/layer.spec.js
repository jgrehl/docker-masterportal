import {expect} from "chai";
import sinon from "sinon";
import Layer from "../../layer";

describe("src_3_0_0/core/layers/layer.js", () => {
    let attributes,
        warn;

    beforeEach(() => {
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);

        attributes = {
            abc: 123
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("createLayer", () => {
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

    describe("get and set", () => {
        it("should return an attribute through a getter", () => {
            const layerWrapper = new Layer(attributes);

            expect(layerWrapper.get("abc")).to.equals(123);
        });

        it("should set an attribute through a setter", () => {
            const layerWrapper = new Layer(attributes);

            layerWrapper.set("abc", 999);

            expect(layerWrapper.get("abc")).to.equals(999);
        });
    });
});
