import {expect} from "chai";
import sinon from "sinon";
import LayerOl2dRasterWms from "../../layerOl2dRasterWms";

describe("src_3_0_0/core/layers/layerOl2dRasterWms.js", () => {
    let attributes,
        warn;

    before(() => {
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);

        mapCollection.clear();
        const map = {
            id: "ol",
            mode: "2D",
            getView: () => {
                return {
                    getResolutions: () => [2000, 1000],
                    getProjection: () => {
                        return {
                            getCode: () => "EPSG:25832"
                        };
                    }
                };
            }
        };

        mapCollection.addMap(map, "2D");
    });

    beforeEach(() => {
        attributes = {
            id: "id",
            layers: "layer1,layer2",
            name: "wmsTestLayer",
            singleTile: false,
            tilesize: 512,
            transparent: false,
            typ: "WMS"
        };
    });


    after(() => {
        sinon.restore();
    });

    it("new LayerOl2dRasterWms should create an layer with no warning", () => {
        const layerWrapper = new LayerOl2dRasterWms({});

        expect(layerWrapper).not.to.be.undefined;
        expect(warn.calledOnce).to.be.false;
    });

    it("new LayerOl2dRasterWms with attributes should create an layer", () => {
        const layerWrapper = new LayerOl2dRasterWms(attributes);

        expect(layerWrapper).not.to.be.undefined;
        expect(layerWrapper.layer).not.to.be.undefined;
    });

    describe("getRawLayerAttributes", () => {
        let localAttributes;

        beforeEach(() => {
            localAttributes = {
                crs: "25832",
                format: "image/png",
                gutter: 0,
                id: "123456789",
                layers: "layer_names",
                singleTile: false,
                tilesize: 512,
                transparent: true,
                url: "test.url",
                version: "1.3.0"
            };
        });

        it("should return the raw layer attributes", () => {
            const layerWrapper = new LayerOl2dRasterWms(localAttributes);

            expect(layerWrapper.getRawLayerAttributes(localAttributes)).to.deep.equals({
                crs: "25832",
                format: "image/png",
                gutter: 0,
                id: "123456789",
                layers: "layer_names",
                singleTile: false,
                tilesize: 512,
                transparent: "true",
                url: "test.url",
                version: "1.3.0"
            });
        });

        it("should return the raw layer attributes with styles", () => {
            Object.assign(localAttributes, {
                styles: [
                    "geofox_stations"
                ]
            });
            const layerWrapper = new LayerOl2dRasterWms(localAttributes);

            expect(layerWrapper.getRawLayerAttributes(localAttributes)).to.deep.equals({
                crs: "25832",
                format: "image/png",
                gutter: 0,
                id: "123456789",
                layers: "layer_names",
                singleTile: false,
                STYLES: ["geofox_stations"],
                tilesize: 512,
                transparent: "true",
                url: "test.url",
                version: "1.3.0"
            });
        });
    });

    describe("getLayerParams", () => {
        let localAttributes;

        beforeEach(() => {
            localAttributes = {
                format: "image/png",
                layers: "test_layers",
                name: "test_name",
                typ: "wms"
            };
        });

        it("should return the layer params", () => {
            const layerWrapper = new LayerOl2dRasterWms(localAttributes);

            expect(layerWrapper.getLayerParams(localAttributes)).to.deep.equals({
                format: "image/png",
                layers: "test_layers",
                name: "test_name",
                typ: "wms"
            });
        });
    });

    describe("getOptions", () => {
        let localAttributes;

        beforeEach(() => {
            localAttributes = {
                origin: [442800, 5809000]
            };
        });

        it("should return the options", () => {
            const layerWrapper = new LayerOl2dRasterWms(localAttributes);

            expect(layerWrapper.getOptions(localAttributes)).to.deep.equals({
                origin: [442800, 5809000],
                resolutions: [2000, 1000]
            });
        });
    });
});
