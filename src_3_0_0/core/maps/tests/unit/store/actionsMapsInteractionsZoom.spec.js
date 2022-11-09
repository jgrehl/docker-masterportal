import {expect} from "chai";
import Map from "ol/Map";
import sinon from "sinon";
import View from "ol/View";

import actions from "../../../store/actionsMapsInteractionsZoom";

const {
    decreaseZoom,
    increaseZoom,
    setZoom
} = actions;

describe("src_3_0_0/core/maps/store/actionsMapsInteractionsZoom.js", () => {
    let dispatch,
        map2d;

    beforeEach(() => {
        dispatch = sinon.spy();

        mapCollection.clear();
        map2d = new Map({
            id: "ol",
            mode: "2D",
            view: new View({
                maxZoom: 10,
                minZoom: 2,
                zoom: 3
            })
        });

        mapCollection.addMap(map2d, "2D");
    });

    after(() => {
        sinon.restore();
    });

    describe("decreaseZoom", () => {
        it("should decrease zoom level by one", () => {
            decreaseZoom({dispatch});

            expect(dispatch.callCount).to.equals(1);
            expect(dispatch.firstCall.args).to.deep.equals(["setZoom", 2]);
        });
    });

    describe("increaseZoom", () => {
        it("should increase zoom level by one", () => {
            increaseZoom({dispatch});

            expect(dispatch.callCount).to.equals(1);
            expect(dispatch.firstCall.args).to.deep.equals(["setZoom", 4]);
        });
    });

    describe("setZoom", () => {
        it("should set the zoom level to the map view", () => {
            const view = map2d.getView();

            setZoom({}, 5);

            expect(dispatch.notCalled).to.be.true;
            expect(view.getZoom()).to.equals(5);
        });

        it("shouldn't set the zoom level to the map view, if the new zoom level exceeds maxZoom", () => {
            const view = map2d.getView();

            setZoom({}, 20);

            expect(dispatch.notCalled).to.be.true;
            expect(view.getZoom()).to.equals(3);
        });

        it("shouldn't set the zoom level to the map view, if the new zoom level below minZoom", () => {
            const view = map2d.getView();

            setZoom({}, 0);

            expect(dispatch.notCalled).to.be.true;
            expect(view.getZoom()).to.equals(3);
        });

        describe("zoomToExtent", () => {
            it("Zoom to the extent with duration 0 milliseconds", () => {
                const view = map2d.getView();

                actions.zoomToExtent({}, {
                    extent: [565760.049, 5931747.185, 568940.626, 5935453.891],
                    options: {duration: 0}
                });
                expect(view.getCenter()).to.deep.equal([567350.3375, 5933600.538]);
                expect(Math.round(view.getZoom())).equals(10);
            });
        });
    });
});