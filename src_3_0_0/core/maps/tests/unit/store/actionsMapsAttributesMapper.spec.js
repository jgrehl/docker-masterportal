import {expect} from "chai";
import Map from "ol/Map";
import sinon from "sinon";
import View from "ol/View";

import actions from "../../../store/actionsMapsAttributesMapper";

const {
    setMapAttributes,
    registerMapListener,
    setInitialAttributes,
    updateAttributesByMoveend,
    updateAttributesByChangeResolution
} = actions;

describe("src_3_0_0/core/maps/store/actionsMapsAttributesMapper.js", () => {
    const options = [
            {
                resolution: 66.14579761460263,
                scale: 250000,
                zoomLevel: 0
            },
            {
                resolution: 26.458319045841044,
                scale: 100000,
                zoomLevel: 1
            },
            {
                resolution: 15.874991427504629,
                scale: 60000,
                zoomLevel: 2
            },
            {
                resolution: 10.583327618336419,
                scale: 40000,
                zoomLevel: 3
            },
            {
                resolution: 5.2916638091682096,
                scale: 20000,
                zoomLevel: 4
            },
            {
                resolution: 2.6458319045841048,
                scale: 10000,
                zoomLevel: 5
            }
        ],
        resolutions = [
            66.14579761460263,
            26.458319045841044,
            15.874991427504629,
            10.583327618336419,
            5.2916638091682096,
            2.6458319045841048
        ];
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
            size: [50, 50],
            view: new View({
                center: [10, 20],
                options: options,
                resolution: 2.6458319045841048,
                resolutions: resolutions,
                rotation: 0
            })
        });

        mapCollection.addMap(map2d, "2D");
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("setMapAttributes", () => {
        it("Should dispatch map attributes", () => {
            setMapAttributes({dispatch});

            expect(dispatch.callCount).to.equals(4);
            expect(dispatch.firstCall.args[0]).to.deep.equals("registerMapListener");
            expect(dispatch.secondCall.args[0]).to.deep.equals("setInitialAttributes");
            expect(dispatch.thirdCall.args[0]).to.deep.equals("updateAttributesByMoveend");
            expect(dispatch.getCall(3).args[0]).to.deep.equals("updateAttributesByChangeResolution");
        });
    });

    describe("registerMapListener", () => {
        it("Should register listeners", () => {
            registerMapListener({dispatch});

            expect(dispatch.calledTwice).to.be.true;
            expect(dispatch.firstCall.args).to.deep.equals(["registerListener", {
                type: "moveend",
                listener: "updateAttributesByMoveend",
                listenerType: "dispatch"
            }]);
            expect(dispatch.secondCall.args).to.deep.equals(["registerListener", {
                type: "pointermove",
                listener: "updateAttributesByPointer",
                listenerType: "dispatch"
            }]);
        });
    });

    describe("setInitialAttributes", () => {
        it("Should set initial attributes", () => {
            setInitialAttributes({commit});

            expect(commit.callCount).to.equals(7);
            expect(commit.firstCall.args).to.deep.equals(["setInitialCenter", [10, 20]]);
            expect(commit.secondCall.args).to.deep.equals(["setInitialRotation", 0]);
            expect(commit.thirdCall.args).to.deep.equals(["setInitialZoom", 5]);
            expect(commit.getCall(3).args).to.deep.equals(["setMode", "2D"]);
            expect(commit.getCall(4).args[0]).to.equals("setProjection");
            expect(commit.getCall(4).args[1].code_).to.equals("EPSG:3857");
            expect(commit.getCall(5).args).to.deep.equals(["setResolutions", [
                66.14579761460263,
                26.458319045841044,
                15.874991427504629,
                10.583327618336419,
                5.2916638091682096,
                2.6458319045841048
            ]]);
            expect(commit.getCall(6).args).to.deep.equals(["setScales", [
                250000,
                100000,
                60000,
                40000,
                20000,
                10000
            ]]);
        });
    });

    describe("updateAttributesByMoveend", () => {
        it("Should update attributes by moveend event", () => {
            updateAttributesByMoveend({commit});

            expect(commit.callCount).to.equals(2);
            expect(commit.firstCall.args).to.deep.equals(["setCenter", [10, 20]]);
            expect(commit.secondCall.args).to.deep.equals(["setExtent", [-122.29159522920523, -112.29159522920523, 142.29159522920523, 152.29159522920523]]);
        });
    });

    describe("updateAttributesByChangeResolution", () => {
        it("Should update attributes by change resolution event", () => {
            updateAttributesByChangeResolution({commit});

            expect(commit.callCount).to.equals(5);
            expect(commit.firstCall.args).to.deep.equals(["setMaxZoom", 5]);
            expect(commit.secondCall.args).to.deep.equals(["setMinZoom", 0]);
            expect(commit.thirdCall.args).to.deep.equals(["setResolution", 2.6458319045841048]);
            expect(commit.getCall(3).args).to.deep.equals(["setScale", 10000]);
            expect(commit.getCall(4).args).to.deep.equals(["setZoom", 5]);
        });
    });
});
