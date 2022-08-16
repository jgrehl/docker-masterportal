import {expect} from "chai";
import sinon from "sinon";
import Layer from "ol/layer/Layer";
import TileWMS from "ol/source/TileWMS";
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

    describe("updateLayerValues", () => {
        it("updates the visibility of the ol layer to true", () => {
            const layerWrapper = new LayerOl2d();

            layerWrapper.layer = new Layer({
                source: new TileWMS(),
                visible: false
            });

            layerWrapper.updateLayerValues({visibility: true});

            expect(layerWrapper.layer.getVisible()).to.be.true;

        });

        it("updates the visibility of the ol layer to false", () => {
            const layerWrapper = new LayerOl2d();

            layerWrapper.layer = new Layer({
                source: new TileWMS(),
                visible: true
            });

            layerWrapper.updateLayerValues({visibility: false});

            expect(layerWrapper.layer.getVisible()).to.be.false;

        });
    });
});
