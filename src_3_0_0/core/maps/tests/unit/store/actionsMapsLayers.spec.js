import {expect} from "chai";
import Map from "ol/Map";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import View from "ol/View";

import actions from "../../../store/actionsMapsLayers";

const {
    addLayer
} = actions;

describe("src_3_0_0/core/maps/store/actionsMapsLayers.js", () => {
    let layer1,
        layer2,
        layer3,
        map;

    before(() => {
        layer1 = new VectorLayer({
            id: "Donald",
            name: "Duck1",
            source: new VectorSource()
        });
        layer2 = new VectorLayer({
            id: "Dagobert",
            name: "Duck2",
            alwaysOnTop: true,
            source: new VectorSource()
        });
        layer3 = new VectorLayer({
            id: "Darkwing",
            name: "Duck3",
            source: new VectorSource()
        });
    });

    beforeEach(() => {
        mapCollection.clear();
        map = new Map({
            id: "ol",
            mode: "2D",
            view: new View()
        });

        mapCollection.addMap(map, "2D");
    });

    describe("addLayer", () => {
        it("Should add three layers to the map ", () => {
            const ids = ["Donald", "Dagobert", "Darkwing"];

            addLayer({}, layer1);
            addLayer({}, layer2);
            addLayer({}, layer3);

            mapCollection.getMap("2D").getLayers().forEach((layer, index) => {
                expect(layer.get("id")).equals(ids[index]);
            });
        });
    });
});
