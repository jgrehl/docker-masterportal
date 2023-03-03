import {expect} from "chai";
import sinon from "sinon";
import legendDraw from "../../../js/legendDraw";

describe("src_3_0_0/modules/legend/js/legendDraw", function () {

    afterEach(sinon.restore);

    describe("drawIntervalStyle", function () {
        it("with scalingShape 'CIRCLE_BAR'", function () {
            const style = {
                    scalingShape: "CIRCLE_BAR",
                    scalingAttribute: "scalingAttribute"
                },
                intervalStyle = {
                    style: "x"
                };
            let result = null;

            sinon.stub(legendDraw, "drawIntervalCircleBars").returns(intervalStyle);

            result = legendDraw.drawIntervalStyle(style);
            expect(result).to.deep.equal(intervalStyle);
        });

        it("without scalingShape 'CIRCLE_BAR'", function () {
            const style = {
                    scalingShape: "scalingShape",
                    scalingAttribute: "scalingAttribute"
                },
                intervalStyle = {
                    style: "x"
                };
            let result = null;

            sinon.stub(legendDraw, "drawIntervalCircleBars").returns(intervalStyle);

            result = legendDraw.drawIntervalStyle(style);
            expect(result).to.deep.equal([]);
        });
    });

    describe("drawNominalStyle", function () {
        it("with scalingShape 'circlesegments'", function () {
            const style = {
                    attributes: {
                        scalingShape: "circleSegments"
                    }
                },
                nominalStyle = {
                    style: "x"
                };
            let result = null;

            sinon.stub(legendDraw, "drawNominalCircleSegments").returns(nominalStyle);

            result = legendDraw.drawNominalStyle(style);
            expect(result).to.deep.equal(nominalStyle);
        });

        it("drawIntervalStyle without scalingShape 'circlesegments'", function () {
            const style = {
                    attributes: {
                        scalingShape: "scalingShape"
                    }
                },
                nominalStyle = {
                    style: "x"
                };
            let result = null;

            sinon.stub(legendDraw, "drawNominalCircleSegments").returns(nominalStyle);

            result = legendDraw.drawNominalStyle(style);
            expect(result).to.deep.equal([]);
        });
    });

    describe("drawNominalCircleSegments", function () {
        it("simple circle segment", function () {
            const styleObject = {
                    attributes: {
                        scalingValues: {
                            "a": "b",
                            "c": "d"
                        }
                    },
                    style: {
                        getImage: () => {
                            return {
                                getSrc: () => "src"
                            };
                        }
                    }
                },
                result = legendDraw.drawNominalCircleSegments(styleObject);

            expect(result).to.be.an("Array");
            expect(result.length).to.be.equals(2);
            expect(result[0].name).to.be.equals("a");
            expect(result[0].graphic).to.be.equals("src");
            expect(result[1].name).to.be.equals("c");
            expect(result[1].graphic).to.be.equals("src");
        });

        it("nominal circle segment", function () {
            const styleObject = {
                    attributes: {
                        imageScale: "2",
                        scalingValues: {
                            "a": "b",
                            "c": "d"
                        }
                    },
                    style: [{
                        getImage: () => {
                            return {
                                getSrc: () => "src1",
                                getSize: () => [1, 1]
                            };
                        }
                    }, {
                        getImage: () => {
                            return {
                                getSrc: () => "src2",
                                getSize: () => [2, 2]
                            };
                        }
                    }
                    ]
                },
                result = legendDraw.drawNominalCircleSegments(styleObject);

            expect(result).to.be.an("Array");
            expect(result.length).to.be.equals(2);
            expect(result[0].name).to.be.equals("a");
            expect(result[0].graphic).to.be.an("Array");
            expect(result[0].iconSize).to.be.an("Array");
            expect(typeof result[0].iconSize[0]).to.be.equals("number");
            expect(typeof result[0].iconSizeDifferenz).to.be.equals("number");
            expect(result[1].name).to.be.equals("c");
            expect(result[1].graphic).to.be.an("Array");
            expect(result[1].iconSize).to.be.an("Array");
            expect(typeof result[1].iconSize[0]).to.be.equals("number");
            expect(typeof result[1].iconSizeDifferenz).to.be.equals("number");
        });

        // todo inka: hier weiter testen...

    });
});
