import VectorTile from "../../vectorTile.js";

import {expect} from "chai";
import sinon from "sinon";

describe("core/modelList/layer/vectorTile", function () {
    afterEach(sinon.restore);

    describe("createLegendURL", function () {
        /** @returns {object} mock context for setStyleById */
        function makeContext () {
            return {
                setLegendURL: sinon.spy(() => Symbol.for("Promise"))
            };
        }
        it("sets the legend URL", function () {
            const context = makeContext();

            VectorTile.prototype.createLegendURL.call(context);
            expect(context.setLegendURL.calledOnce).to.be.true;
        });
    });

    describe("showFeaturesByIds", function () {
        it("should do nothing if first param is not an array", () => {
            const mapStub = sinon.stub(store, "getters");
            let vtLayer = null,
                layer = null,
                tileLoadFunction = null,
                source = null;

            mapStub.value({"Maps/projection": {getCode: () => {
                return "EPSG:25832";
            }}});

            vtLayer = new VectorTile(attrs);
            layer = vtLayer.get("layer");
            source = layer.getSource();
            tileLoadFunction = source.getTileLoadFunction();
            vtLayer.showFeaturesByIds();
            expect(source.getTileLoadFunction()).to.deep.equal(tileLoadFunction);
            sinon.restore();
        });
        it("should set tileLoadFunction", () => {
            const mapStub = sinon.stub(store, "getters");
            let vtLayer = null,
                layer = null,
                tileLoadFunction = null,
                source = null;

            mapStub.value({"Maps/projection": {getCode: () => {
                return "EPSG:25832";
            }}});

            vtLayer = new VectorTile(attrs);
            layer = vtLayer.get("layer");
            source = layer.getSource();
            tileLoadFunction = source.getTileLoadFunction();
            expect(tileLoadFunction.name).to.be.equal("defaultLoadFunction");
            vtLayer.showFeaturesByIds([]);
            expect(source.getTileLoadFunction()).to.not.be.equal("defaultLoadFunction");
            sinon.restore();
        });
    });
});
