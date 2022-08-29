import {expect} from "chai";
import sinon from "sinon";
import Layer2dRasterStaticImage from "../../layer2dRasterStaticImage";

describe("src_3_0_0/core/layers/layer2dRasterStaticImage.js", () => {
    let attributes,
        warn;

    before(() => {
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);
    });

    beforeEach(() => {
        attributes = {
            id: "id",
            name: "staticImageTestLayer",
            typ: "StaticImage"
        };
    });

    after(() => {
        sinon.restore();
    });

    describe("createLayer", () => {
        it("new Layer2dRasterStaticImage should create an layer with no warning", () => {
            const staticImageLayer = new Layer2dRasterStaticImage({});

            expect(staticImageLayer).not.to.be.undefined;
            expect(warn.notCalled).to.be.true;
        });

        it("new Layer2dRasterStaticImage with attributes should create an layer", () => {
            const staticImageLayer = new Layer2dRasterStaticImage(attributes);

            expect(staticImageLayer).not.to.be.undefined;
            expect(staticImageLayer.getLayer()).not.to.be.undefined;
        });
    });

    describe("getRawLayerAttributes", () => {
        let localAttributes;

        beforeEach(() => {
            localAttributes = {
                extent: [],
                name: "layer_name",
                url: "test.url"
            };
        });

        it("should return the raw layer attributes", () => {
            const staticImageLayer = new Layer2dRasterStaticImage(localAttributes);

            expect(staticImageLayer.getRawLayerAttributes(localAttributes)).to.deep.equals({
                imageExtent: [],
                name: "layer_name",
                url: "test.url"
            });
        });
    });
});
