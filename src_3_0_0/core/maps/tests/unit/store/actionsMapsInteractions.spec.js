import {expect} from "chai";
import Map from "ol/Map";
import sinon from "sinon";
import View from "ol/View";

import actions from "../../../store/actionsMapsInteractions";

const {
    registerListener,
    resetView,
    unregisterListener,
    setCenter
} = actions;

describe("src_3_0_0/core/maps/store/actionsMapsInteractions.js", () => {
    let olMap,
        payload;

    before(() => {
        olMap = new Map({
            id: "ol",
            mode: "2D",
            view: new View({
                center: [10, 20],
                resolution: 2.6458319045841048,
                rotation: 1,
                zoom: 3
            })
        });
        payload = {
            type: "pointermove",
            listener: "updatePointer",
            listenerType: "dispatch"
        };
        mapCollection.clear();
        mapCollection.addMap(olMap, "2D");
    });

    after(() => {
        sinon.restore();
    });

    describe("registerListener", () => {
        it("register pointermove listener to ol map", () => {
            const dispatch = sinon.spy(),
                commit = sinon.spy();

            registerListener({commit, dispatch}, payload);
            expect(Object.keys(olMap.listeners_)).include("pointermove");
        });
    });

    describe("resetView", () => {
        it("should reset the map view", () => {
            const state = {
                initialCenter: [50, 50],
                initialRotation: 0,
                initialZoom: 5
            };

            resetView({state});

            expect(mapCollection.getMapView("2D").getCenter()).to.deep.equals([50, 50]);
            expect(mapCollection.getMapView("2D").getRotation()).to.equals(0);
            expect(mapCollection.getMapView("2D").getZoom()).to.equals(5);
        });
    });

    describe("unregisterListener", () => {
        it("unregister pointermove listener from ol map", () => {
            unregisterListener({}, payload);
            expect(Object.keys(olMap.listeners_)).not.include("pointermove");
        });
    });

    describe("setCenter", () => {
        it("set the center", () => {
            const commit = sinon.spy(),
                coordinates = [575575.269, 5939992.777];

            setCenter({commit}, coordinates);

            expect(mapCollection.getMapView("2D").getCenter()).to.deep.equals(coordinates);
        });
    });
});
