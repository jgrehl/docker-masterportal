import {expect} from "chai";
import getters from "../../../store/gettersSelectFeatures";
import stateSelectFeatures from "../../../store/stateSelectFeatures";


const {
    active,
    type,
    name,
    icon} = getters;

describe("src/modules/selectFeatures/store/gettersSelectFeatures", function () {
    it("returns the active from state", function () {
        expect(active(stateSelectFeatures)).to.be.false;
    });
    it("returns the type from state", function () {
        expect(type(stateSelectFeatures)).to.equals("selectFeatures");
    });

    describe("testing default values", function () {
        it("returns the name default value from state", function () {
            expect(name(stateSelectFeatures)).to.be.equals("common:menu.tools.selectFeatures");
        });
        it("returns the icon default value from state", function () {
            expect(icon(stateSelectFeatures)).to.equals("bi-card-list");
        });
    });
});
