import actions from "../../../../store/actions/actionsSearchBarSuggestionList";
import {expect} from "chai";


describe("src/modules/searchBar/store/actions/actionsSearchBarSuggestionList.spec.js", () => {
    describe("activateLayerInTopicTree", () => {
        it("getConf", async () => {
            const rootState = {configJson: "configJson"},
                testResult = await actions.getconf({rootState});

            expect(testResult).to.deep.equal("configJson");
        });
    });


});
