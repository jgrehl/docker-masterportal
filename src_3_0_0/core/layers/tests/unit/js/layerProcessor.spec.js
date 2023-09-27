import {expect} from "chai";
import Map from "ol/Map";
import store from "../../../../../app-store";
import {nextTick} from "vue";
import sinon from "sinon";
import View from "ol/View";

import {processLayerConfig, updateLayerAttributes} from "../../../js/layerProcessor";

describe("src_3_0_0/core/js/layers/layerProcessor.js", () => {
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
                visibility: true,
                name: "Geobasiskarten (HamburgDE)",
                url: "https://geodienste.hamburg.de/HH_WMS_HamburgDE",
                typ: "WMS",
                layers: "Geobasiskarten_HHde"
            },
            {
                id: "2426",
                visibility: true,
                name: "Bezirke",
                url: "https://geodienste.hamburg.de/HH_WMS_Verwaltungsgrenzen",
                typ: "WMS",
                layers: "bezirke"
            }
        ];
        store.getters = {
            layerConfigById: () => true,
            determineZIndex: sinon.stub().returns(2)
        };
        mapCollection.clear();
        map = new Map({
            id: "ol",
            mode: "2D",
            view: new View()
        });

        mapCollection.addMap(map, "2D");
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("processLayerConfig", () => {
        it("should create two ol layers from two visible layers", () => {
            let olLayers = [];

            processLayerConfig(layerConfig);

            nextTick(() => {
                olLayers = mapCollection.getMap("2D").getLayers().getArray();

                expect(olLayers.length).equals(2);
                expect(olLayers[0].get("id")).to.equals("453");
                expect(olLayers[1].get("id")).to.equals("2426");
            });
        });
    });

    describe("updateLayerAttributes", () => {
        it("should update a wms layer", () => {
            const wmsLayer = {
                attributes: {
                    typ: "WMS",
                    abc: true
                },
                get: (value) => value,
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
