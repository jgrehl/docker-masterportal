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
});
