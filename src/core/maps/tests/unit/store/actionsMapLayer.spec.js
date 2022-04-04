import Map from "ol/Map";
import View from "ol/View";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import LayerGroup from "ol/layer/Group";
import mapCollection from "../../../../../core/dataStorage/mapCollection.js";
import store from "../../../../../app-store";
import {expect} from "chai";

describe("src/core/maps/actions/actionsMapLayer.js", () => {
    const layer1 = new VectorLayer({
            id: "Donald",
            name: "Duck1",
            source: new VectorSource()
        }),
        layer2 = new VectorLayer({
            id: "Dagobert",
            name: "Duck2",
            alwaysOnTop: true,
            source: new VectorSource()
        }),
        layer3 = new VectorLayer({
            id: "Darkwing",
            name: "Duck3",
            source: new VectorSource()
        }),
        layer4 = new VectorLayer({
            id: "Daisy",
            name: "Duck4",
            source: new VectorSource()
        }),
        layer5 = new VectorLayer({
            id: "Tick",
            name: "Duck5",
            source: new VectorSource()
        }),
        layer6 = new VectorLayer({
            id: "Trick",
            name: "Duck6",
            source: new VectorSource()
        }),
        layer7 = new VectorLayer({
            id: "Track",
            name: "Duck7",
            source: new VectorSource()
        }),
        layer8 = new LayerGroup({
            id: "Tick_Trick_Track",
            name: "Duck_group",
            layers: [layer5, layer6, layer7]
        });
    let map;

    beforeEach(() => {
        mapCollection.clear();
        map = new Map({
            id: "ol",
            mode: "2D",
            view: new View()
        });


        mapCollection.addMap(map, "ol", "2D");
    });

    describe("addLayer", () => {
        it("Set layer2 with alwaysOnTop on top", () => {
            const zIndexes = [0, 3, 2],
                ids = ["Donald", "Dagobert", "Darkwing"];

            store.dispatch("Maps/addLayer", layer1, 0);
            store.dispatch("Maps/addLayer", layer2, 1);
            store.dispatch("Maps/addLayer", layer3, 2);

            mapCollection.getMap("2D").getLayers().forEach((layer, index) => {
                expect(layer.getZIndex()).equals(zIndexes[index]);
                expect(layer.get("id")).equals(ids[index]);
            });
        });
    });

    describe("addLayerToIndex", () => {
        it("Set layer2 with alwaysOnTop on top", () => {
            const zIndexes = [0, 3, 2],
                ids = ["Donald", "Dagobert", "Darkwing"];

            store.dispatch("Maps/addLayerToIndex", {layer: layer1, zIndex: 0});
            store.dispatch("Maps/addLayerToIndex", {layer: layer2, zIndex: 1});
            store.dispatch("Maps/addLayerToIndex", {layer: layer3, zIndex: 2});

            mapCollection.getMap("2D").getLayers().forEach((layer, index) => {
                expect(layer.getZIndex()).equals(zIndexes[index]);
                expect(layer.get("id")).equals(ids[index]);
            });
        });
    });

    describe("addLayerOnTop", () => {
        it("Set layer3 on top and then layer2 with alwaysOnTop on top", () => {
            const zIndexes = [0, 3, 2],
                ids = ["Donald", "Dagobert", "Darkwing"];

            store.dispatch("Maps/addLayer", layer1);
            store.dispatch("Maps/addLayer", layer2);
            store.dispatch("Maps/addLayer", layer3);

            mapCollection.getMap("2D").getLayers().forEach((layer, index) => {
                expect(layer.getZIndex()).equals(zIndexes[index]);
                expect(layer.get("id")).equals(ids[index]);
            });
        });
    });

    describe("addNewLayerIfNotExists", () => {
        it("create new layer with alwaysOnTop: true", () => {
            const zIndexes = [2, 1],
                ids = ["Tick, Trick und Track", "Donald"];

            store.dispatch("Maps/addNewLayerIfNotExists", {layerName: "Tick, Trick und Track"});
            store.dispatch("Maps/addLayer", layer1);

            mapCollection.getMap("2D").getLayers().forEach((layer, index) => {
                expect(layer.getZIndex()).equals(zIndexes[index]);
                expect(layer.get("id")).equals(ids[index]);
            });
        });

        it("create new layer with alwaysOnTop: false", () => {
            const zIndexes = [0, 1, 2],
                ids = ["Donald", "Tick, Trick und Track"];

            store.dispatch("Maps/addLayer", layer1);
            store.dispatch("Maps/addNewLayerIfNotExists", {layerName: "Tick, Trick und Track", alwaysOnTop: false});

            mapCollection.getMap("2D").getLayers().forEach((layer, index) => {
                expect(layer.getZIndex()).equals(zIndexes[index]);
                expect(layer.get("id")).equals(ids[index]);
            });
        });
    });

    describe.skip("getLayerById", () => {
        it("Returns the layer with the correct id", () => {
            store.dispatch("Maps/addLayer", layer1);
            store.dispatch("Maps/addLayer", layer2);
            store.dispatch("Maps/addLayer", layer3);
            store.dispatch("Maps/addLayer", layer4);

            expect(store.dispatch("Maps/getLayerById", {layerId: "Donald"})).equals(layer1);
            expect(store.dispatch("Maps/getLayerById", {layerId: "Dagobert"})).equals(layer2);
            expect(store.dispatch("Maps/getLayerById", {layerId: "Darkwing"})).equals(layer3);
            expect(store.dispatch("Maps/getLayerById", {layerId: "Daisy"})).equals(layer4);
        });

        it("Returns the layer from groupLayer with the correct id", () => {
            store.dispatch("Maps/addLayer", layer1);
            store.dispatch("Maps/addLayer", layer8);

            expect(store.dispatch("Maps/getLayerById", {layerId: "Donald"})).equals(layer1);
            expect(store.dispatch("Maps/getLayerById", {layerId: "Tick"})).equals(layer5);
            expect(store.dispatch("Maps/getLayerById", {layerId: "Trick"})).equals(layer6);
            expect(store.dispatch("Maps/getLayerById", {layerId: "Track"})).equals(layer7);
        });

        it("Returns no groupLayer if searchInGroupLayers= false", () => {
            store.dispatch("Maps/addLayer", layer1);
            store.dispatch("Maps/addLayer", layer8);

            expect(store.dispatch("Maps/getLayerById", {layerId: "Donald"})).equals(layer1);
            expect(store.dispatch("Maps/getLayerById", {layerId: "Tick", searchInGroupLayers: false})).equals(null);
            expect(store.dispatch("Maps/getLayerById", {layerId: "Trick", searchInGroupLayers: false})).equals(null);
            expect(store.dispatch("Maps/getLayerById", {layerId: "Track", searchInGroupLayers: false})).equals(null);
        });
    });

    /*  describe("getLayerByName", () => {
        it("Returns the layer with the correct name", () => {
            store.dispatch("Maps/addLayer", layer1);
            store.dispatch("Maps/addLayer", layer2);
            store.dispatch("Maps/addLayer", layer3);
            store.dispatch("Maps/addLayer", layer4);

            expect(store.dispatch("Maps/getLayerByName", "Duck1")).equals(layer1);
            expect(store.dispatch("Maps/getLayerByName", {layerName: "Duck2"})).equals(layer2);
            expect(store.dispatch("Maps/getLayerByName", {layerName: "Duck3"})).equals(layer3);
            expect(store.dispatch("Maps/getLayerByName", {layerName: "Duck4"})).equals(layer4);
        });
    }); */
});
