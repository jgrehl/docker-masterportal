import {expect} from "chai";
import sinon from "sinon";
import Layer3d from "../../../js/layer3d";
import createStyle from "@masterportal/masterportalapi/src/vectorStyle/createStyle";
import styleList from "@masterportal/masterportalapi/src/vectorStyle/styleList.js";

describe("src_3_0_0/core/js/layers/layer3d.js", () => {
    let warn;

    beforeEach(() => {
        warn = sinon.spy();
        sinon.stub(console, "warn").callsFake(warn);

        mapCollection.clear();
        const map = {
            id: "olcs",
            mode: "3D"
        };

        mapCollection.addMap(map, "3D");
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("createLayer", () => {
        it("new Layer3d should create an layer with warning", () => {
            const layer3d = new Layer3d({});

            expect(layer3d).not.to.be.undefined;
            expect(warn.calledOnce).to.be.true;
        });
    });

    describe("updateLayerValues", () => {
        it("updates the visibility of the 3d layer to true", () => {
            const setVisibleSpy = sinon.spy(Layer3d.prototype, "setVisible"),
                layer3d = new Layer3d({visibility: false});

            layer3d.updateLayerValues({visibility: true});

            expect(setVisibleSpy.calledOnce).to.be.true;
            expect(setVisibleSpy.firstCall.args[0]).to.equals(true);
            expect(setVisibleSpy.firstCall.args[1]).to.deep.equals({
                id: "olcs",
                mode: "3D"
            });
            expect(setVisibleSpy.firstCall.args[2]).to.deep.equals({visibility: true});

        });
    });

    describe("createLegend", () => {
        let createStyleSpy,
            attributes;

        beforeEach(() => {
            const styleObj = {
                styleId: "styleId",
                rules: []
            };

            attributes = {
                id: "id",
                version: "1.3.0"
            };
            createStyleSpy = sinon.spy(createStyle, "returnLegendByStyleId");
            sinon.stub(styleList, "returnStyleObject").returns(styleObj);
        });

        it("createLegend with legendURL", () => {
            attributes.legendURL = "legendUrl1";
            const layerWrapper = new Layer3d(attributes);

            layerWrapper.createLegend();
            expect(layerWrapper.getLegend()).to.be.deep.equals([attributes.legendURL]);
        });

        it("createLegend with legendURL as array", () => {
            attributes.legendURL = ["legendUrl1"];
            const layerWrapper = new Layer3d(attributes);

            layerWrapper.createLegend();
            expect(layerWrapper.getLegend()).to.be.deep.equals(attributes.legendURL);
        });

        it("createLegend with styleObject and legend true", () => {
            attributes.legend = true;
            const layerWrapper = new Layer3d(attributes);

            layerWrapper.createLegend();
            // call once on creating layer and second here
            expect(createStyleSpy.calledTwice).to.be.true;
        });
    });
});
