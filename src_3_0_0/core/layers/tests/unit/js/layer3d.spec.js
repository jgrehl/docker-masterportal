import {expect} from "chai";
import sinon from "sinon";
import Layer3d from "../../../js/layer3d";

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
});
