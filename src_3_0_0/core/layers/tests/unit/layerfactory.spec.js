import {expect} from "chai";
import sinon from "sinon";
import {createLayer, updateLayerAttributes} from "../../layerFactory";

describe("src_3_0_0/core/layers/layerFactory.js", () => {
    let layerConfig;

    before(() => {
        layerConfig = [
            {
                id: "453",
                visibility: true,
                name: "Geobasiskarten (HamburgDE)",
                url: "https://geodienste.hamburg.de/HH_WMS_HamburgDE",
                typ: "WMS",
                layers: "Geobasiskarten_HHde"
            }
        ];

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

    describe("createLayer", () => {
        it("should creates a layer with type WMS", () => {
            const wmsLayer = createLayer(layerConfig[0]);

            expect(wmsLayer).not.to.be.undefined;
            expect(wmsLayer.attributes.typ).to.equals("WMS");
        });
    });

    describe("updateLayerAttributes", () => {
        it("should update a wms layer", () => {
            const wmsLayer = {
                attributes: {
                    typ: "WMS",
                    abc: true
                },
                updateLayerValues: () => sinon.stub()
            };

            updateLayerAttributes(wmsLayer, layerConfig[0]);

            expect(wmsLayer.attributes).to.deep.equals({
                id: "453",
                visibility: true,
                name: "Geobasiskarten (HamburgDE)",
                url: "https://geodienste.hamburg.de/HH_WMS_HamburgDE",
                typ: "WMS",
                layers: "Geobasiskarten_HHde",
                abc: true
            });
        });
    });
});
