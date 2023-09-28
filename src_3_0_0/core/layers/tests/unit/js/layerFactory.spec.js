import {expect} from "chai";
import Map from "ol/Map";
import sinon from "sinon";
import View from "ol/View";

import {createLayer} from "../../../js/layerFactory";

describe("src_3_0_0/core/js/layers/layerFactory.js", () => {
    let layerConfig,
        map,
        warn;

    before(() => {
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);
    });

    beforeEach(() => {
        layerConfig = [
            {
                id: "453",
                name: "Geobasiskarten (HamburgDE)",
                visibility: true,
                url: "https://geodienste.hamburg.de/HH_WMS_HamburgDE",
                typ: "WMS",
                layers: "Geobasiskarten_HHde"
            },
            {
                id: "2426",
                name: "Bezirke",
                visibility: true,
                url: "https://geodienste.hamburg.de/HH_WMS_Verwaltungsgrenzen",
                typ: "WMS",
                layers: "bezirke"
            },
            {
                id: "12883",
                name: "Gelände",
                typ: "Terrain3D",
                visibility: true
            }
        ];

        mapCollection.clear();
        map = new Map({
            id: "ol",
            mode: "2D",
            view: new View()
        });

        mapCollection.addMap(map, "2D");
    });

    after(() => {
        sinon.restore();
    });

    describe("createLayer", () => {
        it("should creates a layer with type WMS", () => {
            const wmsLayer = createLayer(layerConfig[0]);

            expect(wmsLayer).not.to.be.undefined;
            expect(wmsLayer.attributes.typ).to.equals("WMS");
        });

        it("should creates a layer with type TERRAIN3D, if mapMode is 3D", () => {
            const terrainLayer = createLayer(layerConfig[2], "3D");

            expect(terrainLayer).not.to.be.undefined;
            expect(terrainLayer.attributes.typ).to.equals("Terrain3D");
        });

        it("should don't creates a layer with type TERRAIN3D, if mapMode is 2D", () => {
            const terrainLayer = createLayer(layerConfig[2], "2D");

            expect(terrainLayer).to.be.undefined;
        });
    });
});
