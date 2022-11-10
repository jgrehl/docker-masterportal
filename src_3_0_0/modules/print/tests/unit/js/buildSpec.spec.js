import WMTSTileGrid from "ol/tilegrid/WMTS";
import TileGrid from "ol/tilegrid/TileGrid";
import {TileWMS, ImageWMS, WMTS} from "ol/source.js";
import {Tile} from "ol/layer.js";
import {expect} from "chai";
import sinon from "sinon";

import BuildSpec from "../../../js/buildSpec";

describe("src_3_0_0/modules/print/js/buildSpec", function () {
    let buildSpec,
        originalGetStyleModel;

    const attr = {
        "layout": "A4 Hochformat",
        "outputFormat": "pdf",
        "attributes": {
            "title": "TestTitel",
            "map": {
                "dpi": 96,
                "projection": "EPSG:25832",
                "center": [561210, 5932600],
                "scale": 40000
            }
        }
    };

    before(() => {
        buildSpec = BuildSpec;
        buildSpec.setAttributes(attr);
        originalGetStyleModel = buildSpec.getStyleModel;
        buildSpec.getStyleModel = sinon.spy();
    });

    beforeEach(() => {
        buildSpec.getStyleModel = sinon.spy();
    });

    afterEach(() => {
        buildSpec.getStyleModel = originalGetStyleModel;
        sinon.restore();
    });

    describe("parseAddressToString", function () {
        it("should return empty string if all keys in address object are empty", function () {
            const addressEmpty = {
                street: "",
                housenr: "",
                postalCode: "",
                city: ""
            };

            expect(buildSpec.parseAddressToString(addressEmpty)).to.equal("n.N.");
        });
        it("should return empty address object is empty", function () {
            expect(buildSpec.parseAddressToString({})).to.equal("n.N.");
        });
        it("should return empty address object is undefined", function () {
            expect(buildSpec.parseAddressToString(undefined)).to.equal("n.N.");
        });
        it("should return parsed complete address", function () {
            const address = {street: "Hufnerstraße", housenr: "7", postalCode: "22305", city: "Hamburg"};

            expect(buildSpec.parseAddressToString(address)).to.equal("Hufnerstraße 7\n 22305 Hamburg");
        });
        it("should return parsed address - no housenr", function () {
            const address = {street: "Hufnerstraße", housenr: "", postalCode: "22305", city: "Hamburg"};

            expect(buildSpec.parseAddressToString(address)).to.equal("Hufnerstraße\n 22305 Hamburg");
        });
        it("should return parsed address - no street", function () {
            const address = {street: "", housenr: "7", postalCode: "22305", city: "Hamburg"};

            expect(buildSpec.parseAddressToString(address)).to.equal("7\n 22305 Hamburg");
        });
        it("should return parsed address - no housenr, street", function () {
            const address = {street: "", housenr: "", postalCode: "22305", city: "Hamburg"};

            expect(buildSpec.parseAddressToString(address)).to.equal("22305 Hamburg");
        });
        it("should return parsed address - no housenr, street, postalCode", function () {
            const address = {street: "", housenr: "", postalCode: "", city: "Hamburg"};

            expect(buildSpec.parseAddressToString(address)).to.equal("Hamburg");
        });
    });

    describe("isOwnMetaRequest", function () {
        it("should return true if uniqueId is in uniqueIdList", function () {
            expect(buildSpec.isOwnMetaRequest(["1234", "5678"], "1234")).to.be.true;
        });
        it("should return false if uniqueId is NOT in uniqueIdList", function () {
            expect(buildSpec.isOwnMetaRequest(["1234", "5678"], "91011")).to.be.false;
        });
        it("should return false if uniqueId is undefined", function () {
            expect(buildSpec.isOwnMetaRequest(["1234", "5678"], undefined)).to.be.false;
        });
        it("should return false if uniqueIdList is undefined", function () {
            expect(buildSpec.isOwnMetaRequest(undefined, "91011")).to.be.false;
        });
        it("should return false if uniqueIdList and uniqueId is undefined", function () {
            expect(buildSpec.isOwnMetaRequest(undefined, undefined)).to.be.false;
        });
    });

    describe("removeUniqueIdFromList", function () {
        it("should remove uniqueId from uniqueIdList if uniqueId in uniqueIdList", function () {
            buildSpec.removeUniqueIdFromList(["1234", "5678"], "1234");
            expect(buildSpec.defaults.uniqueIdList).to.deep.equal(["5678"]);
        });
        it("should leave uniqueIdList if uniqueId not in uniqueIdList", function () {
            buildSpec.removeUniqueIdFromList(["1234", "5678"], "123456789");
            expect(buildSpec.defaults.uniqueIdList).to.deep.equal(["1234", "5678"]);
        });
        it("should leave uniqueIdList if uniqueId is undefined", function () {
            buildSpec.removeUniqueIdFromList(["1234", "5678"], undefined);
            expect(buildSpec.defaults.uniqueIdList).to.deep.equal(["1234", "5678"]);
        });
        it("should leave uniqueIdList if uniqueIdList is undefined", function () {
            buildSpec.removeUniqueIdFromList(undefined, "5678");
            expect(buildSpec.defaults.uniqueIdList).to.be.an("array").that.is.empty;
        });
        it("should leave uniqueIdList if uniqueIdList and uniqueId is undefined", function () {
            buildSpec.removeUniqueIdFromList(undefined, undefined);
            expect(buildSpec.defaults.uniqueIdList).to.be.an("array").that.is.empty;
        });
    });

    describe("updateMetaData", function () {
        it("should not crash if legend doesn't exist yet", function () {
            const parsedData = {
                date: "",
                orgaOwner: "",
                address: {},
                email: "",
                tel: "",
                url: ""
            };

            buildSpec.updateMetaData("testLayerName", parsedData);
            expect(buildSpec.defaults.attributes.legend).to.be.undefined;
        });
        it("should write parsedData to layer", function () {
            const parsedData = {
                    date: "1.1.2019",
                    orgaOwner: "LGV",
                    address: {},
                    email: "e@mail.de",
                    tel: "123456",
                    url: "www.url.de"
                },
                legend = {
                    "layers": [
                        {
                            "layerName": "testLayerName",
                            "values": []
                        }
                    ]
                };

            buildSpec.defaults.attributes.legend = legend;
            buildSpec.updateMetaData("testLayerName", parsedData);
            expect(buildSpec.defaults.attributes.legend.layers[0]).to.own.include({
                metaDate: "1.1.2019",
                metaOwner: "LGV",
                metaAddress: "n.N.",
                metaEmail: "e@mail.de",
                metaTel: "123456",
                metaUrl: "www.url.de"
            });
        });
    });

    describe("prepareGfiAttributes", function () {
        it("should create gfi attributes array", function () {
            const gfiAttributes = {
                attr1: "value1",
                attr2: "value2",
                attr3: "value3"
            };

            expect(buildSpec.prepareGfiAttributes(gfiAttributes)[0]).to.deep.own.include({
                key: "attr1",
                value: "value1"
            });
            expect(buildSpec.prepareGfiAttributes(gfiAttributes)[1]).to.deep.own.include({
                key: "attr2",
                value: "value2"
            });
            expect(buildSpec.prepareGfiAttributes(gfiAttributes)[2]).to.deep.own.include({
                key: "attr3",
                value: "value3"
            });
        });
        it("should create empty gfi attributes array for empty attributes", function () {
            expect(buildSpec.prepareGfiAttributes({})).to.be.an("array").that.is.empty;
        });
        it("should create empty gfi attributes array for undefined attributes", function () {
            expect(buildSpec.prepareGfiAttributes({})).to.be.an("array").that.is.empty;
        });
    });

    describe("buildScale", function () {
        it("should create scale that is \"1:20000\" for number input", function () {
            buildSpec.buildScale(20000);
            expect(buildSpec.defaults.attributes.scale).to.deep.include("1:20000");
        });
        it("should create scale that is \"1:undefined\" for undefined input", function () {
            buildSpec.buildScale(undefined);
            expect(buildSpec.defaults.attributes.scale).to.deep.include("1:undefined");
        });
    });

    describe("inInScaleRange", function () {
        it("Should return false if current resolution is higher than layer max resolution", function () {
            expect(buildSpec.isInScaleRange(1000, 5000, 10000)).to.be.false;
        });
        it("Should return false if current resolution is lower than layer min resolution", function () {
            expect(buildSpec.isInScaleRange(2500, 5000, 1000)).to.be.false;
        });
        it("Should return true if current resolution is lower than layer max resolution and higher than layer min resolution", function () {
            expect(buildSpec.isInScaleRange(0, Infinity, 10000)).to.be.true;
        });
        it("Should return true if current resolution is lower than layer max resolution and higher than layer min resolution", function () {
            expect(buildSpec.isInScaleRange(0, 10000, 5000)).to.be.true;
        });
        it("Should return true if current resolution the layer max resolution", function () {
            expect(buildSpec.isInScaleRange(0, 5000, 5000)).to.be.true;
        });
        it("Should return true if current resolution the layer min resolution", function () {
            expect(buildSpec.isInScaleRange(1000, 5000, 1000)).to.be.true;
        });
    });

    describe("buildWmts", () => {
        const matrixIds = [0, 1, 2],
            matrixSizes = [[1, 1], [2, 2], [4, 4]],
            origin = [0, 0],
            scales = [2, 1, 0],
            tileSize = 512,
            wmtsLayer = new Tile({
                source: new WMTS({
                    tileGrid: new WMTSTileGrid({
                        origin,
                        resolutions: [2, 1, 0],
                        matrixIds,
                        tileSize
                    }),
                    urls: ["url"],
                    matrixSet: "tileMatrixSet",
                    layer: "my_layer",
                    style: "lit",
                    requestEncoding: "REST"
                }),
                opacity: 1
            });

        wmtsLayer.getSource().matrixSizes = matrixSizes;
        wmtsLayer.getSource().scales = scales;

        it("should buildWmts", function () {
            const matrices = [];

            for (let i = 0; i < matrixIds.length; i++) {
                matrices.push({
                    identifier: matrixIds[i],
                    matrixSize: matrixSizes[i],
                    topLeftCorner: origin,
                    scaleDenominator: scales[i],
                    tileSize: [tileSize, tileSize]
                });
            }

            expect(buildSpec.buildWmts(wmtsLayer, wmtsLayer.getSource())).to.deep.own.include({
                baseURL: "url",
                opacity: 1,
                type: "WMTS",
                layer: "my_layer",
                style: "lit",
                imageFormat: "image/jpeg",
                matrixSet: "tileMatrixSet",
                matrices,
                requestEncoding: "REST"
            });
        });
    });

    describe("buildTileWms", function () {
        const tileWmsLayer = new Tile({
            source: new TileWMS({
                url: "url",
                params: {
                    LAYERS: "layer1,layer2",
                    FORMAT: "image/png",
                    TRANSPARENT: true,
                    WIDTH: 512,
                    HEIGHT: 512
                },
                tileGrid: new TileGrid({
                    extent: [510000.0, 5850000.0, 625000.4, 6000000.0],
                    resolutions: [78271.51696401172, 305.7481131406708, 152.8740565703354, 76.4370282851677, 2.3886571339114906],
                    tileSize: [512, 512]
                })
            }),
            opacity: 1
        });

        it("should buildTileWms", function () {
            expect(buildSpec.buildTileWms(tileWmsLayer)).to.deep.own.include({
                baseURL: "url",
                opacity: 1,
                type: "tiledwms",
                layers: ["layer1", "layer2"],
                imageFormat: "image/png",
                customParams: {
                    TRANSPARENT: true,
                    DPI: 200
                },
                tileSize: [512, 512]
            });
        });
    });

    describe("buildImageWms", function () {
        const imageWmsLayer = new Tile({
            source: new ImageWMS({
                url: "url",
                params: {
                    LAYERS: "layer1,layer2",
                    FORMAT: "image/png",
                    TRANSPARENT: true
                }
            }),
            opacity: 1
        });

        it("should buildImageWms", function () {
            expect(buildSpec.buildImageWms(imageWmsLayer)).to.deep.own.include({
                baseURL: "url",
                opacity: 1,
                type: "WMS",
                layers: ["layer1", "layer2"],
                imageFormat: "image/png",
                customParams: {
                    TRANSPARENT: true,
                    DPI: 200
                }
            });
        });
    });
});
