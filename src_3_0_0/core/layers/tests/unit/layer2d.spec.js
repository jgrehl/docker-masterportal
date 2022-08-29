import {expect} from "chai";
import sinon from "sinon";
import Layer from "ol/layer/Layer";
import TileWMS from "ol/source/TileWMS";
import Layer2d from "../../layer2d";

describe("src_3_0_0/core/layers/layer2d.js", () => {
    let warn;

    before(() => {
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);
    });

    after(() => {
        sinon.restore();
    });

    describe("createLayer", () => {
        it("new Layer2d should create an layer with warning", () => {
            const layer2d = new Layer2d({});

            expect(layer2d).not.to.be.undefined;
            expect(warn.calledOnce).to.be.true;
        });
    });

    describe("updateLayerValues", () => {
        it("updates the visibility of the ol layer to true", () => {
            const layer2d = new Layer2d();

            layer2d.layer = new Layer({
                source: new TileWMS(),
                visible: false
            });

            layer2d.updateLayerValues({visibility: true});

            expect(layer2d.layer.getVisible()).to.be.true;

        });

        it("updates the visibility of the ol layer to false", () => {
            const layer2d = new Layer2d();

            layer2d.layer = new Layer({
                source: new TileWMS(),
                visible: true
            });

            layer2d.updateLayerValues({visibility: false});

            expect(layer2d.layer.getVisible()).to.be.false;

        });
    });

    describe("getLayer and setLayer", () => {
        it("should setLayer and getLayer return the layer", () => {
            const layer2d = new Layer2d({});

            layer2d.setLayer({layer: "layer"});

            expect(layer2d.getLayer()).to.deep.equals({layer: "layer"});
        });
    });

    describe("getLayerSource and setLayerSource", () => {
        it("should setLayer and getLayer return the layer", () => {
            const layer2d = new Layer2d({});

            layer2d.setLayerSource({layer: "source"});

            expect(layer2d.getLayerSource()).to.deep.equals({layer: "source"});
        });
    });
});
