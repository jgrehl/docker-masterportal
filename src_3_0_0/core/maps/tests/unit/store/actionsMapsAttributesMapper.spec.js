import {expect} from "chai";
import Map from "ol/Map";
import sinon from "sinon";
import View from "ol/View";

import actions from "../../../store/actionsMapsAttributesMapper";

const {
    setMapAttributes,
    setViewAttributes
} = actions;

describe("src_3_0_0/core/maps/store/actionsMapsAttributesMapper.js", () => {
    let commit,
        dispatch,
        map2d;

    beforeEach(() => {
        commit = sinon.spy();
        dispatch = sinon.spy();

        mapCollection.clear();
        map2d = new Map({
            id: "ol",
            mode: "2D",
            view: new View()
        });

        mapCollection.addMap(map2d, "2D");
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("setMapAttributes", () => {
        it("Should commit and dispatch map attributes", () => {
            setMapAttributes({commit, dispatch});

            expect(dispatch.calledTwice).to.be.true;
            expect(commit.calledOnce).to.be.true;
            expect(dispatch.firstCall.args).to.deep.equals(["registerListener", {
                type: "moveend",
                listener: "updateMapAttributes",
                listenerType: "dispatch"
            }]);
            expect(dispatch.secondCall.args).to.deep.equals(["updateMapAttributes"]);
            expect(commit.firstCall.args).to.deep.equals(["setMode", "2D"]);
        });
    });

    describe("setViewAttributes", () => {
        it("Should dispatch map view attributes", () => {
            setViewAttributes({dispatch});

            expect(dispatch.calledOnce).to.be.true;
            expect(dispatch.firstCall.args).to.deep.equals(["updateMapViewAttributes"]);
        });
    });
});
