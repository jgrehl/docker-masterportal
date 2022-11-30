import {expect} from "chai";
import sinon from "sinon";
import Layer from "ol/layer/Layer";
import TileWMS from "ol/source/TileWMS";
import Layer2d from "../../../js/layer2d";

describe("src_3_0_0/core/js/layers/layer2d.js", () => {
    let warn;

    beforeEach(() => {
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);
    });

    afterEach(() => {
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

    describe("autoRefresh", () => {
        let controlAutoRefreshSpy,
            startAutoRefreshSpy,
            stopAutoRefreshSpy,
            layer2d;

        beforeEach(() => {
            controlAutoRefreshSpy = sinon.spy(Layer2d.prototype, "controlAutoRefresh");
            startAutoRefreshSpy = sinon.spy(Layer2d.prototype, "startAutoRefresh");
            stopAutoRefreshSpy = sinon.spy(Layer2d.prototype, "stopAutoRefresh");
            layer2d = new Layer2d({
                autoRefresh: 50000,
                id: 123456,
                visibility: true
            });
        });

        afterEach(() => {
            sinon.restore();
        });

        it("should start the function controlAutoRefresh and startAutoRefreshSpy when a layer is created", () => {
            expect(controlAutoRefreshSpy.calledOnce).to.be.true;
            expect(startAutoRefreshSpy.calledOnce).to.be.true;
            expect(layer2d.getIntervalAutoRefresh()).is.not.undefined;
        });

        it("stop the refreshing when layer is no longer visible", () => {
            layer2d.updateLayerValues({
                autoRefresh: 50000,
                id: 123456,
                visibility: false
            });

            expect(stopAutoRefreshSpy.calledOnce).to.be.true;
            expect(layer2d.getIntervalAutoRefresh()).is.undefined;
        });
    });

    describe("getIntervalAutoRefresh and setIntervalAutoRefresh", () => {
        it("should setLayer and getLayer return the layer", () => {
            const layer2d = new Layer2d({});

            layer2d.setIntervalAutoRefresh(18);

            expect(layer2d.getIntervalAutoRefresh()).to.equals(18);
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
