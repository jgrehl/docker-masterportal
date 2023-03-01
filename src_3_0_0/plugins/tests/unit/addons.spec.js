import {expect} from "chai";
import {config} from "@vue/test-utils";
import sinon from "sinon";
import addons from "../../plugins/addons";


describe.only("src/plugins/addons.js", () => {

    beforeEach(() => {
        config.globalProperties = {};
        config.globalProperties.$toolAddons = [];
        config.globalProperties.$gfiThemeAddons = [];
        config.globalProperties.$controlAddons = [];

    });

    afterEach(() => {
        sinon.restore();
    });
    describe("loadAddons", () => {
        it("if config is undefined nothing happens", async () => {
            const spy = sinon.spy(addons, "loadToolAddons");

            await addons.loadAddons([undefined]);
            expect(await spy.notCalled).to.be.true;
        });
    });
});
