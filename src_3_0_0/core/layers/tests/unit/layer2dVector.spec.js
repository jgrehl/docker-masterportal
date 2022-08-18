import {expect} from "chai";
import sinon from "sinon";
import Layer2dVector from "../../layer2dVector";

describe("src_3_0_0/core/layers/layer2dVector.js", () => {
    let attributes,
        error,
        warn;

    before(() => {
        error = sinon.spy();
        warn = sinon.spy();
        sinon.stub(console, "error").callsFake(error);
        sinon.stub(console, "warn").callsFake(warn);
    });

    beforeEach(() => {
        attributes = {
            altitudeMode: "clampToGround"
        };
    });

    after(() => {
        sinon.restore();
    });

    describe("createLayer", () => {
        it("new Layer2dVector should create an layer with warning", () => {
            const layerWrapper = new Layer2dVector({});

            expect(layerWrapper).not.to.be.undefined;
            expect(warn.calledOnce).to.be.true;
        });
    });

    describe("clusterGeometryFunction", () => {
        it("should return the geometry of a feature", () => {
            const wfsLayer = new Layer2dVector(attributes),
                feature = {
                    get: () => sinon.stub(),
                    getGeometry: () => "Point"
                };

            expect(wfsLayer.clusterGeometryFunction(feature)).to.equals("Point");
        });
    });

    describe("featuresFilter", () => {
        it("featuresFilter shall filter getGeometry", function () {
            const wfsLayer = new Layer2dVector(attributes),
                features = [{
                    id: "1",
                    getGeometry: () => sinon.stub()
                },
                {
                    id: "2",
                    getGeometry: () => undefined
                }];

            expect(wfsLayer.featuresFilter(attributes, features).length).to.be.equals(1);

        });

        it("featuresFilter shall filter bboxGeometry", function () {
            attributes.bboxGeometry = {
                intersectsExtent: (extent) => {
                    if (extent.includes("1")) {
                        return true;
                    }
                    return false;
                },
                getExtent: () => ["1"]
            };
            const wfsLayer = new Layer2dVector(attributes),
                features = [{
                    id: "1",
                    getGeometry: () => {
                        return {
                            getExtent: () => ["1"]
                        };

                    }
                },
                {
                    id: "2",
                    getGeometry: () => undefined
                },
                {
                    id: "3",
                    getGeometry: () => {
                        return {
                            getExtent: () => ["2"]
                        };
                    }
                }],
                wfsFeatureFilter = wfsLayer.featuresFilter(attributes, features);

            expect(wfsFeatureFilter.length).to.be.equals(1);
            expect(wfsFeatureFilter[0].id).to.be.equals("1");
        });
    });

    describe("onLoadingError", () => {
        it("should print a console.error", () => {
            const wfsLayer = new Layer2dVector(attributes);

            wfsLayer.onLoadingError("The error message");

            expect(error.calledOnce).to.be.true;
        });
    });
});
