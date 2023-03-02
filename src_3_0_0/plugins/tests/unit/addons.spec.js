import {expect} from "chai";
import sinon from "sinon";
import addons from "../../../plugins/addons";
import main from "../../../main";


describe("src/plugins/addons.js", () => {
    const globalProperties = {
        config:
        {
            globalProperties:
            {}
        }
    };

    beforeEach(() => {
        sinon.stub(main, "getApp").returns(globalProperties);

    });

    afterEach(() => {
        sinon.restore();
    });
    describe("loadAddons", () => {
        it("if config is undefined nothing happens", async () => {
            const spyloadToolAddons = sinon.spy(addons, "loadToolAddons"),
                spyloadGfiThemes = sinon.spy(addons, "loadGfiThemes"),
                loadControl = sinon.spy(addons, "loadControl");

            await addons.loadAddons([undefined]);
            expect(await spyloadToolAddons.notCalled).to.be.true;
            expect(await spyloadGfiThemes.notCalled).to.be.true;
            expect(await loadControl.notCalled).to.be.true;
        });
    });
});
