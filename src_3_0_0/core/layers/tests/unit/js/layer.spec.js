import {expect} from "chai";
import sinon from "sinon";
import Layer from "../../../js/layer";

describe("src_3_0_0/core/js/layers/layer.js", () => {
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

    describe("getLayer and setLayer", () => {
        it("should setLayer and getLayer return the layer", () => {
            const layerWrapper = new Layer({});

            layerWrapper.setLayer({layer: "layer"});

            expect(layerWrapper.getLayer()).to.deep.equals({layer: "layer"});
        });
    });

    describe("setLegend", () => {
        it("setLegend shall dispatch createLegend", () => {
            const layerWrapper = new Layer({});

            layerWrapper.setLegend(["legend"]);
            expect(layerWrapper.attributes.legend).to.deep.equals(["legend"]);
        });
    });

    describe("inspectLegendUrl and getLegend", () => {
        beforeEach(() => {
            attributes = {
                id: "id"
            };
        });

        it("inspectLegendUrl without legendURL", () => {
            const layerWrapper = new Layer(attributes);

            expect(layerWrapper.inspectLegendUrl()).to.be.true;
        });

        it("inspectLegendUrl with filled legendURL", () => {
            attributes.legendURL = "https://legendURL";
            const layerWrapper = new Layer(attributes);

            expect(layerWrapper.inspectLegendUrl()).to.be.equals(attributes.legendURL);
        });

        it("inspectLegendUrl with empty String as legendURL", () => {
            attributes.legendURL = "";
            const layerWrapper = new Layer(attributes);

            expect(layerWrapper.inspectLegendUrl()).to.be.true;
        });

        it("inspectLegendUrl with 'ignore' as legendURL", () => {
            attributes.legendURL = "ignore";
            const layerWrapper = new Layer(attributes);

            expect(layerWrapper.inspectLegendUrl()).to.be.false;
        });

        it("getLegend is undefined", () => {
            attributes.legend = undefined;
            const layerWrapper = new Layer(attributes);

            expect(layerWrapper.getLegend()).to.be.true;
        });

        it("getLegend is null", () => {
            attributes.legend = null;
            const layerWrapper = new Layer(attributes);

            expect(layerWrapper.getLegend()).to.be.true;
        });

        it("getLegend is filled", () => {
            attributes.legend = ["legend"];
            const layerWrapper = new Layer(attributes);

            expect(layerWrapper.getLegend()).to.be.deep.equals(attributes.legend);
        });
    });

    describe("createLegend", () => {
        beforeEach(() => {
            attributes = {
                id: "id",
                version: "1.3.0"
            };
        });

        it("createLegend with legendURL", () => {
            attributes.legendURL = "https://legendURL";
            const layerWrapper = new Layer(attributes);

            layerWrapper.createLegend();
            expect(layerWrapper.getLegend()).to.be.deep.equals([attributes.legendURL]);
        });

        it("createLegend with ignored legendURL", () => {
            attributes.legendURL = "ignore";
            const layerWrapper = new Layer(attributes);

            layerWrapper.createLegend();
            expect(layerWrapper.getLegend()).to.be.false;
        });

        it("createLegend with legend as Array", () => {
            attributes.legend = ["legend"];
            const layerWrapper = new Layer(attributes);

            layerWrapper.createLegend();
            expect(layerWrapper.getLegend()).to.be.deep.equals(attributes.legend);
        });

        it("createLegend with legend true and 2 layer names", () => {
            attributes.legend = true;
            attributes.url = "https://url";
            attributes.layers = "layer1,layer2";
            const layerWrapper = new Layer(attributes),
                expectedLegend = ["https://url/?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&FORMAT=image%2Fpng&LAYER=layer1",
                    "https://url/?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetLegendGraphic&FORMAT=image%2Fpng&LAYER=layer2"];

            layerWrapper.createLegend();
            expect(layerWrapper.getLegend()).to.be.deep.equals(expectedLegend);
        });


    });


});
